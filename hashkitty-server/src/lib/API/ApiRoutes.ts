import { Router, json } from 'express';
import { DataSource } from 'typeorm';

import { RouteHandler } from './RouteHandler';

export class ApiRouter {
   public readonly router: Router;
   private readonly routeHandler: RouteHandler;

   constructor(db: DataSource) {
      this.router = Router();
      this.router.use(json());

      this.routeHandler = new RouteHandler(db);
      this.registerRoutes();
   }

   private registerRoutes() {
      this.router.get('/stop', this.routeHandler.stopHashcat);
      this.router.get('/status', this.routeHandler.getHashcatStatus);
      this.router.get('/wordlists', this.routeHandler.getFilesInWordlistDir);
      this.router.get('/hashlists', this.routeHandler.getHashlists);
      this.router.get('/potfiles', this.routeHandler.getFilesInPotfileDir);
      this.router.get('/attackmodes', this.routeHandler.getAttackModes);
      this.router.get('/hashtypes', this.routeHandler.getHashTypes);
      this.router.get('/reload-wordlists', this.routeHandler.reloadWordlists);
      this.router.get('/template/:id', this.routeHandler.getTemplateById);
      this.router.get('/template', this.routeHandler.getTemplates);
      this.router.get('/tasks', this.routeHandler.getTasks);
      this.router.get('/tasks/:id', this.routeHandler.getTaskById);
      this.router.get('/rules', this.routeHandler.getFilesInRulesDir);
      this.router.get('/notifications', this.routeHandler.getNotifications);
      this.router.post('/start', this.routeHandler.execHashcat);
      this.router.post('/restore', this.routeHandler.restoreHashcat);
      this.router.post('/template', this.routeHandler.updateTemplateTask);
      this.router.post('/template/delete', this.routeHandler.deleteTemplate);
      this.router.post('/tasks', this.routeHandler.updateTask);
      this.router.post('/tasks/delete', this.routeHandler.deleteTask);
      this.router.post('/list', this.routeHandler.uploadList);
      this.router.post('/hashlist/delete', this.routeHandler.deleteHashlist);
      this.router.post('/results', this.routeHandler.taskResults);
      this.router.delete(
         '/notifications',
         this.routeHandler.deleteNotifications
      );
   }
}
