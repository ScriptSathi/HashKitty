import { DataSource } from 'typeorm';

import { TemplateTask } from '../../ORM/entity/TemplateTask';
import { IDaoSub } from './IDaoSub';
import { Dao } from './Dao';
import {
    TDaoTemplateTaskCreate,
    TDaoTemplateTaskUpdate,
} from '../../types/TDAOs';
import { Options } from '../../ORM/entity/Options';

export class DaoTemplateTasks
    implements IDaoSub<TemplateTask, TDaoTemplateTaskCreate>
{
    private db: DataSource;
    private parentDao: Dao;

    constructor(db: DataSource, parentDao: Dao) {
        this.db = db;
        this.parentDao = parentDao;
    }

    public getAll(): Promise<TemplateTask[]> {
        return this.db.getRepository(TemplateTask).find({
            relations: ['options'],
        });
    }
    public create(reqBody: TDaoTemplateTaskCreate): Promise<TemplateTask> {
        throw new Error('Method not implemented.');
    }
    public deleteById(id: number): void {
        throw new Error('Method not implemented.');
    }
    public async getById(id: number): Promise<TemplateTask> {
        const templateTask = await this.db.getRepository(TemplateTask).findOne({
            where: {
                id: id,
            },
            relations: ['options'],
        });
        return templateTask === null ? new TemplateTask() : templateTask;
    }

    public async update(
        templateTaskData: TDaoTemplateTaskUpdate
    ): Promise<void> {
        const templateTask = await this.db.getRepository(TemplateTask).findOne({
            where: {
                id: templateTaskData.id,
            },
            relations: ['options'],
        });
        if (templateTask) {
            templateTask.name = templateTaskData.name;
            templateTask.description = templateTaskData.description;
            await this.db.getRepository(TemplateTask).save(templateTask);
            await this.db.getRepository(Options).save({
                ...this.parentDao.sanitizeOptionsData(
                    templateTask.options,
                    templateTaskData.options
                ),
                ...{ id: templateTask.options.id },
            });
        }
    }
}
