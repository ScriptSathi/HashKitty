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

export class Hashcat {
    private listener: HashcatListener | undefined;
    private lastTaskRun: TTask | undefined;
    private outputFilePath: string | undefined;
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
        // this.fsUtils.
        if (this.hashlistHaveNeverBeenCracked(task)) {
            this.hashcatWorker = this.createWorkerThread();
            this.listener = new HashcatListener({
                worker: this.hashcatWorker,
                task,
                handleTaskHasFinnished: this.handleTaskHasFinnished,
            });
            this.cmd = new HashcatGenerator(task).generateStartCmd();
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
        this.cmd = new HashcatGenerator(task).generateRestoreCmd();
        this.hashcatWorker.postMessage(this.cmd);
        this.listenProcess();
    }

    private get outputFileExists(): boolean {
        if (!this.outputFilePath) {
            return false;
        }
        return this.outputFilePath
            ? fs.existsSync(
                  path.join(Constants.outputFilePath, this.outputFilePath)
              )
            : false;
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
        if (this.outputFilePath && this.lastTaskRun) {
            this.lastTaskRun.hashlistId.crackedOutputFileName =
                this.outputFilePath;
            this.dao.hashlist.update(
                this.lastTaskRun.hashlistId as unknown as Hashlist,
                false
            );
        }
        if (!this.outputFileExists) {
            this.generateOutputFileFromPotfile();
        }
    };

    private generateOutputFileFromPotfile(): void {
        if (this.lastTaskRun) {
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
