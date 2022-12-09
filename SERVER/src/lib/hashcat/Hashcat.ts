import path = require('node:path');
import { Worker } from 'node:worker_threads';

import { Constants } from '../Constants';
import { FileManager } from '../FileManager';
import { TExecEndpoint, TflagOption, TRestoreEndpoint } from '../types/TApi';
import { THashcatPartialStatus } from '../types/THashcat';
import { logger } from '../utils/Logger';
import { hashcatParams } from './hashcatParams';

type THashcatStatus = { isRunning: boolean } & THashcatPartialStatus;

export class Hashcat {
    public status!: THashcatStatus;
    private execEndpoint: TExecEndpoint | undefined;
    private restoreEndpoint: TRestoreEndpoint | undefined;
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

    public exec(execOption: TExecEndpoint): void {
        logger.debug('Starting Hashcat cracking');
        this.execEndpoint = execOption;
        this.hashcatProcess.postMessage(this.generateExecCmd());
        this.listenStdoutAndSetStatus();
    }

    public stop(): void {
        logger.debug('Stopping the hashcat process');
        this.hashcatProcess.postMessage('exit');
        this.status.isRunning = false;
    }

    public restore(restoreOption: TRestoreEndpoint): void {
        this.restoreEndpoint = restoreOption;
        logger.debug(`Restoring Hashcat session ${this.restoreEndpoint.arg}`);
        logger.info(this.generateRestoreCmd());
        this.hashcatProcess.postMessage(this.generateRestoreCmd());
        this.listenStdoutAndSetStatus();
    }

    private generateExecCmd(): string {
        let cmd = '';
        if (this.execEndpoint) {
            cmd = `${this.bin}  `;
            this.hashFileManager.createHashFile(
                this.execEndpoint.hashList.name,
                this.execEndpoint.hashList.hashs
            );
            this.execEndpoint.flags.map(param => {
                cmd += this.buildFlag(param);
            });
            this.defaultFlags.map(param => {
                cmd += this.buildFlag(param);
            });
            cmd += `${this.hashFileManager.filePath} ${this.execEndpoint.wordlist}`;
        }
        return cmd;
    }

    private generateRestoreCmd(): string {
        let cmd = '';
        if (this.restoreEndpoint) {
            cmd =
                `${this.bin} ${this.buildFlag(this.restoreEndpoint)} ` +
                `${this.buildFlag({ name: 'restore' })} `;
            this.defaultFlags.map(param => {
                cmd += this.buildFlag(param);
            });
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
