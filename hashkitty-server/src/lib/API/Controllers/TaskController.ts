import path from 'path';
import fs from 'fs-extra';

import { Constants } from '../../Constants';
import { TTask } from '../../types/TApi';
import { ResponseAttr, TaskUpdate } from '../../types/TRoutes';
import { Events } from '../../utils/Events';
import { Dao } from '../DAOs/Dao';
import { Sanitizer } from '../Sanitizer';
import GenericController from './GenericResponse';
import { Task } from '../../ORM/entity/Task';

export default class TaskController {
   private dao: Dao;
   private sendNotification: Events['sendNotification'];

   constructor(dao: Dao) {
      this.dao = dao;
      this.sendNotification = new Events(
         this.dao.notification
      ).sendNotification;
   }

   public async delete(taskId: number): Promise<ResponseAttr> {
      if (!(await this.dao.taskExistById(taskId))) {
         return GenericController.responseNoCorrespondingItem('task');
      }
      try {
         const task = (await this.dao.task.getById(taskId)) as unknown as TTask;
         this.dao.task.deleteById(taskId);
         const respMessage = `Task "${task.name}" deleted successfully`;
         this.sendNotification('success', respMessage);
         return {
            message: respMessage,
            httpCode: 200,
            success: true,
         };
      } catch (err) {
         const errorMsg = `An error occured while trying to delete task: ${err}`;
         this.sendNotification('error', errorMsg);
         return {
            httpCode: 500,
            message: errorMsg,
            error: `[ERROR]: ${err}`,
            success: false,
         };
      }
   }

   public async update(task: TaskUpdate): Promise<ResponseAttr> {
      if (task.id && !(await this.dao.taskExistById(task.id))) {
         return GenericController.responseNoCorrespondingItem('task');
      }
      try {
         const sanitizer = new Sanitizer(this.dao);
         await sanitizer.analyseTask(task);
         if (sanitizer.hasSucceded) {
            const message = `Task "${task.name}" ${
               sanitizer.isAnUpdate ? 'updated' : 'created'
            } successfully`;
            this.sendNotification('success', message);
            this.dao.task.create(sanitizer.getTask());
            return {
               message,
               success: true,
               httpCode: 200,
            };
         } else {
            this.sendNotification('error', sanitizer.errorMessage);
            return {
               httpCode: 400,
               message: sanitizer.errorMessage,
               success: false,
            };
         }
      } catch {
         this.sendNotification(
            'error',
            'An error occured while trying to create task'
         );
         return GenericController.unexpectedError();
      }
   }

   public results(filename: string | undefined) {
      if (!filename) {
         return {
            passwds: [],
            httpCode: 400,
            success: false,
            message: 'You need to submit the filename',
         };
      }
      try {
         const taskResults = fs
            .readFileSync(path.join(Constants.outputFilePath, filename))
            .toString('utf-8')
            .split('\n')
            .filter(line => line);
         return {
            passwds: taskResults,
            message: '',
            success: true,
            httpCode: 200,
         };
      } catch {
         const message = `File ${filename} does not exist`;
         this.sendNotification('error', message);
         return {
            passwds: [],
            message,
            success: true,
            httpCode: 400,
         };
      }
   }

   public async getAll(): Promise<ResponseAttr> {
      try {
         const items = await this.dao.task.getAll();
         return {
            message: '',
            success: true,
            items,
            httpCode: 200,
         };
      } catch (err) {
         const message = `An unexpected error occured ${
            (err as Error).message
         }`;
         this.sendNotification('error', message);
         return {
            message,
            success: false,
            httpCode: 500,
            items: [],
         };
      }
   }

   public async getById(id: number): Promise<ResponseAttr> {
      if (!(await this.dao.taskExistById(id))) {
         return GenericController.responseNoCorrespondingItem('task');
      }
      try {
         const items = [await this.dao.task.getById(id)];
         return {
            message: '',
            success: true,
            items,
            httpCode: 200,
         };
      } catch (err) {
         const message = `An unexpected error occured ${
            (err as Error).message
         }`;
         this.sendNotification('error', message);
         return {
            message,
            success: false,
            httpCode: 500,
            items: [new Task()],
         };
      }
   }
}
