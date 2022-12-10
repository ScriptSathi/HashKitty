import { DataSource, QueryFailedError } from 'typeorm';

import { IDaoSub } from './IDaoSub';
import { Task } from '../../ORM/entity/Task';
import { TDaoTaskCreate } from '../../types/TDAOs';
import { Options } from '../../ORM/entity/Options';
import { TemplateTask } from '../../ORM/entity/TemplateTask';
import { logger } from '../../utils/Logger';

export class DaoTasks implements IDaoSub<Task, TDaoTaskCreate> {
    private db: DataSource;

    constructor(db: DataSource) {
        this.db = db;
    }

    public getAll(): Promise<Task[]> {
        throw new Error('Method not implemented.');
    }

    public async create(taskData: TDaoTaskCreate): Promise<Task> {
        const task = new Task();
        task.name = taskData.name;
        task.description = taskData.description;
        task.hashTypeId = taskData.hashTypeId;
        task.hashlistId = taskData.hashlistId;
        task.templateTaskId = taskData.templateTaskId;
        task.options = await this.getOptionsOrCreate(
            taskData.options,
            taskData.templateTaskId
        );
        return await this.db.getRepository(Task).save(task);
    }

    public deleteById(id: number): void {
        this.db.getRepository(Task).delete(id);
        logger.debug('Delete Task with id: ' + id);
    }

    public getById(id: number): Promise<Task> {
        throw new Error('Method not implemented.');
    }

    public update(reqBody: Partial<Task>): Promise<void> {
        throw new Error('Method not implemented.');
    }

    private async getOptionsOrCreate(
        options: Options | undefined,
        templateTaskId: number | undefined
    ): Promise<Options> {
        if (!options && !templateTaskId) {
            throw new Error('No options or templateTaskId were provided.');
        } else if (options && !templateTaskId) {
            // const dbOptions = new Options();
            // dbOptions.CPUOnly = options.CPUOnly;
            // dbOptions.attackModeId = options.attackModeId;
            // dbOptions.breakpointGPUTemperature = options.breakpointGPUTemperature;
            // dbOptions.wordlistId = options.wordlistId;
            // dbOptions.workloadProfileId = options.workloadProfileId;
            // dbOptions.kernelOpti = options.kernelOpti;
            // dbOptions.ruleName = options.ruleName;
            // dbOptions.maskQuery = options.maskQuery;
            return await this.db.getRepository(Options).save(options);
        } else {
            return (
                (await this.db.getRepository(TemplateTask).findOne({
                    where: {
                        id: templateTaskId,
                    },
                    relations: {
                        options: true,
                    },
                })) as TemplateTask
            ).options;
        }
    }
}
