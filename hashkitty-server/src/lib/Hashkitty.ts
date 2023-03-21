import { DataSource } from 'typeorm';
import * as fs from 'fs-extra';
import cluster from 'node:cluster';
import { availableParallelism } from 'node:os';

import { logger } from './utils/Logger';
import { AppDataSource } from './ORM/data-source';
import { Constants } from './Constants';
import { HttpServer } from './API/HttpServer';
import { Dao } from './API/DAOs/Dao';

export class Hashkitty {
   private db: DataSource | undefined;

   public async bootstrap(): Promise<void> {
      await this.connectToDb();
      this.createStorageDir();
      this.migrateDBIfNeeded();
      this.startHTTPServer();
   }

   private migrateDBIfNeeded() {
      if (this.db) {
         Dao.migrateOnInitDb(this.db);
      }
   }

   private startHTTPServer() {
      this.parallelizeCpus(() => {
         if (this.db) {
            new HttpServer(Constants.defaultApiConfig, this.db).listen();
         }
      });
   }

   private async connectToDb(): Promise<void> {
      if (!this.db) {
         try {
            this.db = await AppDataSource.initialize();
         } catch (error) {
            const sleepTime = 5;
            logger.error(error);
            logger.info(
               `Error while trying to connect to MySQL, retry in ${sleepTime} seconds`
            );
            await new Promise<void>(resolve =>
               setTimeout(() => {
                  resolve(this.connectToDb());
               }, sleepTime * 1000)
            );
         }
      }
   }

   private createStorageDir(): void {
      const listsPaths = [
         Constants.potfilesPath,
         Constants.rulesPath,
         Constants.wordlistPath,
         Constants.hashlistsPath,
         Constants.restorePath,
         Constants.outputFilePath,
         Constants.masksPath,
      ];
      for (const dir of listsPaths) {
         fs.access(dir).catch(() =>
            fs.mkdir(dir, { recursive: true }, () =>
               logger.debug(`Creating ${dir}`)
            )
         );
      }
   }

   private parallelizeCpus(startWorkerTask: () => void) {
      const numCPUs = availableParallelism();
      if (cluster.isPrimary) {
         for (let i = 0; i < numCPUs; i++) {
            cluster.fork();
         }
         cluster.on('exit', () => {
            logger.info(`PID ${process.pid} dies, starting another one`);
            cluster.fork();
         });
      } else {
         startWorkerTask();
      }
   }
}
