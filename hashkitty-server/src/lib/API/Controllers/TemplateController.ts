import path from 'path';
import fs from 'fs-extra';

import { Constants } from '../../Constants';
import { ResponseAttr, TemplateTaskUpdate } from '../../types/TRoutes';
import { Events } from '../../utils/Events';
import { Dao } from '../DAOs/Dao';
import { Sanitizer } from '../Sanitizer';
import GenericController from './GenericResponse';
import { TemplateTask } from '../../ORM/entity/TemplateTask';

export default class TemplateController {
   private dao: Dao;
   private notify: Events['notify'];

   constructor(dao: Dao) {
      this.dao = dao;
      this.notify = new Events(this.dao.notification).notify;
   }

   public async delete(templateId: number): Promise<ResponseAttr> {
      if (await this.dao.templateExistById(templateId)) {
         return GenericController.responseNoCorrespondingItem('template');
      }
      try {
         const template = await this.dao.template.getById(templateId);
         this.dao.template.deleteById(templateId);
         const respMessage = `Template "${template.name}" deleted successfully`;
         this.notify('success', respMessage);
         return {
            message: respMessage,
            httpCode: 200,
            success: true,
         };
      } catch (err) {
         const errorMsg = `An error occured while trying to delete template: ${err}`;
         this.notify('error', errorMsg);
         return {
            httpCode: 500,
            message: errorMsg,
            error: `[ERROR]: ${err}`,
            success: false,
         };
      }
   }

   public async update(template: TemplateTaskUpdate): Promise<ResponseAttr> {
      if (template.id && !(await this.dao.templateExistById(template.id))) {
         return GenericController.responseNoCorrespondingItem('template');
      }
      try {
         const sanitizer = new Sanitizer(this.dao);
         await sanitizer.analyseTemplate(template);
         if (sanitizer.hasSucceded) {
            const message = `Template "${template.name}" ${
               sanitizer.isAnUpdate ? 'updated' : 'created'
            } successfully`;
            this.notify('success', message);
            this.dao.template.create(sanitizer.getTemplate());
            return {
               message,
               success: true,
               httpCode: 200,
            };
         } else {
            this.notify('error', sanitizer.errorMessage);
            return {
               httpCode: 401,
               message: sanitizer.errorMessage,
               success: false,
            };
         }
      } catch {
         this.notify('error', 'An error occured while trying to create task');
         return GenericController.unexpectedError();
      }
   }

   public async getAll(): Promise<ResponseAttr> {
      try {
         const templates = await this.dao.template.getAll();
         return {
            message: '',
            success: true,
            templates,
            httpCode: 200,
         };
      } catch (err) {
         const message = `An unexpected error occured ${
            (err as Error).message
         }`;
         this.notify('error', message);
         return {
            message,
            success: false,
            httpCode: 500,
            templates: [],
         };
      }
   }

   public async getById(id: number): Promise<ResponseAttr> {
      if (await this.dao.templateExistById(id)) {
         return GenericController.responseNoCorrespondingItem('template');
      }
      try {
         const templates = await this.dao.template.getById(id);
         return {
            message: '',
            success: true,
            templates,
            httpCode: 200,
         };
      } catch (err) {
         const message = `An unexpected error occured ${
            (err as Error).message
         }`;
         this.notify('error', message);
         return {
            message,
            success: false,
            httpCode: 500,
            templates: new TemplateTask(),
         };
      }
   }
}
