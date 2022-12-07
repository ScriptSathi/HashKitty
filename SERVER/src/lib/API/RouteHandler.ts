import * as fs from 'fs-extra';

import { Request, Response } from 'express';
import { Hashcat } from '../hashcat/Hashcat';
import { Constants } from '../Constants';
import { logger } from '../utils/Logger';

export class RouteHandler {
    public hashcat: Hashcat = new Hashcat();

    public execHashcat = (req: Request, res: Response): void => {
        try {
            this.hashcat.exec(req.body);
            res.status(200).json({
                status: 'Hashcat has start',
            });
        } catch (err) {
            logger.error(
                `An error occured during the startup of hashcat ERROR - ${err}`
            );
            res.status(200).json({
                status: 'An error occurred during the execution of hashcat',
            });
        }
    };

    public restoreHashcat = (req: Request, res: Response): void => {
        try {
            this.hashcat.restore(req.body);
            res.status(200).json({
                status: 'Hashcat has been restored',
            });
        } catch (err) {
            logger.error(
                `An error occured during the startup of hashcat: ERROR - ${err}`
            );
            res.status(200).json({
                status: 'An error occurred during the execution of hashcat',
            });
        }
    };

    public getHashcatStatus = (_: Request, res: Response): void => {
        if (this.hashcat.status && this.hashcat.status.isRunning) {
            res.status(200).send({
                status: this.hashcat.status,
            });
        } else {
            res.status(200).json({
                status: 'Hashcat is not running',
            });
        }
    };

    public getStopHashcat = (_: Request, res: Response): void => {
        if (this.hashcat.status && this.hashcat.status.isRunning) {
            this.hashcat.stop();
            res.status(200).json({
                status: 'Hashcat has been stopped',
            });
        } else {
            res.status(200).json({
                status: 'Hashcat is not running',
            });
        }
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

    public getTasks = (_: Request, res: Response): void => {
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
