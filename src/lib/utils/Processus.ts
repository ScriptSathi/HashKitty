import { spawn } from 'child_process';
import { parentPort } from 'node:worker_threads';

import { HashcatError } from '../hashcat/HashcatError';
import { logger } from './Logger';

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
                    logger.info(
                        `A request has been sent to stop the process: ${cmd[0]}`
                    );
                }
            });

        setTimeout(() => {
            proc.stdin.write('s');
        }, 10000);

        proc.stdin &&
            proc.stdin.on('data', (data: Buffer) => {
                logger.info('\n\n\n')
                logger.info('\n\n\n')
                logger.info('\n\n\n')
                logger.info(data.toString())
                logger.info('\n\n\n')
                setTimeout(() => {
                    proc.stdin.write('s');
                }, 1000);
            });

        proc.stderr &&
            proc.stderr.on('data', (data: Buffer) => {
                throw new Error(`ERROR: ${data.toString()}`);
            });

        proc.stdout &&
            proc.stdout.on('data', (data: Buffer) => {
                parentPort?.postMessage(data.toString().replace('\n', ''));
            });

        proc.on('close', (code: number) => {
            if (code !== 0 && code !== null) {
                throw new Error(`Command '${cmd}' failed with code ${code}`);
            } else if (code === null) {
                logger.info(
                    `A request has been sent to stop the process: ${cmd[0]}`
                );
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
