import path = require('path');
import * as fs from 'fs-extra';

import { Hashcat } from '../hashcat/Hashcat';
import { Constants } from '../Constants';
import { logger } from '../utils/Logger';
import { DataSource } from 'typeorm';
import { Dao } from './DAOs/Dao';
import { ApiTaskUpdate, ApiTemplateTaskUpdate } from '../types/TDAOs';
import { TTask, TUploadReqBody } from '../types/TApi';
import { FsUtils } from '../utils/FsUtils';
import { Sanitizer } from './Sanitizer';
import { UploadedFile } from 'express-fileupload';
import {
    ReceivedRequest,
    ReqFileResults,
    ReqID,
    ResponseSend,
} from '../types/TRoutes';

export class RouteHandler {
    public hashcat: Hashcat;
    private dao: Dao;

    constructor(db: DataSource) {
        this.dao = new Dao(db);
        this.hashcat = new Hashcat(this.dao);
    }

    public execHashcat = async (
        req: ReceivedRequest<ReqID>,
        res: ResponseSend
    ): Promise<void> => {
        const id = (req.body.id && parseInt(req.body.id)) || undefined;
        if (this.hashcat.state.isRunning) {
            this.responseFail(res, 'Hashcat is already running', 'start');
            return;
        }
        if (!id || (id && !(await this.dao.taskExistById(id)))) {
            this.responseFail(res, `There is not task for id ${id}`, 'start');
            return;
        }
        try {
            this.hashcat.exec(
                (await this.dao.task.getById(id)) as unknown as TTask
            );
            res.status(200).json({
                success: 'Hashcat has started successfully',
            });
        } catch (err) {
            logger.error(`An error occured while trying to start task: ${err}`);
            res.status(200).json({
                fail: Dao.UnexpectedError,
                error: `[ERROR]: ${err}`,
            });
        }
    };

    public restoreHashcat = async (
        req: ReceivedRequest<ReqID>,
        res: ResponseSend
    ): Promise<void> => {
        const id = (req.body.id && parseInt(req.body.id)) || undefined;
        if (!this.hashcat.state.isRunning) {
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

    public getHashcatStatus = (_: ReceivedRequest, res: ResponseSend): void => {
        if (this.hashcat.state.isRunning || this.hashcat.state) {
            res.status(200).json({
                status: this.hashcat.state,
            });
        } else {
            res.status(200).json({
                status: {},
                fail: 'Hashcat is not running',
            });
        }
    };

    public stopHashcat = (_: ReceivedRequest, res: ResponseSend): void => {
        if (this.hashcat.state.isRunning) {
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

    public deleteTask = async (
        req: ReceivedRequest<ReqID>,
        res: ResponseSend
    ): Promise<void> => {
        const id = (req.body.id && parseInt(req.body.id)) || undefined;
        if (id && (await this.dao.taskExistById(id))) {
            try {
                this.dao.task.deleteById(id);
                const respMessage = `Task deleted with id ${id} deleted successfully`;
                res.status(200).json({
                    success: respMessage,
                });
                logger.info(respMessage);
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
                `There is no tasks with id ${id || 'undefined'}`,
                'delete'
            );
        }
    };

    public updateTask = async (
        req: ReceivedRequest<ApiTaskUpdate>,
        res: ResponseSend
    ): Promise<void> => {
        try {
            const sanitizer = new Sanitizer(this.dao);
            await sanitizer.analyseTask(req.body);
            if (sanitizer.hasSucceded) {
                res.status(200).json({
                    success: await this.dao.task.create(sanitizer.getTask()),
                });
                sanitizer.isAnUpdate
                    ? logger.info(
                          `Task ${req.body.id} "${req.body.name}" updated successfully`
                      )
                    : logger.info('New task created successfully');
            } else {
                this.responseFail(
                    res,
                    sanitizer.errorMessage,
                    sanitizer.isAnUpdate ? 'update' : 'create'
                );
            }
        } catch (err) {
            logger.error(
                `An error occured while trying to create task: ${err}`
            );
            res.status(200).json({
                fail: Dao.UnexpectedError,
                error: `[ERROR]: ${err}`,
            });
        }
    };

    public addFile = (
        req: ReceivedRequest<TUploadReqBody>,
        res: ResponseSend
    ): void => {
        const body = req.body;
        if (!req.files || Object.keys(req.files).length === 0) {
            res.status(400).json({
                error: 'No files were uploaded.',
            });
            return;
        }
        if (!body.filetype || !body.filename) {
            res.status(400).json({
                error: 'No files were uploaded.',
            });
            return;
        }

        let baseDir = '';
        switch (body.filetype) {
            case 'hashlist':
                baseDir = Constants.hashlistsPath;
                break;
            case 'wordlist':
                baseDir = Constants.wordlistPath;
                break;
            case 'rule':
                baseDir = Constants.rulesPath;
                break;
            case 'potfile':
                baseDir = Constants.potfilesPath;
                break;
            default:
                res.status(400).json({
                    error: 'Wrong data submitted',
                });
                return;
        }

        const sampleFile = req.files.sampleFile as UploadedFile;
        const uploadPath = path.join(baseDir, body.filename);

        sampleFile.mv(uploadPath, err => {
            if (err) {
                res.status(500).json({ error: err });
                return;
            }
        });
        res.status(200).json({
            success: `File ${body.filename} uploaded!`,
        });
    };

    public taskResults = (
        req: ReceivedRequest<ReqFileResults>,
        res: ResponseSend
    ): void => {
        if (!req.body.filename) {
            res.status(400).json({
                passwds: [],
                error: 'You need to submit the filename',
            });
            return;
        }
        try {
            const taskResults = fs
                .readFileSync(
                    path.join(Constants.outputFilePath, req.body.filename)
                )
                .toString('utf-8')
                .split('\n')
                .filter(line => line);
            res.status(200).json({
                passwds: taskResults,
            });
        } catch (err) {
            logger.debug(err);
            res.status(400).json({
                passwds: [],
                error: `file ${req.body.filename} does not exist`,
            });
        }
    };

    public deleteFile = (_: ReceivedRequest, res: ResponseSend): void => {
        throw new Error('PAS ENCORE FAIT'); //TODO
    };

    public updateFile = async (
        req: ReceivedRequest,
        res: ResponseSend
    ): Promise<void> => {
        console.dir(req.files); //TODO
    };

    public deleteTemplateTask = async (
        req: ReceivedRequest,
        res: ResponseSend
    ): Promise<void> => {
        const id = (req.body.id && parseInt(req.body.id)) || undefined;
        if (id && (await this.dao.taskExistById(id))) {
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
            this.responseFail(
                res,
                `There is no tasks with id ${id || 'undefined'}`,
                'delete'
            );
        }
    };

    public updateTemplateTask = async (
        req: ReceivedRequest,
        res: ResponseSend
    ): Promise<void> => {
        try {
            const sanitizer = new Sanitizer(this.dao);
            await sanitizer.analyseTemplateTask(
                req.body as ApiTemplateTaskUpdate
            );
            if (sanitizer.hasSucceded) {
                res.status(200).json({
                    success: await this.dao.templateTask.create(
                        sanitizer.getTemplateTask()
                    ),
                });
                sanitizer.isAnUpdate
                    ? logger.info(
                          `Template task ${req.body.id} "${req.body.name}" updated successfully`
                      )
                    : logger.info('New template task created successfully');
            } else {
                this.responseFail(
                    res,
                    sanitizer.errorMessage,
                    sanitizer.isAnUpdate ? 'update' : 'create'
                );
            }
        } catch (err) {
            logger.error(
                `An error occured while trying to create task: ${err}`
            );
            res.status(200).json({
                fail: Dao.UnexpectedError,
                error: `[ERROR]: ${err}`,
            });
        }
    };

    public getTemplateTasks = async (
        _: ReceivedRequest,
        res: ResponseSend
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
        req: ReceivedRequest<ReqID>,
        res: ResponseSend
    ): Promise<void> => {
        const id = (req.body.id && parseInt(req.body.id)) || undefined;
        if (!id || (id && !(await this.dao.templateTaskExistById(id)))) {
            this.responseFail(
                res,
                `There is no template task with id ${id}`,
                'get',
                'template task'
            );
            return;
        }
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
    };

    public getTasks = async (
        _: ReceivedRequest,
        res: ResponseSend
    ): Promise<void> => {
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

    public getTaskById = async (
        req: ReceivedRequest,
        res: ResponseSend
    ): Promise<void> => {
        const id = (req.body.id && parseInt(req.body.id)) || undefined;
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

    public getHashlists = async (
        _: ReceivedRequest,
        res: ResponseSend
    ): Promise<void> => {
        try {
            res.status(200).json({
                success: await this.dao.hashlist.getAll(),
            });
        } catch (err) {
            logger.error(err);
            res.status(200).json({
                fail: Dao.UnexpectedError,
                error: `[ERROR]: ${err}`,
            });
        }
    };

    public getAttackModes = async (
        _: ReceivedRequest,
        res: ResponseSend
    ): Promise<void> => {
        try {
            res.status(200).json({
                success: await this.dao.attackMode.getAll(),
            });
        } catch (err) {
            logger.error(err);
            res.status(200).json({
                fail: Dao.UnexpectedError,
                error: `[ERROR]: ${err}`,
            });
        }
    };

    public getHashTypes = async (
        _: ReceivedRequest,
        res: ResponseSend
    ): Promise<void> => {
        try {
            res.status(200).json({
                success: await this.dao.hashType.getAll(),
            });
        } catch (err) {
            logger.error(err);
            res.status(200).json({
                fail: Dao.UnexpectedError,
                error: `[ERROR]: ${err}`,
            });
        }
    };

    public reloadWordlists = async (
        _: ReceivedRequest,
        res: ResponseSend
    ): Promise<void> => {
        try {
            await this.dao.reloadWordlistInDB();
            await this.dao.reloadHashlistInDB();
            res.status(200).json({
                success: 'Update successfully',
            });
        } catch (err) {
            logger.error(err);
            res.status(200).json({
                fail: Dao.UnexpectedError,
                error: `[ERROR]: ${err}`,
            });
        }
    };

    public getFilesInWordlistDir = (
        _: ReceivedRequest,
        res: ResponseSend
    ): void => {
        this.getFileInDir(res, Constants.wordlistPath);
    };

    public getFilesInPotfileDir = (
        _: ReceivedRequest,
        res: ResponseSend
    ): void => {
        this.getFileInDir(res, Constants.potfilesPath);
    };

    public getFilesInRulesDir = (
        _: ReceivedRequest,
        res: ResponseSend
    ): void => {
        this.getFileInDir(res, Constants.rulesPath);
    };

    private getFileInDir(res: ResponseSend, dirPath: string): void {
        try {
            const files = FsUtils.listFileInDir(dirPath);
            res.json({
                success: files,
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
        res: ResponseSend,
        message: string,
        job: string,
        entity = 'task'
    ) {
        res.status(200).json({
            fail: message,
        });
        logger.debug(`Fail to ${job} ${entity}`);
        logger.debug(`Message: ${message}`);
    }
}
