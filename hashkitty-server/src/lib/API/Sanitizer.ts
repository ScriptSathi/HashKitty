import {
    ApiOptionsFormData,
    ApiTaskCreate,
    ApiTaskUpdate,
} from '../types/TDAOs';
import { Options } from '../ORM/entity/Options';
import { Dao } from './DAOs/Dao';
import { TemplateTask } from '../ORM/entity/TemplateTask';
import { Task } from '../ORM/entity/Task';
import { logger } from '../utils/Logger';
import { FsUtils } from '../utils/FsUtils';
import { Constants } from '../Constants';

export class Sanitizer {
    public hasSucceded: boolean;
    public errorMessage: string;
    private dao: Dao;
    private options: Options;
    private task: Task;
    private templateTask: TemplateTask;

    constructor(dao: Dao) {
        this.dao = dao;
        this.options = new Options();
        this.task = new Task();
        this.templateTask = new TemplateTask();
        this.hasSucceded = true;
        this.errorMessage = '';
    }

    public async analyseTask(
        form: ApiTaskCreate | ApiTaskUpdate
    ): Promise<void> {
        console.dir(form);
        if ('id' in form) {
            if (await this.dao.taskExistById(form.id)) {
                this.task = await this.dao.task.getById(form.id);
            } else {
                this.responsesForFailId('task', form.id);
            }
        }
        this.task.name = this.shortenStringByLength(
            30,
            this.removeSpecialCharInString(form.name)
        );
        this.task.description = this.shortenStringByLength(
            30,
            form.description
        );
        this.prepareOptions(form.options);
        this.task.options = this.options;
        await this.checkHashlit(form.hashlistId);
    }

    public getTask(): Task {
        return this.task;
    }

    private prepareOptions(options: ApiOptionsFormData): void {
        this.checkWordlist(options.wordlistName);
        this.checkWorkloadProfile(options.workloadProfileId);
        this.checkAttackMode(options.attackModeId);
        this.breakpointGPUTemperature(options.breakpointGPUTemperature);
        this.checkKernelOptions(options.kernelOpti);
        this.checkCPUOnly(options.CPUOnly);
        this.checkRules(options.ruleName || '');
        this.checkPotfiles(options.potfileName || '');
    }

    private removeSpecialCharInString(input: string): string {
        return input.replace(/[^\w._-]/gi, '');
    }

    public shortenStringByLength(length: number, str: string): string {
        return str.length > length ? `${str.substring(0, length - 3)}...` : str;
    }

    private checkWordlist(name: string): void {
        this.dao
            .findWordlistByName(name)
            .then(wordlist => {
                console.log(wordlist);
                console.log(name);
                if (wordlist !== null) {
                    this.options.wordlistId = wordlist.id;
                } else {
                    this.incorrectDataSubmitted('wordlist');
                }
            })
            .catch(error => {
                this.unexpectedError('wordlist');
                logger.debug(error.message);
            });
    }

    private async checkHashlit(id: number): Promise<void> {
        try {
            if (await this.dao.findHashlistExistById(id)) {
                const hashlist = await this.dao.hashlist.getById(id);
                if (hashlist !== null) {
                    this.task.hashlistId = hashlist.id;
                } else {
                    this.incorrectDataSubmitted('wordlist');
                }
            } else {
                throw 'Wrong data provided for hashlistId';
            }
        } catch (error) {
            this.unexpectedError('workload profile');
            logger.debug(error);
        }
    }

    private checkWorkloadProfile(profileId: number): void {
        this.dao
            .findWorkloadProfileByName(profileId)
            .then(wordlist => {
                if (wordlist !== null) {
                    this.options.wordlistId = wordlist.id;
                } else {
                    this.incorrectDataSubmitted('workload profile');
                }
            })
            .catch(error => {
                this.unexpectedError('workload profile');
                logger.debug(error.message);
            });
    }

    private breakpointGPUTemperature(temperature: number): void {
        try {
            if (this.isExpectedType(temperature, 'number')) {
                if (temperature < 0 || temperature > 100) {
                    this.options.breakpointGPUTemperature = 90;
                } else if (0 < temperature && temperature < 100) {
                    this.options.breakpointGPUTemperature = temperature;
                } else {
                    this.incorrectDataSubmitted('breakpointGPUTemperature');
                }
            } else {
                throw 'Wrong data provided for breakpointGPUTemperature';
            }
        } catch (error) {
            this.unexpectedError('breakpoint temperature');
            logger.debug(error);
        }
    }

    private checkAttackMode(id: number): void {
        this.dao
            .findAttackModeById(id)
            .then(attackMode => {
                if (attackMode !== null) {
                    this.options.attackModeId = attackMode.id;
                } else {
                    this.responsesForFailId('attack mode', id);
                }
            })
            .catch(error => {
                this.unexpectedError('attack mode');
                logger.debug(error.message);
            });
    }

    private checkKernelOptions(value: boolean): void {
        try {
            if (this.isExpectedType(value, 'boolean')) {
                this.options.kernelOpti = value;
            } else {
                throw 'Wrong data provided for kernelOpti';
            }
        } catch (error) {
            this.unexpectedError('kernelOpti');
            logger.debug(error);
        }
    }

    private checkCPUOnly(value: boolean): void {
        try {
            if (this.isExpectedType(value, 'boolean')) {
                this.options.CPUOnly = value;
            } else {
                throw 'Wrong data provided for CPUOnly';
            }
        } catch (error) {
            this.unexpectedError('CPUOnly');
            logger.debug(error);
        }
    }

    private checkRules(name: string): void {
        try {
            if (name.length > 0) {
                const files = FsUtils.listFileInDir(Constants.rulesPath);
                if (
                    files.find(file => {
                        return file === name;
                    })
                ) {
                    this.options.ruleName = name;
                } else {
                    throw 'Wrong data provided for ruleName';
                }
            }
        } catch (error) {
            this.unexpectedError('ruleName');
            logger.debug(error);
        }
    }

    private checkPotfiles(name: string): void {
        try {
            if (name.length > 0) {
                const files = FsUtils.listFileInDir(Constants.potfilesPath);
                if (
                    files.find(file => {
                        return file === name;
                    })
                ) {
                    this.options.potfileName = name;
                } else {
                    throw 'Wrong data provided for potfileName';
                }
            }
        } catch (error) {
            this.unexpectedError('potfileName');
            logger.debug(error);
        }
    }

    private isExpectedType(
        value: string | number | boolean,
        expectedType: string
    ): boolean {
        return typeof value === expectedType;
    }

    private incorrectDataSubmitted(badKey: string): void {
        this.errorMessage = `The format of data ${badKey} is not correct`;
        this.hasSucceded = false;
    }

    private responsesForFailId(failName: string, id: number): void {
        this.errorMessage = `The requested ${failName} with id ${id} does not exist`;
        this.hasSucceded = false;
    }

    private responsesForDoesNotExistId(failName: string): void {
        this.errorMessage = `The parameter ${failName} does not exist, please set it`;
        this.hasSucceded = false;
    }

    private unexpectedError(failParam: string): void {
        this.errorMessage = `An unexpected error occurred with param ${failParam}`;
        this.hasSucceded = false;
    }
}
