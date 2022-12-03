import { spawn, SpawnOptions, exec, ExecException } from 'child_process';
import { HashcatError } from '../hashcat/HashcatError';
import { parentPort } from 'node:worker_threads';

import { logger } from './Logger';

export class CommandUtils {
    public static async exec(
        cmd: string,
        cwd: string = process.cwd()
    ): Promise<string> {
        const maxBuffer = 256 * 1024 * 1024;
        const encoding = 'utf8';

        return new Promise((resolve, reject) => {
            let code: string | number;

            const proc = exec(
                cmd,
                {
                    maxBuffer,
                    cwd,
                    encoding,
                },
                (
                    error: ExecException | null,
                    stdout: string,
                    stderr: string
                ) => {
                    if (error) {
                        if (proc.killed) {
                            reject(
                                new Error(
                                    code + cmd + 'process killed; ' + stderr
                                )
                            );
                        } else {
                            reject(new Error(code + cmd + stderr));
                        }
                    } else {
                        resolve(stdout);
                    }
                }
            );

            proc.on('exit', (_code: number) => {
                code = _code;
            });
        });
    }

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
                throw new Error(`ERROR: ${data.toString()}`);
            });

        proc.stdout &&
            proc.stdout.on('data', (data: Buffer) => {
                parentPort?.postMessage(data.toString().replace('\n', ''));
            });

        proc.on('exit', () => {
            logger.info(
                `A request has been sent to stop the process: ${cmd[0]}`
            );
        });

        proc.on('close', (code: number) => {
            if (code !== 0 && code !== null) {
                throw new Error(`Command '${cmd}' failed with code ${code}`);
            }
        });
    }

    public static checkStderr(stderr: string): HashcatError {
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
            CommandUtils.spawn(cmd);
        });
    }
})();
