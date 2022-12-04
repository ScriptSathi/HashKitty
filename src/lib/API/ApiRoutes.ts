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
    }
}
