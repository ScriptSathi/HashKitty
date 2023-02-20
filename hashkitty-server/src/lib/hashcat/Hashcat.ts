import path = require('node:path');
import { Worker } from 'node:worker_threads';
import * as fs from 'fs-extra';

import { Constants } from '../Constants';
import { FsUtils } from '../utils/FsUtils';
import { TTask } from '../types/TApi';
import { THashcatRunningStatus, THashcatStatus } from '../types/THashcat';
import { logger } from '../utils/Logger';
import { Task } from '../ORM/entity/Task';
import { Dao } from '../API/DAOs/Dao';
import { Hashlist } from '../ORM/entity/Hashlist';
import { HashcatListener } from './HashcatListener';
import { HashcatGenerator } from './HashcatGenerator';

type currentJobData = {
    task: TTask;
    outputFilePath: string;
};

export class Hashcat {
    private listener: HashcatListener | undefined;
    private currentJobData: currentJobData | undefined;
    private cmd: string;
    private dao: Dao;
    private fsUtils: FsUtils;
    private hashcatWorker: Worker | undefined;

    constructor(dao: Dao) {
        this.cmd = '';
        this.dao = dao;
        this.fsUtils = new FsUtils(Constants.hashlistsPath);
    }

    public get status(): THashcatStatus {
        return this.listener
            ? this.listener.state
            : {
                  processState: 'stopped',
                  exitInfo: '',
                  runningStatus: <THashcatRunningStatus>{},
              };
    }

    public get isRunning(): boolean {
        return this.listener
            ? this.listener.state.processState === 'running'
            : false;
    }

    public exec(task: TTask): void {
        if (this.hashlistHaveNeverBeenCracked(task)) {
            this.hashcatWorker = this.createWorkerThread();
            this.listener = new HashcatListener({
                worker: this.hashcatWorker,
                task,
                handleTaskHasFinnished: this.handleTaskHasFinnished,
            });
            const generator = new HashcatGenerator(task);
            this.cmd = generator.generateStartCmd();
            this.currentJobData = {
                task,
                outputFilePath: generator.outputFilePath,
            };
            logger.debug('Starting Hashcat cracking');
            this.hashcatWorker.postMessage(this.cmd);
            this.listenProcess();
        } else {
            this.handleTaskHasFinnished(task);
        }
    }

    public stop(): void {
        if (this.hashcatWorker) {
            logger.debug('Stopping the hashcat process');
            this.hashcatWorker.postMessage('exit');
        }
    }

    public restore(task: TTask): void {
        this.hashcatWorker = this.createWorkerThread();
        this.listener = new HashcatListener({
            worker: this.hashcatWorker,
            task,
            handleTaskHasFinnished: this.handleTaskHasFinnished,
        });
        logger.debug(`Restoring Hashcat session ${task.name}-${task.id}`);
        const generator = new HashcatGenerator(task);
        this.cmd = generator.generateRestoreCmd();
        this.currentJobData = {
            task,
            outputFilePath: generator.outputFilePath,
        };
        this.hashcatWorker.postMessage(this.cmd);
        this.listenProcess();
    }

    private get outputFileExists(): boolean {
        if (!this.currentJobData?.outputFilePath) {
            return false;
        }
        return fs.existsSync(this.currentJobData.outputFilePath);
    }

    private listenProcess(): void {
        if (this.listener && this.hashcatWorker) {
            this.hashcatWorker.on('message', this.listener.listen);
        }
    }

    private createWorkerThread(): Worker {
        return new Worker(path.join(__dirname, '../utils/Processus.js'));
    }

    private hashlistHaveNeverBeenCracked(task: TTask): boolean {
        return task.hashlistId.crackedOutputFileName === null;
    }

    private handleTaskHasFinnished = (task: TTask): void => {
        this.dao.task.registerTaskEnded(task as unknown as Task);
        if (this.currentJobData) {
            this.currentJobData.task.hashlistId.crackedOutputFileName =
                this.currentJobData.outputFilePath;
            this.dao.hashlist.update(
                this.currentJobData.task.hashlistId as unknown as Hashlist,
                false
            );
        }
        if (!this.outputFileExists) {
            this.generateOutputFileFromPotfile();
        }
    };

    private generateOutputFileFromPotfile(): void {
        if (!this.outputFileExists) {
            const tmpProcess = this.createWorkerThread();
            const cmdShow = this.cmd + ' --show';
            logger.info('Generating the output file based on potfile recordes');
            tmpProcess.postMessage(cmdShow);
            setTimeout(() => {
                tmpProcess.terminate();
            }, 1000);
        }
    }
}
