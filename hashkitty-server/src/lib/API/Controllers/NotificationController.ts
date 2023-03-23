import { ResponseAttr } from '../../types/TRoutes';
import { Events } from '../../utils/Events';
import { Dao } from '../DAOs/Dao';
import GenericController from './GenericResponse';

export default class NotificationController {
   private dao: Dao;
   private sendNotification: Events['sendNotification'];

   constructor(dao: Dao) {
      this.dao = dao;
      this.sendNotification = new Events(
         this.dao.notification
      ).sendNotification;
   }

   public async delete(notificationId: number): Promise<ResponseAttr> {
      if (!(await this.dao.notificationExistById(notificationId))) {
         return GenericController.responseNoCorrespondingItem('notification');
      }
      try {
         this.dao.notification.deleteById(notificationId);
         const respMessage = `Notification ${notificationId} deleted successfully`;
         this.sendNotification('debug', respMessage);
         return {
            message: respMessage,
            httpCode: 200,
            success: true,
         };
      } catch (err) {
         const errorMsg = `An error occured while trying to delete the notification: ${err}`;
         this.sendNotification('error', errorMsg);
         return {
            httpCode: 500,
            message: errorMsg,
            error: `[ERROR]: ${err}`,
            success: false,
         };
      }
   }

   public async getAll(): Promise<ResponseAttr> {
      try {
         const items = await this.dao.notification.getAll();
         return {
            message: '',
            items,
            httpCode: 200,
            success: true,
         };
      } catch (err) {
         const message = (err as Error).message || 'An error occurred';
         this.sendNotification('error', message);
         return {
            message,
            httpCode: 500,
            success: false,
            items: [],
         };
      }
   }
}
