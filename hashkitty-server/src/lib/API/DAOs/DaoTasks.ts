import { DataSource } from 'typeorm';

import { IDaoSub } from './IDaoSub';
import { Task } from '../../ORM/entity/Task';
import { Options } from '../../ORM/entity/Options';
import { TTask } from '../../types/TApi';

export class DaoTasks implements IDaoSub<Task> {
    private db: DataSource;

    constructor(db: DataSource) {
        this.db = db;
    }

    public async getAll(): Promise<Task[]> {
        const tasks = await this.db.getRepository(Task).find({
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
        return tasks.sort((a, b) => {
            return (
                new Date(b.lastestModification).valueOf() -
                new Date(a.lastestModification).valueOf()
            );
        });
    }

    public create(task: Task): Promise<Task> {
        task.createdAt = new Date();
        return this.update(task);
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

    public async update(task: Task): Promise<Task> {
        task.lastestModification = new Date();
        task.options = await this.updateOptions(task.options);
        return this.db.getRepository(Task).save(task);
    }

    public registerTaskEnded(task: Task): Promise<Task> {
        task.isfinished = true;
        task.endeddAt = new Date();
        return this.db.getRepository(Task).save(task);
    }

    private updateOptions(options: Options): Promise<Options> {
        return this.db.getRepository(Options).save(options);
    }
}
