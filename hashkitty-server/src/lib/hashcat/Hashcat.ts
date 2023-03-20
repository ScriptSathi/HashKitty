import path = require('node:path');
import { Worker } from 'node:worker_threads';
import * as fs from 'fs-extra';

import { Constants } from '../Constants';
import { FsUtils } from '../utils/FsUtils';
import { TTask } from '../types/TApi';
import { THashcatRunningStatus, THashcatStatus } from '../types/THashcat';
import { logger } from '../utils/Logger';
import { Task } from '../ORM/entity/Task';
import { Dao } from '../API/DAOs/Dao';
import { Hashlist } from '../ORM/entity/Hashlist';
import { HashcatListener } from './HashcatListener';
import { HashcatGenerator } from './HashcatGenerator';
import { Events } from '../utils/Events';

type currentJobData = {
   task: TTask;
   outputFilePath: string;
};

export class Hashcat {
   private listener: HashcatListener | undefined;
   private currentJobData: currentJobData | undefined;
   private cmd: string;
   private dao: Dao;
   private fsUtils: FsUtils;
   private hashcatWorker: Worker | undefined;
   private notify: Events['notify'];

   constructor(dao: Dao, notify: Events['notify']) {
      this.cmd = '';
      this.dao = dao;
      this.fsUtils = new FsUtils(Constants.hashlistsPath);
      this.notify = notify;
   }

   public get status(): THashcatStatus {
      return this.listener
         ? this.listener.state
         : {
              processState: 'stopped',
              exitInfo: {
                 message: '',
                 isError: false,
              },
              runningStatus: <THashcatRunningStatus>{},
           };
   }

   public get isRunning(): boolean {
      return this.listener
         ? this.listener.state.processState === 'running'
         : false;
   }

   public exec(task: TTask): void {
      const generator = new HashcatGenerator(task);
      this.cmd = generator.generateStartCmd();
      this.registerCurrentJob({
         task,
         outputFilePath: generator.outputFilePath,
      });
      if (this.hashlistHaveNeverBeenCracked(task)) {
         this.startListener(task);
      } else {
         this.closeTask(task);
      }
   }

   public stop(): void {
      if (this.hashcatWorker) {
         this.notify('info', 'Stopping the hashcat process');
         this.hashcatWorker.postMessage('exit');
      }
   }

   public restore(task: TTask): void {
      const generator = new HashcatGenerator(task);
      this.cmd = generator.generateRestoreCmd();
      this.registerCurrentJob({
         task,
         outputFilePath: generator.outputFilePath,
      });
      if (this.hashlistHaveNeverBeenCracked(task)) {
         this.startListener(task);
      } else {
         this.closeTask(task);
      }
   }

   private get outputFileExists(): boolean {
      if (!this.currentJobData?.outputFilePath) {
         return false;
      }
      return fs.existsSync(this.currentJobData.outputFilePath);
   }

   private listenProcess(): void {
      if (this.listener && this.hashcatWorker) {
         this.hashcatWorker.on('message', this.listener.listen);
      }
   }

   private createWorkerThread(): Worker {
      return new Worker(path.join(__dirname, '../utils/Processus.js'));
   }

   private hashlistHaveNeverBeenCracked(task: TTask): boolean {
      return task.hashlistId.crackedOutputFileName === null;
   }

   private handleTaskHasFinnished = (task: TTask): void => {
      this.dao.task.registerTaskEnded(task as unknown as Task);
      if (this.currentJobData) {
         this.currentJobData.task.hashlistId.crackedOutputFileName =
            this.currentJobData.outputFilePath;
         this.dao.hashlist.update(
            this.currentJobData.task.hashlistId as unknown as Hashlist,
            false
         );
      }
      if (!this.outputFileExists) {
         this.generateOutputFileFromPotfile();
      }
   };

   private generateOutputFileFromPotfile(): void {
      if (!this.outputFileExists) {
         const tmpProcess = this.createWorkerThread();
         const cmdShow = this.cmd + ' --show';
         logger.info('Generating the output file based on potfile recordes');
         tmpProcess.postMessage(cmdShow);
         setTimeout(() => {
            tmpProcess.terminate();
         }, 1000);
      }
   }
   private registerCurrentJob({ task, outputFilePath }: currentJobData) {
      this.currentJobData = {
         task,
         outputFilePath,
      };
   }

   private startListener(task: TTask) {
      this.hashcatWorker = this.createWorkerThread();
      this.listener = new HashcatListener({
         worker: this.hashcatWorker,
         task,
         handleTaskHasFinnished: this.handleTaskHasFinnished,
         notify: this.notify,
      });
      this.notify('info', `Starting cracking task : "${task.name}"`);
      this.hashcatWorker.postMessage(this.cmd);
      this.listenProcess();
   }

   private closeTask(task: TTask) {
      this.notify(
         'warning',
         `Task "${task.name} has been ended because the hash list ${task.hashlistId.name} has already been cracked"`
      );
      this.handleTaskHasFinnished(task);
   }
}
