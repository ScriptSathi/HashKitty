import * as fs from 'fs-extra';

import { Request, Response } from 'express';
import { Hashcat } from '../hashcat/Hashcat';
import { Constants } from '../Constants';
import { logger } from '../utils/Logger';
import { DataSource } from 'typeorm';
import { Dao } from './DAOs/Dao';
import {
    TDaoById,
    TDaoTaskCreate,
    TDaoTaskDelete,
    TDaoTaskUpdate,
    TDaoTemplateTaskCreate,
    TDaoTemplateTaskDelete,
    TDaoTemplateTaskUpdate,
} from '../types/TDAOs';
import { TTask } from '../types/TApi';

export class RouteHandler {
    public hashcat: Hashcat = new Hashcat();
    private dao: Dao;

    constructor(db: DataSource) {
        this.dao = new Dao(db);
    }

    public execHashcat = async (req: Request, res: Response): Promise<void> => {
        const id = parseInt(req.body.id) as TDaoById['id'];
        if (!this.hashcat.status.isRunning) {
            if (id && (await this.dao.taskExistById(id))) {
                try {
                    this.hashcat.exec(
                        (await this.dao.task.getById(id)) as unknown as TTask
                    );
                    res.status(200).json({
                        success: 'Hashcat has started successfully',
                    });
                } catch (err) {
                    logger.error(
                        `An error occured while trying to start task: ${err}`
                    );
                    res.status(200).json({
                        fail: Dao.UnexpectedError,
                        error: `[ERROR]: ${err}`,
                    });
                }
            } else {
                this.responseFail(
                    res,
                    `There is not task for id ${id}`,
                    'start'
                );
            }
        } else {
            this.responseFail(res, 'Hashcat is already running', 'start');
        }
    };

    public restoreHashcat = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        const id = parseInt(req.body.id) as TDaoById['id'];
        if (!this.hashcat.status.isRunning) {
            if (id && (await this.dao.taskExistById(id))) {
                try {
                    this.hashcat.restore(
                        (await this.dao.task.getById(id)) as unknown as TTask
                    );
                    res.status(200).json({
                        success: 'Hashcat has beed restored successfully',
                    });
                } catch (err) {
                    logger.error(
                        `An error occured while trying to restore task: ${err}`
                    );
                    res.status(200).json({
                        fail: Dao.UnexpectedError,
                        error: `[ERROR]: ${err}`,
                    });
                }
            } else {
                this.responseFail(
                    res,
                    `There is not task for id ${id}`,
                    'restore'
                );
            }
        } else {
            this.responseFail(res, 'Hashcat is already running', 'start');
        }
    };

    public getHashcatStatus = (_: Request, res: Response): void => {
        if (this.hashcat.status.isRunning) {
            res.status(200).json({
                status: this.hashcat.status.isRunning,
            });
        } else {
            res.status(200).json({
                status: {},
                fail: 'Hashcat is not running',
            });
        }
    };

    public stopHashcat = (_: Request, res: Response): void => {
        if (this.hashcat.status.isRunning) {
            this.hashcat.stop();
            res.status(200).json({
                success: 'Hashcat stopped successfully',
            });
        } else {
            res.status(200).json({
                status: {},
                fail: 'Hashcat is not running',
            });
        }
    };

    public deleteTask = async (req: Request, res: Response): Promise<void> => {
        if (await this.dao.taskExistById((req.body as TDaoTaskDelete).id)) {
            try {
                res.status(200).json({
                    success: this.dao.task.deleteById(
                        (req.body as TDaoTaskDelete).id
                    ),
                });
                logger.info(
                    `Task deleted with id ${
                        (req.body as TDaoTaskDelete).id
                    } deleted successfully`
                );
            } catch (err) {
                logger.error(
                    `An error occured while trying to delete task: ${err}`
                );
                res.status(200).json({
                    fail: Dao.UnexpectedError,
                    error: `[ERROR]: ${err}`,
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
                    success: await this.dao.task.create(
                        req.body as TDaoTaskCreate
                    ),
                });
                logger.info('New task created successfully');
            } catch (err) {
                logger.error(
                    `An error occured while trying to create task: ${err}`
                );
                res.status(200).json({
                    fail: Dao.UnexpectedError,
                    error: `[ERROR]: ${err}`,
                });
            }
        } else {
            this.responseFail(res, message, 'create');
        }
    };

    public updateTask = async (req: Request, res: Response): Promise<void> => {
        const taskData = req.body as TDaoTaskUpdate;
        const { hasSucceded, message } = await this.dao.sanityCheckTask(
            taskData
        );
        if (taskData.id && hasSucceded) {
            try {
                res.status(200).json({
                    success: this.dao.task.update(taskData),
                });
                logger.info(
                    `Task ${taskData.id} "${taskData.name}" updated successfully`
                );
            } catch (err) {
                logger.error(
                    `An error occured while trying to update task: ${err}`
                );
                res.status(200).json({
                    fail: Dao.UnexpectedError,
                    error: `[ERROR]: ${err}`,
                });
            }
        } else {
            this.responseFail(res, message, 'update');
        }
    };

    public addFile = (req: Request, res: Response): void => {
        console.dir(req.files); //TODO
    };

    public deleteFile = (_: Request, res: Response): void => {
        throw new Error('PAS ENCORE FAIT'); //TODO
    };

    public updateFile = async (req: Request, res: Response): Promise<void> => {
        console.dir(req.files); //TODO
    };

    public deleteTemplateTask = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        const id = (req.body as TDaoTemplateTaskDelete).id;
        if (await this.dao.taskExistById(id)) {
            try {
                res.status(200).json({
                    success: this.dao.templateTask.deleteById(id),
                });
                logger.info(`Task deleted with id ${id} deleted successfully`);
            } catch (err) {
                logger.error(
                    `An error occured while trying to delete template task: ${err}`
                );
                res.status(200).json({
                    fail: Dao.UnexpectedError,
                    error: `[ERROR]: ${err}`,
                });
            }
        } else {
            this.responseFail(res, `There is no tasks with id ${id}`, 'delete');
        }
    };

    public createTemplateTask = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        const { hasSucceded, message } = await this.dao.sanityCheckTemplateTask(
            req.body as TDaoTemplateTaskCreate,
            'create'
        );
        if (hasSucceded) {
            try {
                res.status(200).json({
                    success: await this.dao.templateTask.create(
                        req.body as TDaoTemplateTaskCreate
                    ),
                });
                logger.info('New task created successfully');
            } catch (err) {
                logger.error(
                    `An error occured while trying to create template task: ${err}`
                );
                res.status(200).json({
                    fail: Dao.UnexpectedError,
                    error: `[ERROR]: ${err}`,
                });
            }
        } else {
            this.responseFail(res, message, 'create');
        }
    };

    public updateTemplateTask = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        const templateTaskData = req.body as TDaoTemplateTaskUpdate;
        const { hasSucceded, message } = await this.dao.sanityCheckTemplateTask(
            templateTaskData
        );
        if (hasSucceded) {
            try {
                res.status(200).json({
                    success: this.dao.templateTask.update(templateTaskData),
                });
                logger.info(
                    `Template task ${templateTaskData.id} "${req.body.name}" updated successfully`
                );
            } catch (err) {
                logger.error(
                    `An error occured while trying to update template task: ${err}`
                );
                res.status(200).json({
                    fail: Dao.UnexpectedError,
                    error: `[ERROR]: ${err}`,
                });
            }
        } else {
            this.responseFail(res, message, 'update');
        }
    };

    public getTemplateTasks = async (
        _: Request,
        res: Response
    ): Promise<void> => {
        try {
            res.status(200).json({
                success: await this.dao.templateTask.getAll(),
            });
        } catch (err) {
            logger.error(err);
            res.status(200).json({
                fail: Dao.UnexpectedError,
                error: `[ERROR]: ${err}`,
            });
        }
    };

    public getTemplateTaskById = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        const id = parseInt(req.params.id) as TDaoById['id'];
        if (id && (await this.dao.templateTaskExistById(id))) {
            try {
                res.status(200).json({
                    success: await this.dao.templateTask.getById(id),
                });
            } catch (err) {
                logger.error(err);
                res.status(200).json({
                    fail: Dao.UnexpectedError,
                    error: `[ERROR]: ${err}`,
                });
            }
        } else {
            this.responseFail(
                res,
                `There is no template task with id ${id}`,
                'get',
                'template task'
            );
        }
    };

    public getTasks = async (_: Request, res: Response): Promise<void> => {
        try {
            res.status(200).json({
                success: await this.dao.task.getAll(),
            });
        } catch (err) {
            logger.error(err);
            res.status(200).json({
                fail: Dao.UnexpectedError,
                error: `[ERROR]: ${err}`,
            });
        }
    };

    public getTaskById = async (req: Request, res: Response): Promise<void> => {
        const id = parseInt(req.params.id) as TDaoById['id'];
        if (id && (await this.dao.taskExistById(id))) {
            try {
                res.status(200).json({
                    success: await this.dao.task.getById(id),
                });
            } catch (err) {
                logger.error(err);
                res.status(200).json({
                    fail: Dao.UnexpectedError,
                    error: `[ERROR]: ${err}`,
                });
            }
        } else {
            this.responseFail(res, `There is no tasks with id ${id}`, 'delete');
        }
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

    private responseFail(
        res: Response,
        message: string,
        job: string,
        entity = 'task'
    ) {
        res.status(200).json({
            fail: message,
        });
        logger.debug(`Fail to ${job} ${entity}`);
    }
}
