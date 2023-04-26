import { Worker } from 'node:worker_threads';
import { logger } from '../utils/Logger';
import { THashcatRunningStatus, THashcatStatus } from '../types/THashcat';
import { TTask } from '../types/TApi';
import { TProcessStdout } from '../utils/Processus';
import { Events } from '../utils/Events';

type THashcatListenerProperties = {
   worker: Worker;
   task: TTask;
   handleTaskHasFinnished: (task: TTask) => void;
   sendNotification: Events['sendNotification'];
};

export class HashcatListener {
   public state: THashcatStatus;
   private task: TTask;
   private hashcatWorker: Worker;
   private handleTaskHasFinnished: (task: TTask) => void;
   private sendNotification: Events['sendNotification'];

   constructor({
      worker,
      task,
      handleTaskHasFinnished,
      sendNotification,
   }: THashcatListenerProperties) {
      this.hashcatWorker = worker;
      this.task = task;
      this.handleTaskHasFinnished = handleTaskHasFinnished;
      this.state = {
         processState: 'pending',
         taskInfos: {
            name: this.task.name,
         },
         exitInfo: {
            message: '',
            isError: false,
         },
         runningStatus: <THashcatRunningStatus>{},
      };
      this.sendNotification = sendNotification;
   }

   public listen = (processStdout: TProcessStdout) => {
      if (
         Object.keys(this.state.runningStatus).length > 0 ||
         this.isProcessSendStatus(processStdout)
      ) {
         this.state.processState = 'running';
      }
      if (this.isProcessExited(processStdout)) {
         this.state.processState = 'stopped';
         this.onExitProcess(processStdout);
      } else if (this.isProcessSendStatus(processStdout)) {
         this.state.runningStatus = <THashcatRunningStatus>processStdout.status;
      } else {
         if (this.isProcessSendArrayInfo(processStdout)) {
            logger.debug(
               '\n-------------------Hashcat warning-------------------\n' +
                  processStdout.anyOutput +
                  '\n---------------------------------------------------------'
            );
         } else {
            logger.debug('Message from stdout: ' + processStdout.anyOutput);
         }
      }
   };

   private onExitProcess(processStdout: TProcessStdout): void {
      switch (processStdout.exit.message) {
         case 'exit':
            this.handleTaskHasFinnished(this.task);
            break;
         case 'exhausted':
            this.onExhaustedExit();
            break;
         case 'error':
            this.sendNotification(
               'error',
               `Process: ${this.task.name} ended with an error !`
            );
            logger.debug('Status: Error');
            break;
         default:
            this.sendNotification(
               'error',
               `Unexpected process exit : ${processStdout.exit.message} - code ${processStdout.exit.code}`
            );
      }
      this.stopListener();
   }

   private onExhaustedExit(): void {
      const [nbOfCrackedPasswords, amountOfPasswords] = this.state.runningStatus
         .recovered_hashes || [0, 0];
      logger.debug('Status: Exhausted');
      if (nbOfCrackedPasswords > 0) {
         this.task.hashlistId.numberOfCrackedPasswords = nbOfCrackedPasswords;
         this.sendNotification(
            'success',
            'Process: Hashcat ended and cracked ' +
               `${nbOfCrackedPasswords}/${amountOfPasswords} passwords`
         );
         this.handleTaskHasFinnished(this.task);
      } else {
         this.state.exitInfo = {
            message: 'No passwords recovered',
            isError: true,
         };
         this.sendNotification(
            'warning',
            `Process: ${this.task.name} ended but no passwords were cracked !`
         );
      }
   }

   private isProcessExited(processStdout: TProcessStdout): boolean {
      try {
         return (
            processStdout.exit.message !== '' && processStdout.exit.code >= 0
         );
      } catch (e) {
         return false;
      }
   }

   private isProcessSendStatus(processStdout: TProcessStdout): boolean {
      try {
         return Object.keys(processStdout.status).length > 0;
      } catch (e) {
         return false;
      }
   }

   private isProcessSendArrayInfo(processStdout: TProcessStdout): boolean {
      try {
         return (processStdout.anyOutput as string).match(/\n/g) !== null;
      } catch (e) {
         return false;
      }
   }

   private stopListener(): void {
      this.state.processState = 'stopped';
      this.state.runningStatus = <THashcatRunningStatus>{};
      this.hashcatWorker.terminate();
   }
}
