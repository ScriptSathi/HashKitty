import path from 'path';
import fs from 'fs-extra';

import { Constants } from '../../Constants';
import { TTask, UploadFileType } from '../../types/TApi';
import { ResponseAttr, TaskUpdate, UploadFile } from '../../types/TRoutes';
import { Events } from '../../utils/Events';
import { Dao } from '../DAOs/Dao';
import { Sanitizer } from '../Sanitizer';
import GenericController from './GenericResponse';
import { FsUtils } from '../../utils/FsUtils';
import { UploadedFile } from 'express-fileupload';

export default class ListController {
   private dao: Dao;
   private notify: Events['notify'];

   constructor(dao: Dao) {
      this.dao = dao;
      this.notify = new Events(this.dao.notification).notify;
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
         this.notify('error', sanitizer.errorMessage);
         return {
            httpCode: 401,
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
         this.notify('success', respMessage);
         return {
            success: true,
            message: respMessage,
            httpCode: 200,
         };
      } catch (err) {
         const message = (err as Error).message || 'An error occurred';
         this.notify('error', message);
         return {
            message,
            httpCode: 500,
            success: false,
         };
      }
   }
}
