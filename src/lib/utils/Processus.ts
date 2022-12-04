import { spawn } from 'child_process';
import { parentPort } from 'node:worker_threads';

import { HashcatError } from '../hashcat/HashcatError';
import { logger } from './Logger';
import { THashcatStatus } from '../types/THashcat';

export type TProcessStdout = {
    status: THashcatStatus | undefined;
    any: string | undefined;
};

export class Processus {
    public static spawn(stringCommand: string): void {
        const cmd: string[] = stringCommand.split(' ').filter(n => n);

        const args: string[] = cmd.splice(1);
        const proc = spawn(cmd[0], args);
        logger.debug(`Executed command: ${stringCommand}`);
        parentPort &&
            parentPort.once('message', message => {
                if (message === 'exit') {
                    proc.kill();
                }
            });

        proc.stderr &&
            proc.stderr.on('data', (data: Buffer) => {
                logger.error(`ERROR: ${data.toString()}`);
            });

        proc.stdout &&
            proc.stdout.on('data', (data: Buffer) => {
                try {
                    const sessionStatus: THashcatStatus = JSON.parse(
                        data.toString().trim()
                    );
                    parentPort?.postMessage({ status: sessionStatus });
                } catch (e) {
                    parentPort?.postMessage({
                        any: data.toString().trim(),
                    });
                }
                setTimeout(() => {
                    proc.stdin.write('\n');
                }, 1000);
            });

        proc.on('close', (code: number) => {
            if (code !== 0 && code !== null && code !== 1) {
                logger.error(
                    new Error(`Command '${cmd}' failed with code ${code}`)
                );
            } else if (code === null) {
                logger.info(
                    `A request has been sent to stop the process: ${cmd[0]}`
                );
            } else if (code === 1) {
                logger.info(`Process: ${cmd[0]} ended correctly`);
            }
        });
    }

    private static checkStderr(stderr: string): HashcatError {
        if (stderr.match(/No hashes loaded/)) {
            return new HashcatError(
                HashcatError.CODES.INVALID_COMMAND,
                'No hashes loaded'
            );
        } else {
            return new HashcatError(
                HashcatError.CODES.UNKNOW_ERROR,
                'An unexpected error occurred\n' + stderr
            );
        }
    }
}

(() => {
    if (parentPort) {
        parentPort.once('message', cmd => {
            Processus.spawn(cmd);
        });
    }
})();
