import path = require('node:path');

import { Constants } from '../Constants';
import { TTask } from '../types/TApi';
import { CmdData, PartialCmdData } from '../types/THashcat';
import { hashcatParam } from './hashcatParams';

export class HashcatGenerator {
    public outputFilePath: string;
    private task: TTask;
    private taskName: string;
    private restorePath: string;
    private wordlist: string;
    private hashlist: string;

    constructor(task: TTask) {
        this.task = task;

        this.taskName = `${task.name}-${task.id}`;
        this.restorePath = path.join(Constants.restorePath, this.taskName);
        this.wordlist = path.join(
            Constants.wordlistPath,
            this.task.options.wordlistId.name
        );
        this.hashlist = path.join(
            Constants.hashlistsPath,
            this.task.hashlistId.name
        );
        this.outputFilePath = path.join(
            Constants.outputFilePath,
            `${this.task.hashlistId.name}-${this.task.hashlistId.id}`
        );
    }

    public generateStartCmd(): string {
        return (
            `${Constants.defaultBin} ` +
            this.generateCmdFromFlags(this.prepareStartFlags()) +
            `${this.hashlist} ${this.wordlist}`
        );
    }

    public generateRestoreCmd(): string {
        return (
            `${Constants.defaultBin} ` +
            this.generateCmdFromFlags(this.prepareRestoreFlags()) +
            `${this.hashlist} ${this.wordlist}`
        );
    }

    private get mandatoryStartFlags(): PartialCmdData[] {
        return [
            {
                key: 'outputFile',
                value: this.outputFilePath,
            },
            {
                key: 'attackMode',
                value: this.task.options.attackModeId.mode,
            },
            {
                key: 'hashType',
                value: this.task.hashlistId.hashTypeId.typeNumber,
            },
            {
                key: 'potfilePath',
                value: path.join(
                    Constants.potfilesPath,
                    `${this.task.hashlistId.hashTypeId.typeNumber}`
                ),
            },
            ...this.defaultFlags,
        ];
    }

    private get defaultFlags(): PartialCmdData[] {
        return [
            {
                key: 'statusTimer',
                value: 1,
            },
            {
                key: 'status',
            },
            {
                key: 'statusJson',
            },
            {
                key: 'quiet',
            },
            {
                key: 'restoreFilePath',
                value: this.restorePath,
            },
            {
                key: 'session',
                value: this.taskName,
            },
        ];
    }

    private prepareStartFlags(): CmdData[] {
        const flags = this.mandatoryStartFlags;
        if (this.task.options.CPUOnly) {
            flags.push({
                key: 'cpuOnly',
            });
        }
        if (this.task.options.ruleName) {
            flags.push({
                key: 'rulesFile',
            });
        }
        if (this.task.options.workloadProfileId) {
            flags.push({
                key: 'workloadProfile',
                value: this.task.options.workloadProfileId.profileId,
            });
        }
        return this.buildFlags(flags);
    }

    private prepareRestoreFlags(): CmdData[] {
        const flags = this.defaultFlags;
        return this.buildFlags(flags);
    }

    private generateCmdFromFlags(flags: CmdData[]): string {
        return flags.reduce((acc: string, cmdData) => {
            let cmd = `--${cmdData.flagData.flag}`;
            if (cmdData.flagData.needAParam) {
                if (
                    cmdData.flagData.defaultValue &&
                    cmdData.value === undefined
                ) {
                    cmd += `=${cmdData.flagData.defaultValue}`;
                } else if (cmdData.value !== undefined) {
                    cmd += `=${cmdData.value}`;
                } else {
                    throw new Error(
                        `Parameter needed for ${cmdData.flagData.flag}`
                    );
                }
            }
            cmd += ' ';
            return acc + cmd;
        }, '');
    }

    private buildFlags(flags: PartialCmdData[]): CmdData[] {
        return flags.reduce(
            (acc: CmdData[], elem) => [
                ...acc,
                {
                    ...elem,
                    flagData: hashcatParam[elem.key],
                },
            ],
            []
        );
    }
}
