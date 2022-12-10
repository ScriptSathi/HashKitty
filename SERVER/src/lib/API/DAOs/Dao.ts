import { DataSource } from 'typeorm';

import { Task } from '../../ORM/entity/Task';
import { TemplateTask } from '../../ORM/entity/TemplateTask';
import { DaoTasks } from './DaoTasks';
import { DaoTemplateTasks } from './DaoTemplateTasks';

export class Dao {
    private db: DataSource;
    public task: DaoTasks;
    public templateTask: DaoTemplateTasks;

    constructor(db: DataSource) {
        this.db = db;
        this.task = new DaoTasks(db);
        this.templateTask = new DaoTemplateTasks(db);
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
}
