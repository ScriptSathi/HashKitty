import { ApiOptionsFormData } from '../types/TDAOs';
import { TaskUpdate, TemplateTaskUpdate, UploadFile } from '../types/TRoutes';
import { Options } from '../ORM/entity/Options';
import { Dao } from './DAOs/Dao';
import { TemplateTask } from '../ORM/entity/TemplateTask';
import { Task } from '../ORM/entity/Task';
import { logger } from '../utils/Logger';
import { FsUtils } from '../utils/FsUtils';
import { Constants } from '../Constants';
import { Hashlist } from '../ORM/entity/Hashlist';
import { HashType } from '../ORM/entity/HashType';
import { UploadFileType } from '../types/TApi';

export class Sanitizer {
    public hasSucceded: boolean;
    public isAnUpdate: boolean;
    public errorMessage: string;
    private dao: Dao;
    private list: UploadFile;
    private options: Options;
    private task: Task;
    private templateTask: TemplateTask;
    private hashlist: Hashlist;

    constructor(dao: Dao) {
        this.dao = dao;
        this.list = { fileName: '' };
        this.options = new Options();
        this.task = new Task();
        this.templateTask = new TemplateTask();
        this.hashlist = new Hashlist();
        this.hasSucceded = true;
        this.isAnUpdate = false;
        this.errorMessage = '';
    }

    public async analyseTask(form: TaskUpdate): Promise<void> {
        if (form.id) {
            if (await this.dao.taskExistById(form.id)) {
                this.task = await this.dao.task.getById(form.id);
                this.options = this.task.options;
                this.isAnUpdate = true;
            } else {
                this.responsesForFailId('task', form.id);
            }
        }
        this.task.name = this.sanitizeText(form.name, 'name', 50);
        this.task.description = this.sanitizeText(
            form.description,
            'description',
            255
        );
        await this.prepareOptions(form.options);
        await this.checkHashlist(form.hashlistId);
    }

    public async analyseTemplateTask(form: TemplateTaskUpdate): Promise<void> {
        if (form.id) {
            if (await this.dao.templateTaskExistById(form.id)) {
                this.templateTask = await this.dao.templateTask.getById(
                    form.id
                );
                this.options = this.templateTask.options;
                this.isAnUpdate = true;
            } else {
                this.responsesForFailId('template task', form.id);
            }
        }
        this.templateTask.name = this.sanitizeText(form.name, 'name', 50);
        this.templateTask.description = this.sanitizeText(
            form.description,
            'description',
            255
        );
        await this.prepareOptions(form.options);
    }

    public async analyseList(
        form: UploadFile & { type: UploadFileType; hashTypeId?: number }
    ): Promise<void> {
        const name = this.sanitizeText(form.fileName, 'fileName');
        if (form.hashTypeId && form.type === 'hashlist') {
            this.hashlist.name = name;
            await this.checkHashType(form.hashTypeId);
        } else {
            this.list.fileName = name;
        }
    }

    public getTask(): Task {
        return this.task;
    }

    public getHashlist(): Hashlist {
        return this.hashlist;
    }

    public getTemplateTask(): TemplateTask {
        return this.templateTask;
    }

    public getList(): UploadFile {
        return this.list;
    }

    public removeSpecialCharInString(input: string): string {
        return input.replace(/[^\w._-]/gi, '');
    }

    private async prepareOptions(options: ApiOptionsFormData): Promise<void> {
        await this.checkWordlist(options.wordlistName);
        await this.checkWorkloadProfile(options.workloadProfileId);
        await this.checkAttackMode(options.attackModeId);
        this.breakpointGPUTemperature(options.breakpointGPUTemperature);
        this.checkKernelOptions(options.kernelOpti);
        this.checkCPUOnly(options.CPUOnly);
        this.checkRules(options.ruleName || '');
        this.checkPotfiles(options.potfileName || '');
        this.task.options = this.options;
        this.templateTask.options = this.options;
    }

    public shortenStringByLength(length: number, str: string): string {
        return str.length > length ? `${str.substring(0, length - 3)}...` : str;
    }

    private async checkWordlist(name: string): Promise<void> {
        try {
            name = name.startsWith('*') ? '*' : name;
            const wordlist = await this.dao.findWordlistByName(name);
            if (wordlist !== null) {
                this.options.wordlistId = wordlist.id;
            } else {
                this.incorrectDataSubmitted('wordlist');
            }
        } catch (error) {
            this.unexpectedError('wordlist');
            logger.debug(error);
        }
    }

    private async checkHashlist(id: number): Promise<void> {
        try {
            if (await this.dao.findHashlistExistById(id)) {
                const hashlist = await this.dao.hashlist.getById(id);
                if (hashlist !== null) {
                    this.task.hashlistId = hashlist.id;
                } else {
                    this.incorrectDataSubmitted('hashlist');
                }
            } else {
                throw 'Wrong data provided for hashlistId';
            }
        } catch (error) {
            this.unexpectedError('hash list');
            logger.debug(error);
        }
    }

    private async checkHashType(id: number): Promise<void> {
        try {
            if (await this.dao.findHashTypeExistById(id)) {
                const hashtype = await this.dao.db
                    .getRepository(HashType)
                    .findOne({ where: { id } });
                if (hashtype !== null) {
                    this.hashlist.hashTypeId = hashtype.id;
                } else {
                    this.incorrectDataSubmitted('hashtype');
                }
            } else {
                throw 'Wrong data provided for hashTypeId';
            }
        } catch (error) {
            this.unexpectedError('hashtype');
            logger.debug(error);
        }
    }

    private async checkWorkloadProfile(profileId: number): Promise<void> {
        try {
            const workloadProfile = await this.dao.findWorkloadProfileByName(
                profileId
            );
            if (workloadProfile !== null) {
                this.options.workloadProfileId = workloadProfile.id;
            } else {
                this.incorrectDataSubmitted('workload profile');
            }
        } catch (error) {
            this.unexpectedError('workload profile');
            logger.debug(error);
        }
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

    private async checkAttackMode(id: number): Promise<void> {
        try {
            const attackMode = await this.dao.findAttackModeById(id);
            if (attackMode !== null) {
                this.options.attackModeId = attackMode.id;
            } else {
                this.responsesForFailId('attack mode', id);
            }
        } catch (error) {
            this.unexpectedError('attack mode');
            logger.debug(error);
        }
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

    private sanitizeText(
        text: string,
        param: string,
        expectedLength = -1
    ): string {
        try {
            if (text.length > 0) {
                return expectedLength < 0
                    ? this.removeSpecialCharInString(text)
                    : this.shortenStringByLength(
                          expectedLength,
                          this.removeSpecialCharInString(text)
                      );
            } else {
                throw new Error('Empty string');
            }
        } catch (e) {
            logger.error(e);
            this.emptyString(param);
            return 'unknown';
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

    private emptyString(failParam: string): void {
        this.errorMessage = `The provided string for ${failParam} is empty`;
        this.hasSucceded = false;
    }
}
