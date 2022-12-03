import path = require('node:path');
import { Worker } from 'node:worker_threads';

import { Constants } from '../Constants';
import { FileManager } from '../FileManager';
import { TExecEndpoint, TRestoreEndpoint } from '../types/TApi';
import { logger } from '../utils/Logger';
import { hashcatParams } from './hashcatParams';

interface IHashcat {
    exec(): void;
    stop(): void;
    restore(): void;
}

type THashcatPros = {
    exec?: TExecEndpoint;
    restore?: TRestoreEndpoint;
};

export class Hashcat implements IHashcat {
    private execEndpoint: TExecEndpoint | undefined;
    private restoreEndpoint: TRestoreEndpoint | undefined;
    private bin: string;
    private hashFileManager: FileManager;
    private hashcatProcess: Worker = new Worker(
        path.join(__dirname, '../utils/Processus.js')
    );

    constructor(props: THashcatPros) {
        this.bin = Constants.defaultBin;
        this.hashFileManager = new FileManager(Constants.hashlistsPath);
        this.execEndpoint = props?.exec;
    }

    public exec(): void {
        logger.debug('Starting Hashcat cracking');
        this.hashcatProcess.postMessage(this.generateExecCmd());
        this.hashcatProcess.on('message', hashcatStatus => {
            logger.debug('From Worker: ' + hashcatStatus);
        });
    }

    public stop(): void {
        logger.info('hashcat STOPPED');
        this.hashcatProcess.postMessage('exit');
    }

    public restore(): void {
        if (this.restoreEndpoint) {
            logger.debug(
                `Restoring Hashcat session ${this.restoreEndpoint.arg}`
            );
            this.hashcatProcess.postMessage(this.generateRestoreCmd());
        }
    }

    private generateExecCmd(): string {
        let cmd = `${this.bin} `;
        if (this.execEndpoint) {
            this.hashFileManager.createHashFile(
                this.execEndpoint.hashList.name,
                this.execEndpoint.hashList.hashs
            );
            this.execEndpoint.flags.map(param => {
                cmd += `--${hashcatParams[param.name]}=${param.arg} `;
            });
            cmd += `${this.hashFileManager.filePath} ${this.execEndpoint.wordlist}`;
        }
        return cmd;
    }

    private generateRestoreCmd(): string {
        let cmd = `${this.bin} `;
        if (this.restoreEndpoint) {
            cmd +=
                `--${hashcatParams[this.restoreEndpoint.name]}=${
                    this.restoreEndpoint.arg
                } ` + `--${hashcatParams['restore']}`;
        }
        return cmd;
    }
}
