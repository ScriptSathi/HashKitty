import { DataSource } from 'typeorm';

import { AttackMode } from '../../ORM/entity/AttackMode';
import { Hashlist } from '../../ORM/entity/Hashlist';
import { HashType } from '../../ORM/entity/HashType';
import { Options } from '../../ORM/entity/Options';
import { Task } from '../../ORM/entity/Task';
import { TemplateTask } from '../../ORM/entity/TemplateTask';
import { Wordlist } from '../../ORM/entity/Wordlist';
import { WorkloadProfile } from '../../ORM/entity/WorkloadProfile';
import {
    TDaoTaskCreate,
    TDaoTaskUpdate,
    TDaoTemplateTaskCreate,
    TDaoTemplateTaskUpdate,
    TsanitizeCheckById,
} from '../../types/TDAOs';
import { DaoTasks } from './DaoTasks';
import { DaoTemplateTasks } from './DaoTemplateTasks';

export class Dao {
    public db: DataSource;
    public task: DaoTasks;
    public templateTask: DaoTemplateTasks;

    public static get UnexpectedError(): string {
        return 'An unexpected error occurred';
    }

    public static get NoIdProvided(): string {
        return 'You need to provide an id';
    }

    constructor(db: DataSource) {
        this.db = db;
        this.task = new DaoTasks(db, this);
        this.templateTask = new DaoTemplateTasks(db, this);
    }

    public async taskExistById(id: number): Promise<boolean> {
        return await this.db.getRepository(Task).exist({
            where: {
                id: id,
            },
        });
    }

    public async templateTaskExistById(id: number): Promise<boolean> {
        return await this.db.getRepository(TemplateTask).exist({
            where: {
                id: id,
            },
        });
    }

    public async sanityCheckTask(
        reqTask: TDaoTaskCreate | TDaoTaskUpdate,
        job = 'update'
    ) {
        let sanityCheck = {
            hasSucceded: false,
            message: '',
        };
        if (job === 'update' && !(reqTask as TDaoTaskUpdate).id) {
            return {
                hasSucceded: false,
                message: Dao.NoIdProvided,
            };
        }
        for (const key in reqTask) {
            if (job === 'update ' && key === 'id') {
                sanityCheck = await this.sanityTaskExists(
                    (reqTask as TDaoTaskUpdate).id
                );
            } else if (
                key === 'hashTypeId' ||
                key === 'hashlistId' ||
                key === 'templateTaskId'
            ) {
                sanityCheck = await this.sanitizeById(key, reqTask[key]);
            } else if (key === 'name' || key === 'description') {
                sanityCheck = this.isExpectedType(
                    { expectedType: 'string', obj: reqTask },
                    'name',
                    'description'
                );
            } else if (reqTask.options && key === 'options') {
                const { hasSucceded, message } = await this.sanitizeOptions(
                    reqTask.options
                );
                sanityCheck.hasSucceded = hasSucceded;
                sanityCheck.message = message;
            }
            if (!sanityCheck.hasSucceded) {
                break;
            }
        }
        return sanityCheck;
    }

    public async sanityCheckTemplateTask(
        reqTask: TDaoTemplateTaskCreate | TDaoTemplateTaskUpdate,
        job = 'update'
    ) {
        let sanityCheck = {
            hasSucceded: false,
            message: '',
        };
        if (job === 'update' && !(reqTask as TDaoTemplateTaskUpdate).id) {
            return {
                hasSucceded: false,
                message: Dao.NoIdProvided,
            };
        }
        for (const key in reqTask) {
            if (job === 'update ' && key === 'id') {
                sanityCheck = await this.sanityTaskExists(
                    (reqTask as TDaoTemplateTaskUpdate).id
                );
            } else if (key === 'name' || key === 'description') {
                sanityCheck = this.isExpectedType(
                    { expectedType: 'string', obj: reqTask },
                    'name',
                    'description'
                );
            } else if (reqTask.options && key === 'options') {
                const { hasSucceded, message } = await this.sanitizeOptions(
                    reqTask.options
                );
                sanityCheck.hasSucceded = hasSucceded;
                sanityCheck.message = message;
            }
            if (!sanityCheck.hasSucceded) {
                break;
            }
        }
        return sanityCheck;
    }

    public async sanityTaskExists(id: number): Promise<TsanitizeCheckById> {
        const sanityCheck = {
            hasSucceded: false,
            message: '',
        };
        if (await this.taskExistById(id)) sanityCheck.hasSucceded = true;
        else {
            sanityCheck.message = this.responsesForFailId('task', id);
        }
        return sanityCheck;
    }

    public async sanityTemplateTaskExists(
        id: number
    ): Promise<TsanitizeCheckById> {
        const sanityCheck = {
            hasSucceded: false,
            message: '',
        };
        if (await this.templateTaskExistById(id))
            sanityCheck.hasSucceded = true;
        else {
            sanityCheck.message = this.responsesForFailId('template task', id);
        }
        return sanityCheck;
    }

    public sanitizeLength(length: number, str: string): string {
        return str.length > length ? `${str.substring(0, length - 3)}...` : str;
    }

    public sanitizeTemperature(temperature: number): number {
        return temperature > 100 ? 90 : temperature;
    }

    public sanitizeOptionsData(
        EntityOption: Options,
        optionsData: Options
    ): Options {
        EntityOption.CPUOnly = optionsData.CPUOnly;
        EntityOption.attackModeId = optionsData.attackModeId;
        EntityOption.breakpointGPUTemperature = this.sanitizeTemperature(
            optionsData.breakpointGPUTemperature
        );
        EntityOption.wordlistId = optionsData.wordlistId;
        EntityOption.workloadProfileId = optionsData.workloadProfileId;
        EntityOption.kernelOpti = optionsData.kernelOpti;
        EntityOption.ruleName = this.sanitizeLength(
            100,
            optionsData.ruleName || ''
        );
        EntityOption.potfileName = this.sanitizeLength(
            100,
            optionsData.potfileName || ''
        );
        EntityOption.maskQuery = this.sanitizeLength(
            100,
            optionsData.maskQuery || ''
        );
        EntityOption.maskFilename = this.sanitizeLength(
            100,
            optionsData.maskFilename || ''
        );
        return EntityOption;
    }

    public async sanitizeOptions(
        options: Options
    ): Promise<TsanitizeCheckById> {
        let sanitizeCheck = {
            hasSucceded: false,
            message: '',
        };
        for (const key in options) {
            if (options[key as keyof typeof options] !== null) {
                if (
                    key === 'attackModeId' ||
                    key === 'wordlistId' ||
                    key === 'workloadProfileId'
                ) {
                    sanitizeCheck = await this.sanitizeById(key, options[key]);
                } else if (key === 'kernelOpti' || key === 'CPUOnly') {
                    sanitizeCheck = this.isExpectedType(
                        { expectedType: 'boolean', obj: options },
                        'kernelOpti',
                        'CPUOnly'
                    );
                } else if (
                    key === 'ruleName' ||
                    key === 'maskQuery' ||
                    key === 'maskFilename'
                ) {
                    sanitizeCheck = this.isExpectedType(
                        { expectedType: 'string', obj: options },
                        'ruleName',
                        'potfileName',
                        'maskQuery',
                        'maskFilename'
                    );
                } else if (key === 'breakpointGPUTemperature') {
                    sanitizeCheck = this.isExpectedType(
                        { expectedType: 'number', obj: options },
                        'breakpointGPUTemperature'
                    );
                }
                if (!sanitizeCheck.hasSucceded) {
                    break;
                }
            }
        }

        return sanitizeCheck;
    }

    private isExpectedType(
        { expectedType, obj }: { expectedType: string; obj: Object },
        ...keys: string[]
    ): TsanitizeCheckById {
        const sanitizeCheckById = {
            hasSucceded: false,
            message: '',
        };
        for (const key of keys) {
            const value = obj[key as keyof typeof obj];
            if (typeof value === expectedType) {
                sanitizeCheckById.hasSucceded = true;
            } else {
                sanitizeCheckById.message = this.incorrectDataSubmitted(key);
            }
            if (!sanitizeCheckById.hasSucceded) {
                break;
            }
        }
        return sanitizeCheckById;
    }

    private incorrectDataSubmitted(badKey: string): string {
        return `The format of data ${badKey} is not correct`;
    }

    private async sanitizeById(
        testName: string,
        id: number | undefined
    ): Promise<TsanitizeCheckById> {
        const sanitizeCheck = {
            hasSucceded: false,
            message: '',
        };
        if (id && testName === 'wordlistId') {
            if (await this.wordlistExistById(id))
                sanitizeCheck.hasSucceded = true;
        } else if (id && testName === 'templateTaskId') {
            if (await this.templateTaskExistById(id))
                sanitizeCheck.hasSucceded = true;
        } else if (id && testName === 'hashlistId') {
            if (await this.hashListExistById(id))
                sanitizeCheck.hasSucceded = true;
        } else if (id && testName === 'hashTypeId') {
            if (await this.hashTypeExistById(id))
                sanitizeCheck.hasSucceded = true;
        } else if (id && testName === 'wordlist') {
            if (await this.wordlistExistById(id))
                sanitizeCheck.hasSucceded = true;
        } else if (id && testName === 'workloadProfileId') {
            if (await this.workloadProfileExistById(id))
                sanitizeCheck.hasSucceded = true;
        } else if (id && testName === 'attackModeId') {
            if (await this.attackModeExistById(id))
                sanitizeCheck.hasSucceded = true;
        }
        if (id && !sanitizeCheck.hasSucceded) {
            sanitizeCheck.message = this.responsesForFailId(testName, id);
        } else if (!id) {
            sanitizeCheck.message = this.responsesForDoesNotExistId(testName);
        }
        return sanitizeCheck;
    }

    private responsesForFailId(failName: string, id: number): string {
        return `The requested ${failName} with id ${id} does not exist`;
    }

    private responsesForDoesNotExistId(failName: string): string {
        return `The parameter ${failName} does not exist, please set it`;
    }

    private async hashListExistById(id: number): Promise<boolean> {
        return await this.db.getRepository(Hashlist).exist({
            where: {
                id: id,
            },
        });
    }

    private async hashTypeExistById(id: number): Promise<boolean> {
        return await this.db.getRepository(HashType).exist({
            where: {
                id: id,
            },
        });
    }

    private async wordlistExistById(id: number): Promise<boolean> {
        return await this.db.getRepository(Wordlist).exist({
            where: {
                id: id,
            },
        });
    }

    private async workloadProfileExistById(id: number): Promise<boolean> {
        return await this.db.getRepository(WorkloadProfile).exist({
            where: {
                id: id,
            },
        });
    }

    private async attackModeExistById(id: number): Promise<boolean> {
        return await this.db.getRepository(AttackMode).exist({
            where: {
                id: id,
            },
        });
    }
}
