import * as fs from 'fs-extra';

import { Request, Response } from 'express';
import { Hashcat } from '../hashcat/Hashcat';
import { Constants } from '../Constants';

export class RouteHandler {
    public hashcat: Hashcat = new Hashcat();

    public execHashcat = (req: Request, res: Response): void => {
        this.hashcat.exec(req.body);
        try {
            res.status(200).json({
                status: 'Hashcat has start',
            });
        } catch (err) {
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
        throw new Error('PAS ENCORE FAIT');
    };

    public addTask = (_: Request, res: Response): void => {
        throw new Error('PAS ENCORE FAIT');
    };

    public updateTask = (_: Request, res: Response): void => {
        throw new Error('PAS ENCORE FAIT');
    };

    public addFile = (_: Request, res: Response): void => {
        throw new Error('PAS ENCORE FAIT');
    };

    public deleteFile = (_: Request, res: Response): void => {
        throw new Error('PAS ENCORE FAIT');
    };

    public updateFile = (_: Request, res: Response): void => {
        throw new Error('PAS ENCORE FAIT');
    };

    public addTemplateTask = (_: Request, res: Response): void => {
        throw new Error('PAS ENCORE FAIT');
    };

    public deleteTemplateTask = (_: Request, res: Response): void => {
        throw new Error('PAS ENCORE FAIT');
    };

    public updateTemplateTask = (_: Request, res: Response): void => {
        throw new Error('PAS ENCORE FAIT');
    };

    public getTemplateTasks = (_: Request, res: Response): void => {
        throw new Error('PAS ENCORE FAIT');
    };

    public getTemplateTaskById = (req: Request, res: Response): void => {
        const id = req?.params.id;
        // check if id exist in DB and return value
        throw new Error('PAS ENCORE FAIT');
    };

    public getTasks = (_: Request, res: Response): void => {
        throw new Error('PAS ENCORE FAIT');
    };

    public getTaskById = (req: Request, res: Response): void => {
        const id = req?.params.id;
        // check if id exist in DB and return value
        throw new Error('PAS ENCORE FAIT');
    };





    public getFilesInWordlistDir = (_: Request, res: Response): void => {
        this.sendFileInDir(res, Constants.wordlistPath);
    };

    public getFilesInHashlistDir = (_: Request, res: Response): void => {
        this.sendFileInDir(res, Constants.hashlistsPath);
    };

    public getFilesInPotfileDir = (_: Request, res: Response): void => {
        this.sendFileInDir(res, Constants.potfilesPath);
    };

    public getFilesInRulesDir = (_: Request, res: Response): void => {
        this.sendFileInDir(res, Constants.rulesPath);
    };

    private sendFileInDir = (res: Response, dirPath: string): void => {
        try {
            const files = fs.readdirSync(dirPath);
            res.json({
                files,
            });
        } catch (e) {
            res.status(200).json({
                error: {
                    name: 'An error occured while reading ',
                    message: e || 'No message error',
                },
            });
        }
    };
}
