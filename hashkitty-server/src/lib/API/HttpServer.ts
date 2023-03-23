import * as http from 'http';
import * as https from 'https';
import { AddressInfo } from 'net';
import * as fs from 'fs';
import express from 'express';
import fileUpload from 'express-fileupload';
import cors from 'cors';

import { logger } from '../utils/Logger';
import { IHttpServer, THttpServerConfig } from '../types/TApi';
import { ApiRouter } from './ApiRoutes';
import { DataSource } from 'typeorm';

export class HttpServer implements IHttpServer {
   private app: express.Application;
   private config: THttpServerConfig;
   private server!: http.Server | https.Server;

   constructor(config: THttpServerConfig, db: DataSource) {
      this.config = config;
      this.app = express();

      this.enableCORS();
      this.enableFileUpload();
      this.registerRoutes(new ApiRouter(db).router);
      //TODO Add MiddleWare to prevent remote user communicate with the API (check preflight cors)
      //TODO Check bellow
      // const expiryDate = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
      // app.use(session({
      // name: 'session',
      // keys: ['key1', 'key2'],
      // cookie: {
      //     secure: true,
      //     httpOnly: true,
      //     domain: 'example.com',
      //     path: 'foo/bar',
      //     expires: expiryDate
      // }
      // }))
   }

   public async listen(): Promise<void> {
      this.server = this.createHttpServer();

      this.server.keepAliveTimeout = 61 * 1000;
      this.server.headersTimeout = 65 * 1000;

      return new Promise(resolve => {
         this.server.listen(this.config.port, () => {
            logger.info(
               `PID: ${process.pid} - Http server started successfully on port ${this.serverListenPort}`
            );
            resolve();
         });
      });
   }

   public get serverListenPort(): number {
      return (this.server.address() as AddressInfo).port || -1;
   }

   public checkHealth(): void {
      if (!this.server || !this.server.listening) {
         throw new Error('Http server is not Listening');
      }
   }

   public close(): Promise<void> {
      return new Promise((resolve, reject) => {
         if (!this.server || !this.server.listening) {
            logger.warn('Http server already stopped !');
            return resolve();
         }
         this.server.close(err => {
            if (err) {
               reject(err);
            }
            logger.info('Http server stopped successfully');
            resolve();
         });
      });
   }

   private createHttpServer(): http.Server | https.Server {
      const ssl = this.config.ssl || { use: false };
      if (ssl.use) {
         try {
            const credentials = {
               key: fs.readFileSync(ssl.key || '', 'utf8'),
               cert: fs.readFileSync(ssl.cert || '', 'utf8'),
            };
            return https.createServer(credentials, this.app);
         } catch (err) {
            logger.error(
               'Error while creating https server with key: ' +
                  ssl.key +
                  ' and certificate: ' +
                  ssl.cert +
                  '; ',
               err
            );
            throw err;
         }
      }
      logger.warn(
         'SSL is disable, the program can not perform HTTPS encryption'
      );
      return http.createServer(this.app);
   }

   private registerRoutes(apiRouter: express.Router): void {
      this.app.use('/api', apiRouter);
   }

   private enableCORS(): void {
      this.app.use(
         cors({
            origin: '*',
            methods: 'GET,POST,DELETE',
            allowedHeaders: ['Content-Type'],
         })
      );
   }

   private enableFileUpload(): void {
      this.app.use(
         fileUpload({
            limits: { fileSize: 50 * 1024 * 1024 },
            useTempFiles: true,
            tempFileDir: '/tmp/',
         })
      );
   }
}
