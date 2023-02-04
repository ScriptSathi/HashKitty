import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import { parentPort } from 'node:worker_threads';

import { HashcatError } from '../hashcat/HashcatError';
import { logger } from './Logger';
import { THashcatRunningStatus } from '../types/THashcat';

export type TProcessStdout = {
    exit: {
        message: string;
        code: number;
    };
    status: THashcatRunningStatus | {};
    anyOutput: string | string[];
};

export class Processus {
    private static checkStderr(stderr: string): HashcatError {
        if (stderr.match(/No hashes loaded/)) {
            return new HashcatError(
                HashcatError.CODES.INVALID_COMMAND,
                'No hashes loaded'
            );
        } else {
            return new HashcatError(
                HashcatError.CODES.UNKNOW_ERROR,
                'An unexpected error occurred: ' + stderr
            );
        }
    }

    private cmd!: string[];
    private proc!: ChildProcessWithoutNullStreams;

    public spawn(stringCommand: string): void {
        this.cmd = stringCommand.split(' ').filter(n => n);
        const args: string[] = this.cmd.splice(1);
        this.proc = spawn(this.cmd[0], args);
        this.proc.stdout.setEncoding('utf8');

        logger.debug(`Executed command: ${stringCommand}`);

        parentPort && parentPort.once('message', this.onParentProcessMessage);
        this.proc.stderr && this.proc.stderr.on('data', this.onStderr);
        this.proc.stdout && this.proc.stdout.on('data', this.onStdout);
        this.proc.on('exit', this.onExit);
    }

    private onParentProcessMessage = (message: string): void => {
        if (message === 'exit') {
            this.proc.kill();
        }
    };

    private onStderr = (data: Buffer): void => {
        logger.error(Processus.checkStderr(data.toString().trim()));
    };

    private onStdout = (data: Buffer): void => {
        const readableData = data.toString().trim();
        try {
            const status: THashcatRunningStatus = JSON.parse(readableData);
            parentPort?.postMessage(this.processResponses({ status }));
        } catch (e) {
            parentPort?.postMessage(
                this.processResponses({
                    anyOutput: readableData,
                })
            );
        }
    };

    private onExit = (code: number): void => {
        let exitMessage = '';
        if (code !== 0 && code !== null && code !== 1) {
            exitMessage = 'close';
            logger.error(
                new Error(`Command '${this.cmd}' failed with code ${code}`)
            );
        } else if (code === null) {
            exitMessage = 'close';
            logger.info(
                `A request has been sent to stop the process: ${this.cmd[0]}`
            );
        } else if (code === 0) {
            //TODO TRIGGER de fin de tache ? voir si le code passe ici
            exitMessage = 'ended';
            logger.info(`Process: ${this.cmd[0]} ended correctly`);
        } else if (code === 1) {
            exitMessage = 'exhausted';
        } else {
            exitMessage = 'error';
            logger.info(
                `Process: ${this.cmd[0]} ended with an unknown status code ${code} !`
            );
        }
        parentPort &&
            parentPort.postMessage(
                this.processResponses({
                    exit: {
                        message: exitMessage,
                        code,
                    },
                })
            );
    };

    private processResponses({
        exit,
        status,
        anyOutput,
    }: Partial<TProcessStdout>): TProcessStdout {
        return {
            exit: {
                message: exit?.message || '',
                code: exit?.code || -1,
            },
            status: status || {},
            anyOutput: anyOutput || '',
        };
    }
}

(() => {
    if (parentPort) {
        parentPort.once('message', cmd => {
            new Processus().spawn(cmd);
        });
    }
})();
