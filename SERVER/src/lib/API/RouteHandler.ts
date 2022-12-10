import * as fs from 'fs-extra';

import { Request, Response } from 'express';
import { Hashcat } from '../hashcat/Hashcat';
import { Constants } from '../Constants';
import { logger } from '../utils/Logger';
import { DataSource } from 'typeorm';
import { Task } from '../ORM/entity/Task';
import { ResponseHandler } from './ResponseHandler';
import { THashcatStatus } from '../types/THashcat';

export class RouteHandler {
    public hashcat: Hashcat = new Hashcat();
    private respHandler: ResponseHandler = new ResponseHandler();
    // private dao: DAOApi;

    constructor(db: DataSource) {}

    public execHashcat = (req: Request, res: Response): void => {
        this.respHandler.tryAndResponse<void>(
            'exec',
            res,
            !this.hashcat.status.isRunning,
            () => {
                this.hashcat.exec(req.body);
            }
        );
    };

    public restoreHashcat = (req: Request, res: Response): void => {
        this.respHandler.tryAndResponse<void>(
            'stop',
            res,
            !this.hashcat.status.isRunning,
            () => {
                this.hashcat.restore(req.body);
            }
        );
    };

    public getHashcatStatus = (_: Request, res: Response): void => {
        this.respHandler.tryAndResponse<THashcatStatus>(
            'status',
            res,
            this.hashcat.status.isRunning,
            () => {
                return this.hashcat.status;
            }
        );
    };

    public getStopHashcat = (_: Request, res: Response): void => {
        this.respHandler.tryAndResponse<void>(
            'stop',
            res,
            this.hashcat.status.isRunning,
            () => {
                this.hashcat.stop();
            }
        );
    };

    public deleteTask = (_: Request, res: Response): void => {
        throw new Error('PAS ENCORE FAIT'); //TODO
    };

    public addTask = (_: Request, res: Response): void => {
        throw new Error('PAS ENCORE FAIT'); //TODO
    };

    public updateTask = (_: Request, res: Response): void => {
        throw new Error('PAS ENCORE FAIT'); //TODO
    };

    public addFile = (_: Request, res: Response): void => {
        throw new Error('PAS ENCORE FAIT'); //TODO
    };

    public deleteFile = (_: Request, res: Response): void => {
        throw new Error('PAS ENCORE FAIT'); //TODO
    };

    public updateFile = (_: Request, res: Response): void => {
        throw new Error('PAS ENCORE FAIT'); //TODO
    };

    public addTemplateTask = (_: Request, res: Response): void => {
        throw new Error('PAS ENCORE FAIT'); //TODO
    };

    public deleteTemplateTask = (_: Request, res: Response): void => {
        throw new Error('PAS ENCORE FAIT'); //TODO
    };

    public updateTemplateTask = (_: Request, res: Response): void => {
        throw new Error('PAS ENCORE FAIT'); //TODO
    };

    public getTemplateTasks = (_: Request, res: Response): void => {
        throw new Error('PAS ENCORE FAIT'); //TODO
    };

    public getTemplateTaskById = (req: Request, res: Response): void => {
        const id = req?.params.id;
        // check if id exist in DB and return value
        throw new Error('PAS ENCORE FAIT'); //TODO
    };

    public getTasks = async (_: Request, res: Response): Promise<void> => {
        throw new Error('PAS ENCORE FAIT'); //TODO
    };

    public getTaskById = (req: Request, res: Response): void => {
        const id = req?.params.id;
        // check if id exist in DB and return value
        throw new Error('PAS ENCORE FAIT'); //TODO
    };

    public getFilesInWordlistDir = (_: Request, res: Response): void => {
        this.getFileInDir(res, Constants.wordlistPath);
    };

    public getFilesInHashlistDir = (_: Request, res: Response): void => {
        this.getFileInDir(res, Constants.hashlistsPath);
    };

    public getFilesInPotfileDir = (_: Request, res: Response): void => {
        this.getFileInDir(res, Constants.potfilesPath);
    };

    public getFilesInRulesDir = (_: Request, res: Response): void => {
        this.getFileInDir(res, Constants.rulesPath);
    };

    private getFileInDir(res: Response, dirPath: string): void {
        try {
            const files = fs.readdirSync(dirPath);
            res.json({
                files,
            });
        } catch (e) {
            logger.error(
                `An error occured while reading dir ${dirPath} - Error: ${e}`
            );
            res.status(200).json({
                error: {
                    name: `An error occured while reading dir ${dirPath}`,
                    message: e || 'No message error',
                },
            });
        }
    }
}
