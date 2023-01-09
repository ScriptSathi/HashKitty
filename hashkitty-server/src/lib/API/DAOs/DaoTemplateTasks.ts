import { DataSource } from 'typeorm';

import { TemplateTask } from '../../ORM/entity/TemplateTask';
import { IDaoSub } from './IDaoSub';
import { Options } from '../../ORM/entity/Options';

export class DaoTemplateTasks implements IDaoSub<TemplateTask> {
    private db: DataSource;

    constructor(db: DataSource) {
        this.db = db;
    }

    public getAll(): Promise<TemplateTask[]> {
        return this.db.getRepository(TemplateTask).find({
            relations: [
                'options',
                'options.wordlistId',
                'options.attackModeId',
                'options.workloadProfileId',
            ],
        });
    }

    public async create(templateTask: TemplateTask): Promise<TemplateTask> {
        templateTask.lastestModification = new Date();
        return this.update(templateTask);
    }

    public deleteById(id: number): void {
        this.db.getRepository(TemplateTask).delete(id);
    }

    public async getById(id: number): Promise<TemplateTask> {
        const templateTask = await this.db.getRepository(TemplateTask).findOne({
            where: { id },
            relations: [
                'options',
                'options.wordlistId',
                'options.attackModeId',
                'options.workloadProfileId',
            ],
        });
        return templateTask === null ? new TemplateTask() : templateTask;
    }

    public async update(templateTask: TemplateTask): Promise<TemplateTask> {
        templateTask.lastestModification = new Date();
        templateTask.options = await this.updateOptions(templateTask.options);
        return this.db.getRepository(TemplateTask).save(templateTask);
    }

    private updateOptions(options: Options): Promise<Options> {
        return this.db.getRepository(Options).save(options);
    }
}
