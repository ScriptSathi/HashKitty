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
import { TDaoTaskCreate, TDaoTaskDelete, TDaoTaskUpdate } from '../types/TDAOs';

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
        if (await this.dao.taskExistById((req.body as TDaoTaskDelete).id)) {
            try {
                res.status(200).json({
                    sucess: this.dao.task.deleteById(
                        (req.body as TDaoTaskDelete).id
                    ),
                });
                logger.info(
                    `Task deleted with id ${
                        (req.body as TDaoTaskDelete).id
                    } deleted successfully`
                );
            } catch (err) {
                logger.error(err);
                res.status(200).json({
                    error: Dao.UnexpectedError,
                });
            }
        } else {
            this.responseFail(
                res,
                `There is no tasks with id ${(req.body as TDaoTaskDelete).id}`,
                'delete'
            );
        }
    };

    public createTask = async (req: Request, res: Response): Promise<void> => {
        const { hasSucceded, message } = await this.dao.sanityCheckTask(
            req.body as TDaoTaskCreate,
            'create'
        );
        if (hasSucceded) {
            try {
                res.status(200).json({
                    sucess: await this.dao.task.create(
                        req.body as TDaoTaskCreate
                    ),
                });
                logger.info('New task created successfully');
            } catch (err) {
                logger.error(err);
                res.status(200).json({
                    error: Dao.UnexpectedError,
                });
            }
        } else {
            this.responseFail(res, message, 'create');
        }
    };

    public updateTask = async (req: Request, res: Response): Promise<void> => {
        const { hasSucceded, message } = await this.dao.sanityCheckTask(
            req.body as TDaoTaskUpdate
        );
        if (hasSucceded) {
            try {
                res.status(200).json({
                    sucess: this.dao.task.update(req.body as TDaoTaskUpdate),
                });
                logger.info(
                    `Task ${req.body.id} "${req.body.name}" updated successfully`
                );
            } catch (err) {
                logger.error(err);
                res.status(200).json({
                    error: Dao.UnexpectedError,
                });
            }
        } else {
            this.responseFail(res, message, 'update');
        }
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
        try {
            res.status(200).json({
                sucess: await this.dao.task.getAll(),
            });
        } catch (err) {
            logger.error(err);
            res.status(200).json({
                error: Dao.UnexpectedError,
            });
        }
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

    private responseFail(res: Response, message: string, job: string) {
        res.status(200).json({
            fail: message,
        });
        logger.debug(`Fail to ${job} task`);
    }
}
