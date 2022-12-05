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

        this.routeHandler.post('/templateTasks', this.routeHandler.)
        this.router.get('/templateTasks', this.routeHandler.getTemplateTasks);
        this.router.get(
            '/templateTasks/:id',
            this.routeHandler.getTemplateTasks
        );
        this.router.get('/tasks', this.routeHandler.getTasks);
        this.router.get('/tasks/:id', this.routeHandler.getTasks);
    }
}
