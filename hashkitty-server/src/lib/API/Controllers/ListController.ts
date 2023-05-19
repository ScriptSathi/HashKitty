import { UploadFileType } from '../../types/TApi';
import { ResponseAttr, UploadFile } from '../../types/TRoutes';
import { Events } from '../../utils/Events';
import { Dao } from '../DAOs/Dao';
import { Sanitizer } from '../Sanitizer';
import { FsUtils } from '../../utils/FsUtils';
import { UploadedFile } from 'express-fileupload';
import { logger } from '../../utils/Logger';
import { Wordlist } from '../../ORM/entity/Wordlist';

export default class ListController {
   private dao: Dao;
   private sendNotification: Events['sendNotification'];
   private fsUtils: FsUtils;

   constructor(dao: Dao, events: Events) {
      this.dao = dao;
      this.fsUtils = new FsUtils();
      this.sendNotification = events.sendNotification;
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
         } else if (typeData.isWordlist) {
            const wordlist = sanitizer.getWordlist();
            await this.dao.db.getRepository(Wordlist).save(wordlist);
            name = wordlist.name;
         } else {
            name = sanitizer.getList().fileName;
         }
         const respMessage = `File ${name} uploaded successfully`;
         this.fsUtils.uploadFile(file, name, type);
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
         const hashlists = await this.dao.hashlist.getAll();
         const items = await this.dao.getListContext(
            hashlists,
            (hashlist, task) => hashlist.id === task.hashlistId.id,
            true
         );
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

   public async getAllWordlists(): Promise<ResponseAttr> {
      try {
         const wordlists = await this.dao.db.getRepository(Wordlist).find();
         const items = await this.dao.getListContext(
            wordlists,
            (wordlists, task) => {
               const wordlistExistInTask = !!task.options.wordlistId;
               return (
                  wordlistExistInTask &&
                  wordlists.id === task.options.wordlistId?.id
               );
            },
            true
         );
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

   public async delete({
      type,
      fileName,
   }: UploadFile & {
      type: UploadFileType;
   }): Promise<ResponseAttr> {
      if (type === 'hashlist') {
         const hashlistDeletionIsInError =
            await this.deleteHashlistSpecification(fileName);
         if (hashlistDeletionIsInError) {
            return {
               message: `The file ${fileName} could not be deleted`,
               httpCode: 400,
               success: false,
            };
         }
      }
      const tasksWhereListIsReferenced = await this.dao.getReferenceOfList(
         type,
         fileName
      );
      const listHasReferenceToDeleteInDb =
         tasksWhereListIsReferenced.length > 0;
      if (listHasReferenceToDeleteInDb) {
         this.dao.nullifyReferences(type, tasksWhereListIsReferenced);
      }

      const fileDoesNotExist = !(await this.fsUtils.fileExist(fileName, type));
      if (fileDoesNotExist) {
         return {
            message: `The file ${fileName} does not exists`,
            httpCode: 400,
            success: false,
         };
      }
      this.fsUtils.deleteFile(fileName, type);
      const message = `File ${fileName} deleted successfully`;
      this.sendNotification('success', message);
      return {
         message,
         httpCode: 200,
         success: true,
      };
   }

   private async deleteHashlistSpecification(
      fileName: string
   ): Promise<boolean> {
      const hashlistExistInDb = await this.dao.findHashlistExistWhere({
         name: fileName,
      });
      let isInError = false;
      if (hashlistExistInDb) {
         try {
            await this.dao.hashlist.deleteByName(fileName);
         } catch (err) {
            this.sendNotification(
               'warning',
               `Could not delete the hashlist ${fileName}. Please refer to the server logs.`
            );
            logger.error(err);
            isInError = true;
         }
      }
      return isInError;
   }
}
