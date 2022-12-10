import * as http from 'http';
import * as https from 'https';
import { AddressInfo } from 'net';
import * as fs from 'fs';
import * as express from 'express';

import { logger } from '../utils/Logger';
import { IHttpServer, THttpServerConfig } from '../types/TApi';
import { ApiRouter } from './ApiRoutes';
import { DataSource } from 'typeorm';

export class HttpServer implements IHttpServer {
    private app: express.Application = express();
    private config: THttpServerConfig;
    private server!: http.Server | https.Server;

    constructor(config: THttpServerConfig, db: DataSource) {
        this.config = config;

        this.enableCORS();
        this.registerRoutes(new ApiRouter(db).router);
        //TODO Add MiddleWare to prevent remote user communicate with the API
    }

    public async listen(): Promise<void> {
        this.server = this.createHttpServer();

        this.server.keepAliveTimeout = 61 * 1000;
        this.server.headersTimeout = 65 * 1000;

        return new Promise(resolve => {
            this.server.listen(this.config.port, () => {
                logger.info(
                    `Http server started successfully on port ${this.serverListenPort}`
                );
                resolve();
            });
        });
    }

    public get serverListenPort(): number {
        return (this.server.address() as AddressInfo).port || -1;
    }

    public checkHealth(): void {
        if (!this.server || !this.server.listening) {
            throw new Error('Http server is not Listening');
        }
    }

    public close(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.server || !this.server.listening) {
                logger.warn('Http server already stopped !');
                return resolve();
            }
            this.server.close(err => {
                if (err) {
                    reject(err);
                }
                logger.info('Http server stopped successfully');
                resolve();
            });
        });
    }

    private createHttpServer(): http.Server | https.Server {
        const ssl = this.config.ssl || { use: false };
        if (ssl.use) {
            try {
                const credentials = {
                    key: fs.readFileSync(ssl.key || '', 'utf8'),
                    cert: fs.readFileSync(ssl.cert || '', 'utf8'),
                };
                return https.createServer(credentials, this.app);
            } catch (err) {
                logger.error(
                    'Error while creating https server with key: ' +
                        ssl.key +
                        ' and certificate: ' +
                        ssl.cert +
                        '; ',
                    err
                );
                throw err;
            }
        }
        logger.debug(
            'SSL is disable, the program can not perform HTTPS encryption'
        );
        return http.createServer(this.app);
    }

    private registerRoutes(apiRouter: express.Router) {
        this.app.use('/api', apiRouter);
    }

    private enableCORS() {
        this.app.use((_, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header(
                'Access-Control-Allow-Methods',
                'GET, POST, PUT, DELETE'
            );
            res.header(
                'Access-Control-Allow-Headers',
                'Origin, X-Requested-With, Content-Type, Accept, Authorization'
            );
            next();
        });
    }
}
