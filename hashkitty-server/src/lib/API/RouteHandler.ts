import path = require('path');
import * as fs from 'fs-extra';

import { Hashcat } from '../hashcat/Hashcat';
import { Constants } from '../Constants';
import { logger } from '../utils/Logger';
import { DataSource } from 'typeorm';
import { Dao } from './DAOs/Dao';
import { UploadFileType } from '../types/TApi';
import { TaskUpdate, TemplateTaskUpdate, UploadFile } from '../types/TRoutes';
import { FsUtils } from '../utils/FsUtils';
import { Sanitizer } from './Sanitizer';
import { UploadedFile } from 'express-fileupload';
import {
   ReceivedRequest,
   ReqFileResults,
   ReqID,
   ResponseSend,
} from '../types/TRoutes';
import { Events } from '../utils/Events';
import HashcatController from './Controllers/HashcatController';
import EntityController from './Controllers/EntityController';

export class RouteHandler {
   public hashcat: Hashcat;
   private dao: Dao;
   private notify: Events['notify'];
   private hashcatController: HashcatController;
   private entityController: EntityController;

   constructor(db: DataSource) {
      this.dao = new Dao(db);
      this.notify = new Events(this.dao.notification).notify;
      this.hashcat = new Hashcat(this.dao, this.notify);
      this.hashcatController = new HashcatController(this.dao);
      this.entityController = new EntityController(this.dao);
   }

   public execHashcat = async (
      req: ReceivedRequest<ReqID>,
      res: ResponseSend
   ): Promise<void> => {
      const { id } = req.body;
      const taskId = parseInt(id) || -1;
      const { message, success, error, httpCode } =
         await this.hashcatController.exec('start', taskId);
      res.status(httpCode).json({ message, success, error, httpCode });
   };

   public restoreHashcat = async (
      req: ReceivedRequest<ReqID>,
      res: ResponseSend
   ): Promise<void> => {
      const { id } = req.body;
      const taskId = parseInt(id) || -1;
      const { message, success, error, httpCode } =
         await this.hashcatController.exec('restore', taskId);
      res.status(httpCode).json({ message, success, error, httpCode });
   };

   public getHashcatStatus = (_: ReceivedRequest, res: ResponseSend): void => {
      const { message, httpCode, status, success } =
         this.hashcatController.getStatus();
      res.status(httpCode).json({ message, httpCode, status, success });
   };

   public stopHashcat = (_: ReceivedRequest, res: ResponseSend): void => {
      const { message, httpCode, status, success } =
         this.hashcatController.getStatus();
      res.status(httpCode).json({ message, httpCode, status, success });
   };

   public deleteTask = async (
      req: ReceivedRequest<ReqID>,
      res: ResponseSend
   ): Promise<void> => {
      const { id } = req.body;
      const taskId = parseInt(id) || -1;
      const { message, httpCode, status, success } =
         await this.entityController.deleteTask(taskId);
      res.status(httpCode).json({ message, httpCode, status, success });
   };

   public updateTask = async (
      req: ReceivedRequest<TaskUpdate>,
      res: ResponseSend
   ): Promise<void> => {
      try {
         const sanitizer = new Sanitizer(this.dao);
         await sanitizer.analyseTask(req.body);
         if (sanitizer.hasSucceded) {
            let message = '';
            if (sanitizer.isAnUpdate) {
               message = `Task "${req.body.name}" updated successfully`;
            } else {
               message = `Task "${req.body.name}" created successfully`;
            }
            this.notify('success', message);
            res.status(200).json({
               message,
               success: await this.dao.task.create(sanitizer.getTask()),
            });
         } else {
            this.notify('error', sanitizer.errorMessage);
            this.responseFail(
               res,
               sanitizer.errorMessage,
               sanitizer.isAnUpdate ? 'update' : 'create'
            );
         }
      } catch (err) {
         logger.error(`An error occured while trying to create task: ${err}`);
         res.status(200).json({
            message: Dao.UnexpectedError,
            error: `[ERROR]: ${err}`,
         });
      }
   };

   public taskResults = (
      req: ReceivedRequest<ReqFileResults>,
      res: ResponseSend
   ): void => {
      if (!req.body.filename) {
         res.status(400).json({
            passwds: [],
            message: 'You need to submit the filename',
         });
         return;
      }
      try {
         const taskResults = fs
            .readFileSync(
               path.join(Constants.outputFilePath, req.body.filename)
            )
            .toString('utf-8')
            .split('\n')
            .filter(line => line);
         res.status(200).json({
            passwds: taskResults,
            message: '',
         });
      } catch (err) {
         logger.debug(err);
         res.status(200).json({
            passwds: [],
            message: `File ${req.body.filename} does not exist`,
         });
      }
   };

   public deleteHashlist(arg0: string, deleteHashlist: any) {
      throw new Error('Method not implemented.');
   }

   public deleteFile = (_: ReceivedRequest, res: ResponseSend): void => {
      throw new Error('PAS ENCORE FAIT'); //TODO
   };

   public uploadList = async (
      req: ReceivedRequest,
      res: ResponseSend
   ): Promise<void> => {
      const body: UploadFile & {
         type: UploadFileType;
         hashTypeId?: number;
      } = req.body;
      const typeData = FsUtils.getFileTypeData(body.type);
      const sanitizer = new Sanitizer(this.dao);
      await sanitizer.analyseList(body);
      if (!body || !req.files || Object.keys(req.files).length === 0) {
         res.status(400).json({
            message: 'No files were uploaded.',
         });
         return;
      }
      if (!sanitizer.hasSucceded) {
         res.status(200).json({
            message: Dao.UnexpectedError,
            error: `[ERROR]: ${sanitizer.errorMessage}`,
         });
         return;
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
         await FsUtils.uploadFile(
            req.files.file as UploadedFile,
            name,
            body.type
         );
         res.status(200).json({
            success: respMessage,
            message: respMessage,
         });
         this.notify('success', respMessage);
      } catch (err) {
         res.status(500).json({
            error: err as string,
            message: 'An error occurred',
         });
         logger.error(err);
      }
   };

   public deleteTemplate = async (
      req: ReceivedRequest,
      res: ResponseSend
   ): Promise<void> => {
      const id = (req.body.id && parseInt(req.body.id)) || undefined;
      if (id && (await this.dao.templateTaskExistById(id))) {
         try {
            const message = `Template deleted with id ${id} deleted successfully`;
            res.status(200).json({
               success: this.dao.templateTask.deleteById(id),
               message,
            });
            logger.info(message);
         } catch (err) {
            logger.error(
               `An error occured while trying to delete template : ${err}`
            );
            res.status(200).json({
               message: Dao.UnexpectedError,
               error: `[ERROR]: ${err}`,
            });
         }
      } else {
         this.responseFail(
            res,
            `There is no template with id ${id || 'undefined'}`,
            'delete'
         );
      }
   };

   public updateTemplateTask = async (
      req: ReceivedRequest<TemplateTaskUpdate>,
      res: ResponseSend
   ): Promise<void> => {
      try {
         const sanitizer = new Sanitizer(this.dao);
         await sanitizer.analyseTemplateTask(req.body);
         if (sanitizer.hasSucceded) {
            let message = '';
            if (sanitizer.isAnUpdate) {
               message = `Template "${req.body.name}" updated successfully`;
               logger.info(
                  `Template ${req.body.id} "${req.body.name}" updated successfully`
               );
            } else {
               message = 'New template created successfully';
               logger.info(message);
            }
            res.status(200).json({
               message,
               success: await this.dao.templateTask.create(
                  sanitizer.getTemplateTask()
               ),
            });
         } else {
            this.responseFail(
               res,
               sanitizer.errorMessage,
               sanitizer.isAnUpdate ? 'update' : 'create'
            );
         }
      } catch (err) {
         logger.error(`An error occured while trying to create task: ${err}`);
         res.status(200).json({
            message: Dao.UnexpectedError,
            error: `[ERROR]: ${err}`,
         });
      }
   };

   public getTemplate = async (
      _: ReceivedRequest,
      res: ResponseSend
   ): Promise<void> => {
      try {
         res.status(200).json({
            message: '',
            success: await this.dao.templateTask.getAll(),
         });
      } catch (err) {
         logger.error(err);
         res.status(200).json({
            message: Dao.UnexpectedError,
            error: `[ERROR]: ${err}`,
         });
      }
   };

   public getTemplateById = async (
      req: ReceivedRequest<ReqID>,
      res: ResponseSend
   ): Promise<void> => {
      const id = (req.body.id && parseInt(req.body.id)) || undefined;
      if (!id || (id && !(await this.dao.templateTaskExistById(id)))) {
         this.responseFail(
            res,
            `There is no template task with id ${id}`,
            'get',
            'template task'
         );
         return;
      }
      try {
         res.status(200).json({
            message: '',
            success: await this.dao.templateTask.getById(id),
         });
      } catch (err) {
         logger.error(err);
         res.status(200).json({
            message: Dao.UnexpectedError,
            error: `[ERROR]: ${err}`,
         });
      }
   };

   public getTasks = async (
      _: ReceivedRequest,
      res: ResponseSend
   ): Promise<void> => {
      try {
         res.status(200).json({
            message: '',
            success: await this.dao.task.getAll(),
         });
      } catch (err) {
         logger.error(err);
         res.status(200).json({
            message: Dao.UnexpectedError,
            error: `[ERROR]: ${err}`,
         });
      }
   };

   public getTaskById = async (
      req: ReceivedRequest,
      res: ResponseSend
   ): Promise<void> => {
      const id = (req.body.id && parseInt(req.body.id)) || undefined;
      if (id && (await this.dao.taskExistById(id))) {
         try {
            res.status(200).json({
               message: '',
               success: await this.dao.task.getById(id),
            });
         } catch (err) {
            logger.error(err);
            res.status(200).json({
               message: Dao.UnexpectedError,
               error: `[ERROR]: ${err}`,
            });
         }
      } else {
         this.responseFail(res, `There is no tasks with id ${id}`, 'delete');
      }
   };

   public getHashlists = async (
      _: ReceivedRequest,
      res: ResponseSend
   ): Promise<void> => {
      try {
         res.status(200).json({
            message: '',
            success: await this.dao.hashlist.getAll(),
         });
      } catch (err) {
         logger.error(err);
         res.status(200).json({
            message: Dao.UnexpectedError,
            error: `[ERROR]: ${err}`,
         });
      }
   };

   public getAttackModes = async (
      _: ReceivedRequest,
      res: ResponseSend
   ): Promise<void> => {
      try {
         res.status(200).json({
            message: '',
            success: await this.dao.attackMode.getAll(),
         });
      } catch (err) {
         logger.error(err);
         res.status(200).json({
            message: Dao.UnexpectedError,
            error: `[ERROR]: ${err}`,
         });
      }
   };

   public getHashTypes = async (
      _: ReceivedRequest,
      res: ResponseSend
   ): Promise<void> => {
      try {
         res.status(200).json({
            message: '',
            success: await this.dao.hashType.getAll(),
         });
      } catch (err) {
         logger.error(err);
         res.status(200).json({
            message: Dao.UnexpectedError,
            error: `[ERROR]: ${err}`,
         });
      }
   };

   public reloadWordlists = async (
      _: ReceivedRequest,
      res: ResponseSend
   ): Promise<void> => {
      try {
         await this.dao.reloadWordlistInDB();
         res.status(200).json({
            message: '',
            success: 'Update successfully',
         });
      } catch (err) {
         logger.error(err);
         res.status(200).json({
            message: Dao.UnexpectedError,
            error: `[ERROR]: ${err}`,
         });
      }
   };

   public getFilesInWordlistDir = (
      _: ReceivedRequest,
      res: ResponseSend
   ): void => {
      try {
         const files = FsUtils.listFileInDir(Constants.wordlistPath);
         this.getFileInDirResp(res, ['* (All Wordlists)', ...files]);
      } catch (e) {
         this.getFileInDirResp(res, [], Constants.wordlistPath, e);
      }
   };

   public getFilesInPotfileDir = (
      _: ReceivedRequest,
      res: ResponseSend
   ): void => {
      try {
         const files = FsUtils.listFileInDir(Constants.potfilesPath);
         this.getFileInDirResp(res, files);
      } catch (e) {
         this.getFileInDirResp(res, [], Constants.potfilesPath, e);
      }
   };

   public getFilesInRulesDir = (
      _: ReceivedRequest,
      res: ResponseSend
   ): void => {
      try {
         const files = FsUtils.listFileInDir(Constants.rulesPath);
         this.getFileInDirResp(res, files);
      } catch (e) {
         this.getFileInDirResp(res, [], Constants.rulesPath, e);
      }
   };

   public deleteNotifications = async (
      req: ReceivedRequest,
      res: ResponseSend
   ): Promise<void> => {
      const id = (req.body.id && parseInt(req.body.id)) || undefined;
      if (id && (await this.dao.notificationExistById(id))) {
         try {
            const message = `Notification deleted with id ${id} deleted successfully`;
            res.status(200).json({
               success: this.dao.notification.deleteById(id),
               message,
            });
            logger.debug(message);
         } catch (err) {
            logger.error(
               `An error occured while trying to delete the notification : ${err}`
            );
            res.status(200).json({
               message: Dao.UnexpectedError,
               error: `[ERROR]: ${err}`,
            });
         }
      } else {
         this.responseFail(
            res,
            `There is no notification with id ${id || 'undefined'}`,
            'delete',
            'notification'
         );
      }
   };

   public getNotifications = async (
      _: ReceivedRequest,
      res: ResponseSend
   ): Promise<void> => {
      res.status(200).json({
         success: await this.dao.notification.getAll(),
         message: '',
      });
   };

   private getFileInDirResp(
      res: ResponseSend,
      files: string[],
      dirPath?: string,
      e?: unknown
   ): void {
      if (dirPath && e) {
         logger.error(
            `An error occured while reading dir ${dirPath} - Error: ${e}`
         );
         const msgError = `An error occured while reading dir ${dirPath}`;
         res.status(200).json({
            message: msgError,
            error: {
               name: msgError,
               message: e || 'No message error',
            },
         });
         return;
      }
      res.json({
         message: '',
         success: files,
      });
   }

   private responseFail(
      res: ResponseSend,
      message: string,
      job: string,
      entity = 'task'
   ) {
      res.status(200).json({
         message,
      });
      logger.debug(`Fail to ${job} ${entity} - ${message}`);
   }
}
