import path = require('path');
import * as fs from 'fs-extra';

import { Hashcat } from '../hashcat/Hashcat';
import { Constants } from '../Constants';
import { logger } from '../utils/Logger';
import { DataSource } from 'typeorm';
import { Dao } from './DAOs/Dao';
import { TTask } from '../types/TApi';
import { AddHashlist, TaskUpdate, TemplateTaskUpdate } from '../types/TRoutes';
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
        if (this.hashcat.isRunning) {
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
                message: 'Hashcat has started successfully',
                success: true,
            });
        } catch (err) {
            logger.error(`An error occured while trying to start task: ${err}`);
            res.status(200).json({
                message: Dao.UnexpectedError,
                error: `[ERROR]: ${err}`,
            });
        }
    };

    public restoreHashcat = async (
        req: ReceivedRequest<ReqID>,
        res: ResponseSend
    ): Promise<void> => {
        const id = (req.body.id && parseInt(req.body.id)) || undefined;
        if (!this.hashcat.isRunning) {
            if (id && (await this.dao.taskExistById(id))) {
                try {
                    this.hashcat.restore(
                        (await this.dao.task.getById(id)) as unknown as TTask
                    );
                    res.status(200).json({
                        message: 'Hashcat has beed restored successfully',
                        success: true,
                    });
                } catch (err) {
                    logger.error(
                        `An error occured while trying to restore task: ${err}`
                    );
                    res.status(200).json({
                        message: Dao.UnexpectedError,
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
        res.status(200).json({
            message: '',
            status: this.hashcat.status,
        });
    };

    public stopHashcat = (_: ReceivedRequest, res: ResponseSend): void => {
        if (this.hashcat.isRunning) {
            this.hashcat.stop();
            res.status(200).json({
                message: 'Hashcat stopped successfully',
                success: true,
            });
        } else {
            res.status(200).json({
                status: {},
                message: 'Hashcat is not running',
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
                    message: respMessage,
                    success: true,
                });
                logger.info(respMessage);
            } catch (err) {
                logger.error(
                    `An error occured while trying to delete task: ${err}`
                );
                res.status(200).json({
                    message: Dao.UnexpectedError,
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
        req: ReceivedRequest<TaskUpdate>,
        res: ResponseSend
    ): Promise<void> => {
        try {
            const sanitizer = new Sanitizer(this.dao);
            await sanitizer.analyseTask(req.body);
            if (sanitizer.hasSucceded) {
                let message = '';
                if (sanitizer.isAnUpdate) {
                    logger.info(
                        `Task ${req.body.id} "${req.body.name}" updated successfully`
                    );
                    message = `Task "${req.body.name}" updated successfully`;
                } else {
                    message = 'New task created successfully';
                    logger.info(message);
                }
                res.status(200).json({
                    message,
                    success: await this.dao.task.create(sanitizer.getTask()),
                });
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
                message: Dao.UnexpectedError,
                error: `[ERROR]: ${err}`,
            });
        }
    };

    public addHashlist = async (
        req: ReceivedRequest<AddHashlist>,
        res: ResponseSend
    ): Promise<void> => {
        const body: AddHashlist = req.body;
        const sanitizer = new Sanitizer(this.dao);
        await sanitizer.analyseHashlist(body);
        if (!body || !req.files || Object.keys(req.files).length === 0) {
            res.status(400).json({
                message: 'No files were uploaded.',
            });
            return;
        }
        if (!sanitizer.hasSucceded) {
            res.status(200).json({
                message: Dao.UnexpectedError,
                error: `[ERROR]: ${sanitizer.errorMessage}`,
            });
            return;
        }
        try {
            const hashlist = sanitizer.getHashlist();
            const respMessage = `File ${hashlist.name} uploaded, successfully, and hashlist added correctly !`;
            await FsUtils.uploadFile(
                req.files.file as UploadedFile,
                hashlist.name,
                'hashlist'
            );
            await this.dao.hashlist.update(hashlist);
            res.status(200).json({
                success: respMessage,
                message: respMessage,
            });
            logger.info(respMessage);
        } catch (err) {
            res.status(500).json({
                error: err,
                message: 'An error occurred',
            });
            logger.error(err);
        }
    };

    public taskResults = (
        req: ReceivedRequest<ReqFileResults>,
        res: ResponseSend
    ): void => {
        if (!req.body.filename) {
            res.status(400).json({
                passwds: [],
                message: 'You need to submit the filename',
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
                message: '',
            });
        } catch (err) {
            logger.debug(err);
            res.status(400).json({
                passwds: [],
                message: `file ${req.body.filename} does not exist`,
            });
        }
    };

    public deleteHashlist(arg0: string, deleteHashlist: any) {
        throw new Error('Method not implemented.');
    }

    public deleteFile = (_: ReceivedRequest, res: ResponseSend): void => {
        throw new Error('PAS ENCORE FAIT'); //TODO
    };

    public updateFile = async (
        req: ReceivedRequest,
        res: ResponseSend
    ): Promise<void> => {
        console.dir(req.files); //TODO
    };

    public deleteTemplate = async (
        req: ReceivedRequest,
        res: ResponseSend
    ): Promise<void> => {
        const id = (req.body.id && parseInt(req.body.id)) || undefined;
        if (id && (await this.dao.templateTaskExistById(id))) {
            try {
                const message = `Template deleted with id ${id} deleted successfully`;
                res.status(200).json({
                    success: this.dao.templateTask.deleteById(id),
                    message,
                });
                logger.info(message);
            } catch (err) {
                logger.error(
                    `An error occured while trying to delete template : ${err}`
                );
                res.status(200).json({
                    message: Dao.UnexpectedError,
                    error: `[ERROR]: ${err}`,
                });
            }
        } else {
            this.responseFail(
                res,
                `There is no template with id ${id || 'undefined'}`,
                'delete'
            );
        }
    };

    public updateTemplateTask = async (
        req: ReceivedRequest<TemplateTaskUpdate>,
        res: ResponseSend
    ): Promise<void> => {
        try {
            const sanitizer = new Sanitizer(this.dao);
            await sanitizer.analyseTemplateTask(req.body);
            if (sanitizer.hasSucceded) {
                let message = '';
                if (sanitizer.isAnUpdate) {
                    message = `Template "${req.body.name}" updated successfully`;
                    logger.info(
                        `Template ${req.body.id} "${req.body.name}" updated successfully`
                    );
                } else {
                    message = 'New template created successfully';
                    logger.info(message);
                }
                res.status(200).json({
                    message,
                    success: await this.dao.templateTask.create(
                        sanitizer.getTemplateTask()
                    ),
                });
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
                message: Dao.UnexpectedError,
                error: `[ERROR]: ${err}`,
            });
        }
    };

    public getTemplate = async (
        _: ReceivedRequest,
        res: ResponseSend
    ): Promise<void> => {
        try {
            res.status(200).json({
                message: '',
                success: await this.dao.templateTask.getAll(),
            });
        } catch (err) {
            logger.error(err);
            res.status(200).json({
                message: Dao.UnexpectedError,
                error: `[ERROR]: ${err}`,
            });
        }
    };

    public getTemplateById = async (
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
                message: '',
                success: await this.dao.templateTask.getById(id),
            });
        } catch (err) {
            logger.error(err);
            res.status(200).json({
                message: Dao.UnexpectedError,
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
                message: '',
                success: await this.dao.task.getAll(),
            });
        } catch (err) {
            logger.error(err);
            res.status(200).json({
                message: Dao.UnexpectedError,
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
                    message: '',
                    success: await this.dao.task.getById(id),
                });
            } catch (err) {
                logger.error(err);
                res.status(200).json({
                    message: Dao.UnexpectedError,
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
                message: '',
                success: await this.dao.hashlist.getAll(),
            });
        } catch (err) {
            logger.error(err);
            res.status(200).json({
                message: Dao.UnexpectedError,
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
                message: '',
                success: await this.dao.attackMode.getAll(),
            });
        } catch (err) {
            logger.error(err);
            res.status(200).json({
                message: Dao.UnexpectedError,
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
                message: '',
                success: await this.dao.hashType.getAll(),
            });
        } catch (err) {
            logger.error(err);
            res.status(200).json({
                message: Dao.UnexpectedError,
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
                message: '',
                success: 'Update successfully',
            });
        } catch (err) {
            logger.error(err);
            res.status(200).json({
                message: Dao.UnexpectedError,
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
                message: '',
                success: files,
            });
        } catch (e) {
            logger.error(
                `An error occured while reading dir ${dirPath} - Error: ${e}`
            );
            const msgError = `An error occured while reading dir ${dirPath}`;
            res.status(200).json({
                message: msgError,
                error: {
                    name: msgError,
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
            message,
        });
        logger.debug(`Fail to ${job} ${entity}`);
        logger.debug(`Message: ${message}`);
    }
}
