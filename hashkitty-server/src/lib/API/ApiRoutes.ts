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
        this.router.post('/start', this.routeHandler.execHashcat);
        this.router.post('/restore', this.routeHandler.restoreHashcat);
        this.router.get('/stop', this.routeHandler.stopHashcat);
        this.router.get('/status', this.routeHandler.getHashcatStatus);
        this.router.get('/wordlists', this.routeHandler.getFilesInWordlistDir);
        this.router.get('/hashlists', this.routeHandler.getHashlists);
        this.router.get('/potfiles', this.routeHandler.getFilesInPotfileDir);
        this.router.get('/attackmodes', this.routeHandler.getAttackModes);
        this.router.get('/hashtypes', this.routeHandler.getHashTypes);
        this.router.get('/rules', this.routeHandler.getFilesInRulesDir);
        this.router.post(
            '/templatetasks',
            this.routeHandler.createTemplateTask
        );
        this.router.post(
            '/templatetasks/delete',
            this.routeHandler.deleteTemplateTask
        );
        this.router.post(
            '/templatetasks/update',
            this.routeHandler.updateTemplateTask
        );
        this.router.post('/tasks', this.routeHandler.createTask);
        this.router.post('/tasks/update', this.routeHandler.updateTask);
        this.router.post('/tasks/delete', this.routeHandler.deleteTask);
        this.router.get(
            '/templateTasks/:id',
            this.routeHandler.getTemplateTaskById
        );
        this.router.get('/templatetasks', this.routeHandler.getTemplateTasks);
        this.router.get('/tasks', this.routeHandler.getTasks);
        this.router.get('/tasks/:id', this.routeHandler.getTaskById);
        this.router.post('/files', this.routeHandler.addFile);
        this.router.post('/files/:id', this.routeHandler.deleteFile);
        this.router.post('/files/update/:id', this.routeHandler.updateFile);
    }
}
