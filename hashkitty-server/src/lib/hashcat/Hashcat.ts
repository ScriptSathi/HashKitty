import path = require('node:path');
import { Worker } from 'node:worker_threads';

import { Constants } from '../Constants';
import { FileManager } from '../FileManager';
import { TTask } from '../types/TApi';
import { THashcatStatus } from '../types/THashcat';
import { logger } from '../utils/Logger';

export class Hashcat {
    public status: THashcatStatus = { isRunning: false };
    private bin: string;
    private hashFileManager: FileManager;
    private hashcatWorker: Worker | undefined;

    constructor() {
        this.bin = Constants.defaultBin;
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
        logger.info(this.generateCmd(task, false));
        this.hashcatWorker.postMessage(this.generateCmd(task, false));
        this.listenStdoutAndSetStatus();
    }

    private generateCmd(task: TTask, isStart = true): string {
        const restorePath = `--restore-file-path=${path.join(
            Constants.restorePath,
            `${task.name}-${task.id}`
        )}.restore`;
        let cmd = `${this.bin} --status-json --quiet ${restorePath}`;
        if (isStart) {
            const wordlistCmd = path.join(
                Constants.wordlistPath,
                task.options.wordlistId.path
            );
            const hashlistCmd = task.hashlistId.path;
            const attackModeCmd = `--attack-mode=${task.options.attackModeId.mode}`;
            const hashTypeCmd = `--hash-type=${task.hashTypeId.typeNumber}`;
            const sessionCmd = `--session=${task.name}-${task.id}`;
            const cpuOnly = task.options.CPUOnly
                ? '--opencl-device-types=1'
                : '';
            const workloadProfiles = task.options.workloadProfileId
                ? `--workload-profile=${task.options.workloadProfileId.profileId}`
                : '--workload-profile=3';
            const ruleFile = task.options.ruleName
                ? `--rule=${Constants.rulesPath}/${task.options.ruleName}`
                : '';
            cmd =
                `${this.bin} ${attackModeCmd} ${hashTypeCmd} ` +
                `${sessionCmd} ${cpuOnly} ${ruleFile} ${workloadProfiles} ` +
                `${hashlistCmd} ${wordlistCmd}`;
        } else {
            const sessionCmd = `--session=${task.name}-${task.id}`;
            cmd += `--restore ${sessionCmd}`;
        }
        return cmd;
    }

    private listenStdoutAndSetStatus(): void {
        this.hashcatWorker &&
            this.hashcatWorker.on('message', hashcatStdout => {
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
