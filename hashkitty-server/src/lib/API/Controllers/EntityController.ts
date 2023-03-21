import { TTask } from '../../types/TApi';
import { ResponseAttr } from '../../types/TRoutes';
import { Events } from '../../utils/Events';
import { Dao } from '../DAOs/Dao';
import GenericController from './GenericResponse';

export default class EntityController {
   private dao: Dao;
   private notify: Events['notify'];

   constructor(dao: Dao) {
      this.dao = dao;
      this.notify = new Events(this.dao.notification).notify;
   }

   public async deleteTask(taskId: number): Promise<ResponseAttr> {
      if (await this.dao.taskExistById(taskId)) {
         return GenericController.responseNoCorrespondingTask();
      }
      try {
         const task = (await this.dao.task.getById(taskId)) as unknown as TTask;
         this.dao.task.deleteById(taskId);
         const respMessage = `Task "${task.name}" deleted successfully`;
         this.notify('success', respMessage);
         return {
            message: respMessage,
            httpCode: 200,
            success: true,
         };
      } catch (err) {
         const errorMsg = `An error occured while trying to delete task: ${err}`;
         this.notify('error', errorMsg);
         return {
            httpCode: 500,
            message: errorMsg,
            error: `[ERROR]: ${err}`,
            success: false,
         };
      }
   }
}
