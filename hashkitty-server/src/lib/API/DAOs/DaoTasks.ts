import { DataSource, Repository } from 'typeorm';

import { IDaoSub } from './IDaoSub';
import { Task } from '../../ORM/entity/Task';
import { Options } from '../../ORM/entity/Options';

export class DaoTasks implements IDaoSub<Task> {
    private db: Repository<Task>;
    private option: Repository<Options>;
    private dbRelations = {
        relations: [
            'options',
            'options.wordlistId',
            'options.attackModeId',
            'options.workloadProfileId',
            'templateTaskId',
            'hashlistId',
            'hashlistId.hashTypeId',
        ],
    };

    constructor(db: DataSource) {
        this.db = db.getRepository(Task);
        this.option = db.getRepository(Options);
    }

    public async getAll(): Promise<Task[]> {
        const tasks = await this.db.find(this.dbRelations);
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
        this.db.delete(id);
    }

    public async getById(id: number): Promise<Task> {
        const task = await this.db.findOne({
            where: { id },
            ...this.dbRelations,
        });
        return task === null ? new Task() : task;
    }

    public async update(task: Task): Promise<Task> {
        task.lastestModification = new Date();
        task.options = await this.updateOptions(task.options);
        return this.db.save(task);
    }

    public registerTaskEnded(task: Task): Promise<Task> {
        task.isfinished = true;
        task.endeddAt = new Date();
        return this.db.save(task);
    }

    private updateOptions(options: Options): Promise<Options> {
        return this.option.save(options);
    }
}
