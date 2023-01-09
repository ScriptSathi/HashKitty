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
        try {
            const status: THashcatPartialStatus = JSON.parse(
                data.toString().trim()
            );
            parentPort?.postMessage({ status });
        } catch (e) {
            parentPort?.postMessage({
                any: data.toString().trim(),
            });
        }
    };

    private onExit = (code: number): void => {
        if (code !== 0 && code !== null && code !== 1) {
            parentPort && parentPort.postMessage('close');
            logger.error(
                new Error(`Command '${this.cmd}' failed with code ${code}`)
            );
        } else if (code === null) {
            parentPort && parentPort.postMessage('close');
            logger.info(
                `A request has been sent to stop the process: ${this.cmd[0]}`
            );
        } else if (code === 0) {
            //TODO TRIGGER de fin de tache ? voir si le code passe ici
            parentPort && parentPort.postMessage('ended');
            logger.info(`Process: ${this.cmd[0]} ended correctly`);
        } else if (code === 1) {
            parentPort && parentPort.postMessage('exhausted');
        } else {
            parentPort && parentPort.postMessage('error');
            logger.info(
                `Process: ${this.cmd[0]} ended with an unknown status code ${code} !`
            );
        }
    };
}

(() => {
    if (parentPort) {
        parentPort.once('message', cmd => {
            new Processus().spawn(cmd);
        });
    }
})();
