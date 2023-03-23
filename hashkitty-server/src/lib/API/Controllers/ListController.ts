import { UploadFileType } from '../../types/TApi';
import { ResponseAttr, UploadFile } from '../../types/TRoutes';
import { Events } from '../../utils/Events';
import { Dao } from '../DAOs/Dao';
import { Sanitizer } from '../Sanitizer';
import { FsUtils } from '../../utils/FsUtils';
import { UploadedFile } from 'express-fileupload';

export default class ListController {
   private dao: Dao;
   private sendNotification: Events['sendNotification'];

   constructor(dao: Dao) {
      this.dao = dao;
      this.sendNotification = new Events(
         this.dao.notification
      ).sendNotification;
   }

   public async upload({
      type,
      hashTypeId,
      fileName,
      file,
   }: UploadFile & {
      type: UploadFileType;
      hashTypeId?: number;
      file: UploadedFile;
   }): Promise<ResponseAttr> {
      const typeData = FsUtils.getFileTypeData(type);
      const sanitizer = new Sanitizer(this.dao);
      await sanitizer.analyseList({ type, hashTypeId, fileName });

      if (!sanitizer.hasSucceded) {
         this.sendNotification('error', sanitizer.errorMessage);
         return {
            httpCode: 400,
            message: sanitizer.errorMessage,
            success: false,
         };
      }

      try {
         let name = '';
         if (typeData.isHashlist) {
            const hashlist = sanitizer.getHashlist();
            await this.dao.hashlist.update(hashlist);
            name = hashlist.name;
         } else {
            name = sanitizer.getList().fileName;
         }
         const respMessage = `File ${name} uploaded, successfully`;
         FsUtils.uploadFile(file, name, type);
         this.sendNotification('success', respMessage);
         return {
            success: true,
            message: respMessage,
            httpCode: 200,
         };
      } catch (err) {
         const message = (err as Error).message || 'An error occurred';
         this.sendNotification('error', message);
         return {
            message,
            httpCode: 500,
            success: false,
         };
      }
   }

   public async getAllHashlists(): Promise<ResponseAttr> {
      try {
         const items = await this.dao.hashlist.getAll();
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

   public async reloadWordlists(): Promise<ResponseAttr> {
      try {
         await this.dao.reloadWordlistInDB();
         return {
            message: 'Update successfully',
            success: true,
            httpCode: 200,
         };
      } catch (err) {
         const message = (err as Error).message || 'An error occurred';
         this.sendNotification('error', message);
         return {
            message,
            httpCode: 500,
            success: false,
         };
      }
   }
}
