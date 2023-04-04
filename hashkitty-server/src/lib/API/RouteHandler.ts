import { Hashcat } from '../hashcat/Hashcat';
import { Constants } from '../Constants';
import { logger } from '../utils/Logger';
import { DataSource } from 'typeorm';
import { Dao } from './DAOs/Dao';
import { ListBase, UploadFileType } from '../types/TApi';
import { TaskUpdate, TemplateUpdate, UploadFile } from '../types/TRoutes';
import { FsUtils } from '../utils/FsUtils';
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
import NotificationController from './Controllers/NotificationController';
import OptionController from './Controllers/OptionController';

export class RouteHandler {
   public hashcat: Hashcat;
   private dao: Dao;
   private sendNotification: Events['sendNotification'];
   private hashcatController: HashcatController;
   private taskController: TaskController;
   private templateController: TemplateController;
   private listController: ListController;
   private notificationController: NotificationController;
   private optionController: OptionController;

   constructor(db: DataSource) {
      this.dao = new Dao(db);
      this.sendNotification = new Events(
         this.dao.notification
      ).sendNotification;
      this.hashcat = new Hashcat(this.dao, this.sendNotification);
      this.hashcatController = new HashcatController(this.dao);
      this.taskController = new TaskController(this.dao);
      this.listController = new ListController(this.dao);
      this.templateController = new TemplateController(this.dao);
      this.notificationController = new NotificationController(this.dao);
      this.optionController = new OptionController(this.dao);
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

   public deleteFile = async (
      req: ReceivedRequest,
      res: ResponseSend
   ): Promise<void> => {
      const {
         type,
         fileName,
      }: UploadFile & {
         type: UploadFileType;
      } = req.body;
      const { message, httpCode, success, error } =
         await this.listController.delete({
            type,
            fileName,
         });
      res.status(httpCode).json({ message, httpCode, success, error });
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
      req: ReceivedRequest<TemplateUpdate>,
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
      const { message, httpCode, success, items } =
         await this.templateController.getAll();
      res.status(httpCode).json({ message, httpCode, success, items });
   };

   public getTemplateById = async (
      req: ReceivedRequest<ReqID>,
      res: ResponseSend
   ): Promise<void> => {
      const { id } = req.body;
      const templateId = parseInt(id) || -1;
      const { message, httpCode, success, items } =
         await this.templateController.getById(templateId);
      res.status(httpCode).json({ message, httpCode, success, items });
   };

   public getTasks = async (
      _: ReceivedRequest,
      res: ResponseSend
   ): Promise<void> => {
      const { message, httpCode, success, items } =
         await this.taskController.getAll();
      res.status(httpCode).json({ message, httpCode, success, items });
   };

   public getTaskById = async (
      req: ReceivedRequest,
      res: ResponseSend
   ): Promise<void> => {
      const { id } = req.body;
      const taskId = parseInt(id) || -1;
      const { message, httpCode, success, items } =
         await this.taskController.getById(taskId);
      res.status(httpCode).json({ message, httpCode, success, items });
   };

   public getHashlists = async (
      _: ReceivedRequest,
      res: ResponseSend
   ): Promise<void> => {
      const { message, httpCode, success, items } =
         await this.listController.getAllHashlists();
      res.status(httpCode).json({ message, httpCode, success, items });
   };

   public getAttackModes = async (
      _: ReceivedRequest,
      res: ResponseSend
   ): Promise<void> => {
      const { message, httpCode, success, items } =
         await this.optionController.getAllAttackModes();
      res.status(httpCode).json({ message, httpCode, success, items });
   };

   public getHashTypes = async (
      _: ReceivedRequest,
      res: ResponseSend
   ): Promise<void> => {
      const { message, httpCode, success, items } =
         await this.optionController.getAllHashTypes();
      res.status(httpCode).json({ message, httpCode, success, items });
   };

   public reloadWordlists = async (
      _: ReceivedRequest,
      res: ResponseSend
   ): Promise<void> => {
      const { message, httpCode, success } =
         await this.listController.reloadWordlists();
      res.status(httpCode).json({ message, httpCode, success });
   };

   public deleteNotifications = async (
      req: ReceivedRequest,
      res: ResponseSend
   ): Promise<void> => {
      const { id } = req.body;
      const notificationId = parseInt(id) || -1;
      const { message, httpCode, success, error } =
         await this.notificationController.delete(notificationId);
      res.status(httpCode).json({ message, httpCode, success, error });
   };

   public getNotifications = async (
      _: ReceivedRequest,
      res: ResponseSend
   ): Promise<void> => {
      const { message, httpCode, success, items } =
         await this.notificationController.getAll();
      res.status(httpCode).json({ message, httpCode, success, items });
   };

   public getAllWordlists = async (
      _: ReceivedRequest,
      res: ResponseSend
   ): Promise<void> => {
      const { message, httpCode, success, items } =
         await this.listController.getAllWordlists();
      res.status(httpCode).json({ message, httpCode, success, items });
   };

   public getFilesInPotfileDir = (
      _: ReceivedRequest,
      res: ResponseSend
   ): void => {
      try {
         const listString = FsUtils.listFileInDir(Constants.potfilesPath);
         const list = this.buildListBase(listString);
         this.getFileInDirResp(res, list);
      } catch (e) {
         this.getFileInDirResp(res, [], Constants.potfilesPath, e);
      }
   };

   public getFilesInRulesDir = (
      _: ReceivedRequest,
      res: ResponseSend
   ): void => {
      try {
         const listString = FsUtils.listFileInDir(Constants.rulesPath);
         const list = this.buildListBase(listString);
         this.getFileInDirResp(res, list);
      } catch (e) {
         this.getFileInDirResp(res, [], Constants.rulesPath, e);
      }
   };

   private async getFileInDirResp(
      res: ResponseSend,
      list: ListBase[],
      dirPath?: string,
      e?: unknown
   ): Promise<void> {
      const items = await this.dao.getListContext(list, () => false);
      if (dirPath && e) {
         const httpCode = 500;
         logger.error(
            `An error occured while reading dir ${dirPath} - Error: ${e}`
         );
         const msgError = `An error occured while reading dir ${dirPath}`;

         res.status(httpCode).json({
            message: msgError,
            items,
            httpCode,
            success: true,
         });
         return;
      }
      const httpCode = 200;
      res.status(httpCode).json({
         message: '',
         items,
         httpCode,
         success: true,
      });
   }

   private buildListBase(list: string[]): ListBase[] {
      return list.map((elem, i) => {
         return {
            name: elem,
            id: i,
         };
      });
   }
}
