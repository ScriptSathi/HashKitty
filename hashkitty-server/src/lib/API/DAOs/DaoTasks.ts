import { DataSource } from 'typeorm';

import { IDaoSub } from './IDaoSub';
import { Task } from '../../ORM/entity/Task';
import { ApiTaskCreate, ApiTaskUpdate } from '../../types/TDAOs';
import { Options } from '../../ORM/entity/Options';
import { TemplateTask } from '../../ORM/entity/TemplateTask';
import { logger } from '../../utils/Logger';
import { Dao } from './Dao';

export class DaoTasks implements IDaoSub<Task, ApiTaskCreate> {
    private db: DataSource;
    private parentDao: Dao;

    constructor(db: DataSource, parentDao: Dao) {
        this.db = db;
        this.parentDao = parentDao;
    }
    update(reqBody: Partial<Task>): Promise<void> {
        throw new Error('Method not implemented.');
    }

    public getAll(): Promise<Task[]> {
        return this.db.getRepository(Task).find({
            relations: [
                'options',
                'options.wordlistId',
                'options.attackModeId',
                'options.workloadProfileId',
                'templateTaskId',
                'hashlistId',
                'hashlistId.hashTypeId',
            ],
        });
    }

    public async create(task: Task): Promise<Task> {
        task.createdAt = new Date();
        task.lastestModification = new Date();
        task.options = await this.createOption(task.options);
        return this.db.getRepository(Task).save(task);
    }

    public deleteById(id: number): void {
        this.db.getRepository(Task).delete(id);
    }

    public async getById(id: number): Promise<Task> {
        const task = await this.db.getRepository(Task).findOne({
            where: {
                id: id,
            },
            relations: [
                'options',
                'options.wordlistId',
                'options.attackModeId',
                'options.workloadProfileId',
                'templateTaskId',
                'hashlistId',
                'hashlistId.hashTypeId',
            ],
        });
        return task === null ? new Task() : task;
    }

    // public async update(taskData: ApiTaskUpdate): Promise<void> {
    //     const task = await this.db.getRepository(Task).findOne({
    //         where: {
    //             id: taskData.id,
    //         },
    //         relations: [
    //             'options',
    //             'options.wordlistId',
    //             'options.attackModeId',
    //             'options.workloadProfileId',
    //             'templateTaskId',
    //             'hashlistId',
    //             'hashlistId.hashTypeId',
    //         ],
    //     });
    //     if (task) {
    //         task.name = this.parentDao.sanitizeLength(30, taskData.name);
    //         task.description = this.parentDao.sanitizeLength(
    //             100,
    //             taskData.description
    //         );
    //         task.hashlistId = taskData.hashlistId;
    //         task.templateTaskId = taskData.templateTaskId;
    //         task.lastestModification = new Date();
    //         await this.db.getRepository(Task).save(task);
    //         if (taskData.options) {
    //             await this.db.getRepository(Options).save({
    //                 ...this.parentDao.sanitizeOptionsData(
    //                     task.options,
    //                     taskData.options
    //                 ),
    //                 ...{ id: task.options.id },
    //             });
    //         }
    //         logger.debug('Update Task with id:' + taskData.id);
    //     }
    // }

    private createOption(options: Options): Promise<Options> {
        return this.db.getRepository(Options).save(options);
    }
}
