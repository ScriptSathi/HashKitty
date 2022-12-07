import { Router, json } from 'express';

import { RouteHandler } from './RouteHandler';

export class ApiRouter {
    public readonly router: Router;
    private readonly routeHandler: RouteHandler;

    constructor() {
        this.router = Router();
        this.router.use(json());

        this.routeHandler = new RouteHandler();
        this.registerRoutes();
    }

    private registerRoutes() {
        this.router.post('/start', this.routeHandler.execHashcat);
        this.router.post('/restore', this.routeHandler.restoreHashcat);
        this.router.get('/status', this.routeHandler.getHashcatStatus);
        this.router.get('/stop', this.routeHandler.getStopHashcat);
        this.router.get('/wordlists', this.routeHandler.getFilesInWordlistDir);
        this.router.get('/hashlists', this.routeHandler.getFilesInHashlistDir);
        this.router.get('/potfiles', this.routeHandler.getFilesInPotfileDir);
        this.router.get('/rules', this.routeHandler.getFilesInRulesDir);

        // Bellow are not implem yet
        this.router.post('/templateTasks', this.routeHandler.addTemplateTask);
        this.router.post(
            '/templateTasks/:id',
            this.routeHandler.deleteTemplateTask
        );
        this.router.post(
            '/templateTasks/update/:id',
            this.routeHandler.updateTemplateTask
        );
        this.router.post('/tasks', this.routeHandler.addTask);
        this.router.post('/tasks/update/:id', this.routeHandler.updateTask);
        this.router.post('/tasks/:id', this.routeHandler.deleteTask);
        this.router.get(
            '/templateTasks/:id',
            this.routeHandler.getTemplateTaskById
        );
        this.router.get('/templateTasks', this.routeHandler.getTemplateTasks);
        this.router.get('/tasks', this.routeHandler.getTasks);
        this.router.get('/tasks/:id', this.routeHandler.getTaskById);
        this.router.post('/files', this.routeHandler.addFile);
        this.router.post('/files/:id', this.routeHandler.deleteFile);
        this.router.post('/files/update/:id', this.routeHandler.updateFile);
    }
}
