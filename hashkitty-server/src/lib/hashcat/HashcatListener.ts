import { Worker } from 'node:worker_threads';
import { logger } from '../utils/Logger';
import { THashcatRunningStatus, THashcatStatus } from '../types/THashcat';
import { TTask } from '../types/TApi';
import { TProcessStdout } from '../utils/Processus';

type THashcatListenerProperties = {
    worker: Worker;
    task: TTask;
    handleHashlistIsCracked: () => void;
    handleTaskHasFinnished: (task: TTask) => void;
};

export class HashcatListener {
    public state: THashcatStatus;
    private task: TTask;
    private hashcatWorker: Worker;
    private handleHashlistIsCracked: () => void;
    private handleTaskHasFinnished: (task: TTask) => void;

    constructor({
        worker,
        task,
        handleHashlistIsCracked,
        handleTaskHasFinnished,
    }: THashcatListenerProperties) {
        this.hashcatWorker = worker;
        this.task = task;
        this.handleHashlistIsCracked = handleHashlistIsCracked;
        this.handleTaskHasFinnished = handleTaskHasFinnished;
        this.state = {
            processState: 'pending',
            runningStatus: <THashcatRunningStatus>{},
        };
    }

    public listen = (processStdout: TProcessStdout) => {
        if (
            Object.keys(this.state.runningStatus).length > 0 ||
            this.isProcessSendStatus(processStdout)
        ) {
            this.state.processState = 'running';
        }
        if (this.isProcessExited(processStdout)) {
            this.state.processState = 'stopped';
            this.onExitProcess(processStdout);
        } else if (this.isProcessSendStatus(processStdout)) {
            this.state.runningStatus = <THashcatRunningStatus>(
                processStdout.status
            );
        } else {
            if (this.isProcessSendArrayInfo(processStdout)) {
                logger.debug(
                    '\n-------------------Hashcat warning-------------------\n' +
                        processStdout.anyOutput +
                        '\n---------------------------------------------------------'
                );
            } else {
                logger.debug('Message from stdout: ' + processStdout.anyOutput);
            }
        }
    };

    private onExitProcess(processStdout: TProcessStdout): void {
        switch (processStdout.exit.message) {
            case 'exit':
                this.handleTaskHasFinnished(this.task);
                this.handleHashlistIsCracked();
                break;
            case 'exhausted':
                this.onExhaustedExit();
                break;
            case 'error':
                logger.debug('Status: Error');
                break;
            default:
                logger.debug(
                    `Unexpected process exit: ${processStdout.exit.message}`
                );
        }
        this.stopListener();
    }

    private onExhaustedExit(): void {
        const [nbOfCrackedPasswords, amountOfPasswords] = this.state
            .runningStatus.recovered_hashes || [0, 0];
        if (nbOfCrackedPasswords > 0) {
            this.task.hashlistId.numberOfCrackedPasswords =
                nbOfCrackedPasswords;
            this.handleTaskHasFinnished(this.task);
            this.handleHashlistIsCracked();
            logger.debug('Status: Exhausted');
            logger.info(
                'Process: Hashcat ended and cracked' +
                    `${nbOfCrackedPasswords}/${amountOfPasswords} passwords`
            );
        } else {
            logger.debug('Status: Exhausted');
            logger.info(
                'Process: Hashcat ended but no passwords were cracked !'
            );
        }
    }

    private isProcessExited(processStdout: TProcessStdout): boolean {
        try {
            return (
                processStdout.exit.message !== '' &&
                processStdout.exit.code >= 0
            );
        } catch (e) {
            return false;
        }
    }

    private isProcessSendStatus(processStdout: TProcessStdout): boolean {
        try {
            return Object.keys(processStdout.status).length > 0;
        } catch (e) {
            return false;
        }
    }

    private isProcessSendArrayInfo(processStdout: TProcessStdout): boolean {
        try {
            return (processStdout.anyOutput as string).match(/\n/g) !== null;
        } catch (e) {
            return false;
        }
    }

    private stopListener(): void {
        this.hashcatWorker.terminate();
    }
}
