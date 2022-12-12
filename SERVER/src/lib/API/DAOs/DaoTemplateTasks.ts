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

    public async create(
        templateTaskData: TDaoTemplateTaskCreate
    ): Promise<TemplateTask> {
        const templateTask = new TemplateTask();
        templateTask.name = templateTaskData.name;
        templateTask.description = templateTaskData.description;
        templateTask.createdAt = new Date();
        templateTask.lastestModification = new Date();
        templateTask.options = await this.db.getRepository(Options).save({
            ...this.parentDao.sanitizeOptionsData(
                new Options(),
                templateTaskData.options
            ),
        });

        return await this.db.getRepository(TemplateTask).save(templateTask);
    }

    public deleteById(id: number): void {
        this.db.getRepository(TemplateTask).delete(id);
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
            templateTask.lastestModification = new Date();
            templateTask.name = this.parentDao.sanitizeLength(
                30,
                templateTaskData.name
            );
            templateTask.description = this.parentDao.sanitizeLength(
                100,
                templateTaskData.description
            );
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
