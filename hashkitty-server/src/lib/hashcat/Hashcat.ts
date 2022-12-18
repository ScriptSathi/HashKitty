import path = require('node:path');
import { Worker } from 'node:worker_threads';

import { Constants } from '../Constants';
import { FileManager } from '../FileManager';
import { TflagOption, TTask } from '../types/TApi';
import { THashcatStatus } from '../types/THashcat';
import { logger } from '../utils/Logger';
import { hashcatParams } from './hashcatParams';

export class Hashcat {
    public status: THashcatStatus = { isRunning: false };
    private bin: string;
    private hashFileManager: FileManager;
    private hashcatProcess: Worker = new Worker(
        path.join(__dirname, '../utils/Processus.js')
    );
    private defaultFlags: TflagOption<string>[] = [
        {
            name: 'statusJson',
        },
        {
            name: 'quiet',
        },
    ];

    constructor() {
        this.bin = Constants.defaultBin;
        this.hashFileManager = new FileManager(Constants.hashlistsPath);
    }

    public exec(task: TTask): void {
        logger.debug('Starting Hashcat cracking');
        logger.debug(this.generateCmd(task));
        this.hashcatProcess.postMessage(this.generateCmd(task));
        this.listenStdoutAndSetStatus();
    }

    public stop(): void {
        logger.debug('Stopping the hashcat process');
        this.hashcatProcess.postMessage('exit');
        this.status.isRunning = false;
    }

    public restore(task: TTask): void {
        logger.debug(`Restoring Hashcat session ${task.name}-${task.id}`);
        logger.info(this.generateCmd(task, false));
        this.hashcatProcess.postMessage(this.generateCmd(task, false));
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

    private buildFlag(flag: TflagOption): string {
        return flag.arg
            ? `--${hashcatParams[flag.name]}=${flag.arg} `
            : `--${hashcatParams[flag.name]} `;
    }

    private listenStdoutAndSetStatus(): void {
        this.hashcatProcess.on('message', hashcatStdout => {
            if (hashcatStdout.status !== undefined) {
                this.status = { ...hashcatStdout, isRunning: true };
            } else {
                if (hashcatStdout.any !== '') {
                    if (hashcatStdout.any.match(/\n/g)) {
                        logger.debug(
                            '-------------------Hashcat warning-------------------\n' +
                                hashcatStdout.any +
                                '\n---------------------------------------------------------'
                        );
                    }
                    logger.debug('Message from stdout: ' + hashcatStdout.any);
                }
            }
        });
    }
}
