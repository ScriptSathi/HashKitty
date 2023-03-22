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
import { FileArray, UploadedFile } from 'express-fileupload';
import {
   ReceivedRequest,
   ReqFileResults,
   ReqID,
   ResponseSend,
} from '../types/TRoutes';
import { Events } from '../utils/Events';
import HashcatController from './Controllers/HashcatController';
import TaskController from './Controllers/TaskController';
import TemplateController from './Controllers/TemplateController';
import ListController from './Controllers/ListController';

export class RouteHandler {
   public hashcat: Hashcat;
   private dao: Dao;
   private notify: Events['notify'];
   private hashcatController: HashcatController;
   private taskController: TaskController;
   private templateController: TemplateController;
   private listController: ListController;

   constructor(db: DataSource) {
      this.dao = new Dao(db);
      this.notify = new Events(this.dao.notification).notify;
      this.hashcat = new Hashcat(this.dao, this.notify);
      this.hashcatController = new HashcatController(this.dao);
      this.taskController = new TaskController(this.dao);
      this.listController = new ListController(this.dao);
      this.templateController = new TemplateController(this.dao);
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
      const { message, httpCode, success, error } =
         await this.taskController.delete(taskId);
      res.status(httpCode).json({ message, httpCode, success, error });
   };

   public updateTask = async (
      req: ReceivedRequest<TaskUpdate>,
      res: ResponseSend
   ): Promise<void> => {
      const { message, httpCode, success, error } =
         await this.taskController.update(req.body);
      res.status(httpCode).json({ message, httpCode, success, error });
   };

   public taskResults = (
      req: ReceivedRequest<ReqFileResults>,
      res: ResponseSend
   ): void => {
      const { filename } = req.body;
      const { message, httpCode, passwds, success } =
         this.taskController.results(filename);
      res.status(httpCode).json({ message, passwds, httpCode, success });
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
      const {
         type,
         hashTypeId,
         fileName,
      }: UploadFile & {
         type: UploadFileType;
         hashTypeId?: number;
      } = req.body;

      const fileIsProvided = req.files && Object.keys(req.files).length !== 0;
      const tooManyFilesSubmitted =
         req.files && (!req.files.file || Array.isArray(req.files.file));
      const submittedDataIsNotCorrect =
         !req.body || !fileIsProvided || tooManyFilesSubmitted;
      if (submittedDataIsNotCorrect) {
         const httpCode = 401;
         res.status(httpCode).json({
            message: 'The submitted data is not correct',
            httpCode,
            success: false,
         });
         return;
      }
      const { file } = req.files as FileArray;
      const { message, httpCode, success, error } =
         await this.listController.upload({
            type,
            hashTypeId,
            fileName,
            file: file as UploadedFile,
         });
      res.status(httpCode).json({ message, httpCode, success, error });
   };

   public deleteTemplate = async (
      req: ReceivedRequest,
      res: ResponseSend
   ): Promise<void> => {
      const { id } = req.body;
      const templateId = parseInt(id) || -1;
      const { message, httpCode, success, error } =
         await this.templateController.delete(templateId);
      res.status(httpCode).json({ message, httpCode, success, error });
   };

   public updateTemplateTask = async (
      req: ReceivedRequest<TemplateTaskUpdate>,
      res: ResponseSend
   ): Promise<void> => {
      const { message, httpCode, success } = await this.taskController.update(
         req.body
      );
      res.status(httpCode).json({ message, httpCode, success });
   };

   public getTemplates = async (
      _: ReceivedRequest,
      res: ResponseSend
   ): Promise<void> => {
      const { message, httpCode, success, templates } =
         await this.templateController.getAll();
      res.status(httpCode).json({ message, httpCode, success, templates });
   };

   public getTemplateById = async (
      req: ReceivedRequest<ReqID>,
      res: ResponseSend
   ): Promise<void> => {
      const { id } = req.body;
      const templateId = parseInt(id) || -1;
      const { message, httpCode, success, templates } =
         await this.templateController.getById(templateId);
      res.status(httpCode).json({ message, httpCode, success, templates });
   };

   public getTasks = async (
      _: ReceivedRequest,
      res: ResponseSend
   ): Promise<void> => {
      const { message, httpCode, success, tasks } =
         await this.taskController.getAll();
      res.status(httpCode).json({ message, httpCode, success, tasks });
   };

   public getTaskById = async (
      req: ReceivedRequest,
      res: ResponseSend
   ): Promise<void> => {
      const { id } = req.body;
      const taskId = parseInt(id) || -1;
      const { message, httpCode, success, tasks } =
         await this.taskController.getById(taskId);
      res.status(httpCode).json({ message, httpCode, success, tasks });
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
