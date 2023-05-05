import { Hashcat } from '../../hashcat/Hashcat';
import { TTask } from '../../types/TApi';
import { ResponseAttr } from '../../types/TRoutes';
import { Events } from '../../utils/Events';
import { Dao } from '../DAOs/Dao';
import GenericController from './GenericResponse';

export default class HashcatController {
   private dao: Dao;
   private sendNotification: Events['sendNotification'];
   private hashcat: Hashcat;

   constructor(dao: Dao) {
      this.dao = dao;

      this.sendNotification = new Events(
         this.dao.notification
      ).sendNotification;
      this.hashcat = new Hashcat(this.dao, this.sendNotification);
   }

   public async exec(taskId: number): Promise<ResponseAttr> {
      if (this.hashcat.isRunning) {
         this.sendNotification(
            'warning',
            'A task is already running, please shut it down before running another one'
         );
         return {
            httpCode: 400,
            message: 'Hashcat is already running',
            success: false,
         };
      }
      if (!(await this.dao.taskExistById(taskId))) {
         return GenericController.responseNoCorrespondingItem('task');
      }
      try {
         const task = (await this.dao.task.getById(taskId)) as unknown as TTask;
         this.hashcat.exec(task);
         return {
            httpCode: 200,
            message: 'Hashcat has started successfully',
            success: true,
         };
      } catch (e) {
         const errorMsg = `An error occured while trying to start task: ${e}`;
         this.sendNotification('error', errorMsg);
         return {
            httpCode: 500,
            message: errorMsg,
            error: `[ERROR]: ${e}`,
            success: false,
         };
      }
   }

   public getStatus(): ResponseAttr {
      return {
         message: '',
         httpCode: 200,
         status: this.hashcat.status,
         success: true,
      };
   }

   public stop(): ResponseAttr {
      if (this.hashcat.isRunning) {
         this.hashcat.stop();
         return {
            message: 'Hashcat stopped successfully',
            status: this.hashcat.status,
            httpCode: 200,
            success: true,
         };
      } else {
         return {
            message: 'Hashcat is not running',
            status: {},
            httpCode: 400,
            success: false,
         };
      }
   }
}
