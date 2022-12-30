import path = require('node:path');
import { Worker } from 'node:worker_threads';

import { Constants } from '../Constants';
import { FileManager } from '../FileManager';
import { TTask } from '../types/TApi';
import { THashcatStatus } from '../types/THashcat';
import { logger } from '../utils/Logger';
import { DaoTasks } from '../API/DAOs/DaoTasks';
import { Task } from '../ORM/entity/Task';

export class Hashcat {
    public status: THashcatStatus = { isRunning: false };
    private lastTaskRun: TTask | undefined;
    private bin: string;
    private daoTasks: DaoTasks;
    private hashFileManager: FileManager;
    private hashcatWorker: Worker | undefined;

    constructor(daoTasks: DaoTasks) {
        this.bin = Constants.defaultBin;
        this.daoTasks = daoTasks;
        this.hashFileManager = new FileManager(Constants.hashlistsPath);
    }

    public exec(task: TTask): void {
        this.hashcatWorker = this.createWorkerThread();
        const cmd = this.generateCmd(task);
        logger.debug('Starting Hashcat cracking');
        logger.debug(cmd);
        this.hashcatWorker.postMessage(cmd);
        this.listenStdoutAndSetStatus();
    }

    public stop(): void {
        if (this.hashcatWorker) {
            logger.debug('Stopping the hashcat process');
            this.hashcatWorker.postMessage('exit');
            this.status.isRunning = false;
        }
    }

    public restore(task: TTask): void {
        this.hashcatWorker = this.createWorkerThread();
        logger.debug(`Restoring Hashcat session ${task.name}-${task.id}`);
        const cmd = this.generateCmd(task, false);
        logger.info(cmd);
        this.hashcatWorker.postMessage(cmd);
        this.listenStdoutAndSetStatus();
    }

    private generateCmd(task: TTask, isStart = true): string {
        const hashcatTaskName = `${task.name}-${task.id}`;
        const restorePath = `--restore-file-path=${path.join(
            Constants.restorePath,
            `${hashcatTaskName}`
        )}.restore`;
        const sessionCmd = `--session=${hashcatTaskName}`;
        let cmd = `${this.bin} --status-json --quiet ${restorePath} ${sessionCmd} `;
        if (isStart) {
            const wordlistCmd = path.join(
                Constants.wordlistPath,
                task.options.wordlistId.name
            );
            const hashlistCmd = path.join(
                Constants.hashlistsPath,
                task.hashlistId.name
            );
            const potfile = `--potfile-path=${path.join(
                Constants.potfilesPath,
                `${task.hashlistId.hashTypeId.typeNumber}`
            )}`;
            const output = `--outfile=${path.join(
                Constants.outputFilePath,
                `${hashcatTaskName}`
            )}`;
            const attackModeCmd = `--attack-mode=${task.options.attackModeId.mode}`;
            const hashTypeCmd = `--hash-type=${task.hashlistId.hashTypeId.typeNumber}`;
            const cpuOnly = task.options.CPUOnly
                ? '--opencl-device-types=1'
                : '';
            // TODO --progress-only ???
            // TODO --quiet remove to get ended output ?
            const workloadProfiles = task.options.workloadProfileId
                ? `--workload-profile=${task.options.workloadProfileId.profileId}`
                : '';
            const ruleFile = task.options.ruleName
                ? `--rule=${Constants.rulesPath}/${task.options.ruleName}`
                : '';
            cmd +=
                `${attackModeCmd} ${hashTypeCmd} ${potfile} ` +
                `${cpuOnly} ${output} ${ruleFile} ${workloadProfiles} ` +
                `${hashlistCmd} ${wordlistCmd}`;
        } else {
            cmd += '--restore';
        }
        this.lastTaskRun = task;
        return cmd;
    }

    private listenStdoutAndSetStatus(): void {
        this.hashcatWorker &&
            this.hashcatWorker.on('message', hashcatStdout => {
                if (hashcatStdout === 'ended' && this.lastTaskRun) {
                    this.hashcatWorker?.terminate();
                    this.status.isRunning = false;
                    this.daoTasks.registerTaskEnded(
                        this.lastTaskRun as unknown as Task
                    );
                }
                if (
                    hashcatStdout.status !== undefined &&
                    hashcatStdout.status !== ''
                ) {
                    this.status = { ...hashcatStdout, isRunning: true };
                } else if (
                    hashcatStdout.any !== undefined &&
                    hashcatStdout.any !== ''
                ) {
                    if (hashcatStdout.any.match(/\n/g)) {
                        logger.debug(
                            '\n-------------------Hashcat warning-------------------\n' +
                                hashcatStdout.any +
                                '\n---------------------------------------------------------'
                        );
                    }
                    logger.debug('Message from stdout: ' + hashcatStdout.any);
                } else {
                    this.hashcatWorker?.terminate();
                }
            });
    }

    private createWorkerThread(): Worker {
        return new Worker(path.join(__dirname, '../utils/Processus.js'));
    }
}
