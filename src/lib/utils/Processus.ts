import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import { parentPort } from 'node:worker_threads';

import { HashcatError } from '../hashcat/HashcatError';
import { logger } from './Logger';
import { THashcatPartialStatus } from '../types/THashcat';

export type TProcessStdout = {
    status: THashcatPartialStatus | undefined;
    any: string | undefined;
};

export class Processus {
    private cmd!: string[];
    private proc!: ChildProcessWithoutNullStreams;

    public spawn(stringCommand: string): void {
        this.cmd = stringCommand.split(' ').filter(n => n);
        const args: string[] = this.cmd.splice(1);
        this.proc = spawn(this.cmd[0], args);
        logger.debug(`Executed command: ${stringCommand}`);

        parentPort && parentPort.once('message', this.onParentProcessMessage);

        this.proc.stderr && this.proc.stderr.on('data', this.onStderr);
        this.proc.stdout && this.proc.stdout.on('data', this.onStdout);
        this.proc.on('close', this.onClose);
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
        try {
            const sessionStatus: THashcatPartialStatus = JSON.parse(
                data.toString().trim()
            );
            parentPort?.postMessage({ status: sessionStatus });
        } catch (e) {
            parentPort?.postMessage({
                any: data.toString().trim(),
            });
        }
        setTimeout(() => {
            this.proc.stdin.write('\n');
        }, 1000);
    };

    private onClose = (code: number): void => {
        if (code !== 0 && code !== null && code !== 1) {
            logger.error(
                new Error(`Command '${this.cmd}' failed with code ${code}`)
            );
        } else if (code === null) {
            logger.info(
                `A request has been sent to stop the process: ${this.cmd[0]}`
            );
        } else if (code === 1) {
            logger.info(`Process: ${this.cmd[0]} ended correctly`);
        }
    };

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
}

(() => {
    if (parentPort) {
        parentPort.once('message', cmd => {
            new Processus().spawn(cmd);
        });
    }
})();
