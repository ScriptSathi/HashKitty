import { ResponseAttr } from '../../types/TRoutes';
import { Events } from '../../utils/Events';
import { Dao } from '../DAOs/Dao';

export default class OptionController {
   private dao: Dao;
   private sendNotification: Events['sendNotification'];

   constructor(dao: Dao) {
      this.dao = dao;
      this.sendNotification = new Events(
         this.dao.notification
      ).sendNotification;
   }

   public async getAllAttackModes(): Promise<ResponseAttr> {
      try {
         const items = await this.dao.attackMode.getAll();
         return {
            message: '',
            items,
            success: true,
            httpCode: 200,
         };
      } catch (err) {
         const errorMsg = `An error occured while trying to delete template: ${err}`;
         this.sendNotification('error', errorMsg);
         return {
            httpCode: 500,
            message: errorMsg,
            error: `[ERROR]: ${err}`,
            success: false,
         };
      }
   }

   public async getAllHashTypes(): Promise<ResponseAttr> {
      try {
         const items = await this.dao.hashType.getAll();
         return {
            message: '',
            items,
            success: true,
            httpCode: 200,
         };
      } catch (err) {
         const errorMsg = `An error occured while trying to delete template: ${err}`;
         this.sendNotification('error', errorMsg);
         return {
            httpCode: 500,
            message: errorMsg,
            error: `[ERROR]: ${err}`,
            success: false,
         };
      }
   }
}
