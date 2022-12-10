import * as fs from 'fs-extra';

import { Request, Response } from 'express';
import { Hashcat } from '../hashcat/Hashcat';
import { Constants } from '../Constants';
import { logger } from '../utils/Logger';
import { DataSource } from 'typeorm';
import { Task } from '../ORM/entity/Task';
import { ResponseHandler } from './ResponseHandler';
import { THashcatStatus } from '../types/THashcat';
import { Dao } from './DAOs/Dao';
import { TDaoTaskCreate, TDaoTaskDelete } from '../types/TDAOs';

export class RouteHandler {
    public hashcat: Hashcat = new Hashcat();
    private respHandler: ResponseHandler = new ResponseHandler();
    private dao: Dao;

    constructor(db: DataSource) {
        this.dao = new Dao(db);
    }

    public execHashcat = (req: Request, res: Response): void => {
        this.respHandler.tryAndResponse<void, string>(
            'exec',
            res,
            !this.hashcat.status.isRunning,
            () => {
                this.hashcat.exec(req.body);
            }
        );
    };

    public restoreHashcat = (req: Request, res: Response): void => {
        this.respHandler.tryAndResponse<void, string>(
            'stop',
            res,
            !this.hashcat.status.isRunning,
            () => {
                this.hashcat.restore(req.body);
            }
        );
    };

    public getHashcatStatus = (_: Request, res: Response): void => {
        this.respHandler.tryAndResponse<THashcatStatus, THashcatStatus>(
            'status',
            res,
            this.hashcat.status.isRunning,
            () => {
                return this.hashcat.status;
            }
        );
    };

    public getStopHashcat = (_: Request, res: Response): void => {
        this.respHandler.tryAndResponse<void, string>(
            'stop',
            res,
            this.hashcat.status.isRunning,
            () => {
                this.hashcat.stop();
            }
        );
    };

    public deleteTask = async (req: Request, res: Response): Promise<void> => {
        const id = (req.body as TDaoTaskDelete).id;
        this.respHandler.tryAndResponse<number, string>(
            'delete',
            res,
            await this.dao.taskExistById(id),
            () => {
                this.dao.task.deleteById(id);
                return id;
            }
        );
    };

    public createTask = (req: Request, res: Response): void => {
        this.respHandler.tryAndResponse<void, string>(
            'create',
            res,
            true,
            () => {
                this.dao.task.create(req.body as TDaoTaskCreate);
            }
        );
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
