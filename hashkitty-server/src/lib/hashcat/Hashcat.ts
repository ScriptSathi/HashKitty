import path = require('node:path');
import { Worker } from 'node:worker_threads';

import { Constants } from '../Constants';
import { FsUtils } from '../utils/FsUtils';
import { TTask } from '../types/TApi';
import { THashcatRunningStatus, THashcatStatus } from '../types/THashcat';
import { logger } from '../utils/Logger';
import { Task } from '../ORM/entity/Task';
import { Dao } from '../API/DAOs/Dao';
import { Hashlist } from '../ORM/entity/Hashlist';
import { HashcatListener } from './HashcatListener';

export class Hashcat {
    private listener: HashcatListener | undefined;
    private lastTaskRun: TTask | undefined;
    private outputFile: string | undefined;
    private bin: string;
    private dao: Dao;
    private fsUtils: FsUtils;
    private hashcatWorker: Worker | undefined;

    constructor(dao: Dao) {
        this.bin = Constants.defaultBin;
        this.dao = dao;
        this.fsUtils = new FsUtils(Constants.hashlistsPath);
    }

    public get status(): THashcatStatus {
        return this.listener
            ? this.listener.state
            : {
                  processState: 'stopped',
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
                handleHashlistIsCracked: this.handleHashlistIsCracked,
                handleTaskHasFinnished: this.handleTaskHasFinnished,
            });
            const cmd = this.generateCmd(task);
            logger.debug('Starting Hashcat cracking');
            this.hashcatWorker.postMessage(cmd);
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
            handleHashlistIsCracked: this.handleHashlistIsCracked,
            handleTaskHasFinnished: this.handleTaskHasFinnished,
        });
        logger.debug(`Restoring Hashcat session ${task.name}-${task.id}`);
        const cmd = this.generateCmd(task, false);
        logger.info(cmd);
        this.hashcatWorker.postMessage(cmd);
        this.listenProcess();
    }

    private generateCmd(task: TTask, isStart = true): string {
        const hashcatTaskName = `${task.name}-${task.id}`;
        const restorePath = `--restore-file-path=${path.join(
            Constants.restorePath,
            `${hashcatTaskName}`
        )}.restore`;
        const sessionCmd = `--session=${hashcatTaskName}`;
        let cmd = `${this.bin} --status --status-json --status-timer=1 --quiet ${restorePath} ${sessionCmd} `;
        if (isStart) {
            const wordlistPath = path.join(
                Constants.wordlistPath,
                task.options.wordlistId.name
            );
            const hashlistPath = path.join(
                Constants.hashlistsPath,
                task.hashlistId.name
            );
            const potfile = `--potfile-path=${path.join(
                Constants.potfilesPath,
                `${task.hashlistId.hashTypeId.typeNumber}`
            )}`;
            this.outputFile = `${task.hashlistId.name}-${task.hashlistId.id}`;
            const outputCmd = `--outfile=${path.join(
                Constants.outputFilePath,
                this.outputFile
            )}`;
            const attackModeCmd = `--attack-mode=${task.options.attackModeId.mode}`;
            const hashTypeCmd = `--hash-type=${task.hashlistId.hashTypeId.typeNumber}`;
            const cpuOnly = task.options.CPUOnly
                ? '--opencl-device-types=1'
                : '';
            // TODO --progress-only ??? plus précis
            //TODO Kernel opti
            const workloadProfiles = task.options.workloadProfileId
                ? `--workload-profile=${task.options.workloadProfileId.profileId}` //TODO A virer
                : '';
            const ruleFile = task.options.ruleName
                ? `--rule=${Constants.rulesPath}/${task.options.ruleName}`
                : '';
            cmd +=
                `${attackModeCmd} ${hashTypeCmd} ${potfile} ` +
                `${cpuOnly} ${outputCmd} ${ruleFile} ${workloadProfiles} ` +
                `${hashlistPath} ${wordlistPath}`;
        } else {
            cmd += '--restore';
        }
        this.lastTaskRun = task;
        return cmd;
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
    };

    private handleHashlistIsCracked = (): void => {
        if (this.outputFile && this.lastTaskRun) {
            this.lastTaskRun.hashlistId.crackedOutputFileName = this.outputFile;
            this.dao.hashlist.update(
                this.lastTaskRun.hashlistId as unknown as Hashlist,
                false
            );
        }
    };
}
