import { DataSource } from 'typeorm';

import { IDaoSub } from './IDaoSub';
import { Task } from '../../ORM/entity/Task';
import { TDaoTaskCreate, TDaoTaskUpdate } from '../../types/TDAOs';
import { Options } from '../../ORM/entity/Options';
import { TemplateTask } from '../../ORM/entity/TemplateTask';
import { logger } from '../../utils/Logger';
import { Dao } from './Dao';

export class DaoTasks implements IDaoSub<Task, TDaoTaskCreate> {
    private db: DataSource;
    private parentDao: Dao;

    constructor(db: DataSource, parentDao: Dao) {
        this.db = db;
        this.parentDao = parentDao;
    }

    public getAll(): Promise<Task[]> {
        return this.db.getRepository(Task).find({
            relations: ['options', 'templateTaskId'],
        });
    }

    public async create(taskData: TDaoTaskCreate): Promise<Task> {
        const task = new Task();
        task.name = this.parentDao.sanitizeLength(30, taskData.name);
        task.description = this.parentDao.sanitizeLength(
            100,
            taskData.description
        );
        task.hashTypeId = taskData.hashTypeId;
        task.hashlistId = taskData.hashlistId;
        task.templateTaskId = taskData.templateTaskId;
        task.createdAt = new Date();
        task.lastestModification = new Date();
        task.options = await this.getOptionsOrCreate(
            taskData.options,
            taskData.templateTaskId
        );
        return await this.db.getRepository(Task).save(task);
    }

    public deleteById(id: number): void {
        this.db.getRepository(Task).delete(id);
    }

    public async getById(id: number): Promise<Task> {
        const task = await this.db.getRepository(Task).findOne({
            where: {
                id: id,
            },
            relations: ['options', 'templateTaskId'],
        });
        return task === null ? new Task() : task;
    }

    public async update(taskData: TDaoTaskUpdate): Promise<void> {
        const task = await this.db.getRepository(Task).findOne({
            where: {
                id: taskData.id,
            },
            relations: ['options', 'templateTaskId'],
        });
        if (task) {
            task.name = this.parentDao.sanitizeLength(30, taskData.name);
            task.description = this.parentDao.sanitizeLength(
                100,
                taskData.description
            );
            task.hashTypeId = taskData.hashTypeId;
            task.hashlistId = taskData.hashlistId;
            task.templateTaskId = taskData.templateTaskId;
            task.lastestModification = new Date();
            await this.db.getRepository(Task).save(task);
            if (taskData.options) {
                await this.db.getRepository(Options).save({
                    ...this.parentDao.sanitizeOptionsData(
                        task.options,
                        taskData.options
                    ),
                    ...{ id: task.options.id },
                });
            }
            logger.debug('Update Task with id:' + taskData.id);
        }
    }

    private async getOptionsOrCreate(
        options: Options | undefined,
        templateTaskId: number | undefined
    ): Promise<Options> {
        if (!options && !templateTaskId) {
            throw new Error('No options or templateTaskId were provided.');
        } else if (options && !templateTaskId) {
            const dbOptions = new Options();
            dbOptions.CPUOnly = options.CPUOnly;
            dbOptions.attackModeId = options.attackModeId;
            dbOptions.breakpointGPUTemperature =
                this.parentDao.sanitizeTemperature(
                    options.breakpointGPUTemperature
                );
            dbOptions.wordlistId = options.wordlistId;
            dbOptions.workloadProfileId = options.workloadProfileId;
            dbOptions.kernelOpti = options.kernelOpti;
            dbOptions.ruleName = this.parentDao.sanitizeLength(
                100,
                options.ruleName || ''
            );
            dbOptions.maskQuery = this.parentDao.sanitizeLength(
                100,
                options.maskQuery || ''
            );
            dbOptions.maskFilename = this.parentDao.sanitizeLength(
                100,
                options.maskFilename || ''
            );
            return await this.db.getRepository(Options).save(dbOptions);
        } else {
            return (
                (await this.db.getRepository(TemplateTask).findOne({
                    where: {
                        id: templateTaskId,
                    },
                    relations: {
                        options: true,
                    },
                })) || new TemplateTask()
            ).options;
        }
    }
}
