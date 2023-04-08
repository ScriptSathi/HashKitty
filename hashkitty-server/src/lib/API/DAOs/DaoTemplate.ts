import { DataSource, Repository } from 'typeorm';

import { TemplateTask } from '../../ORM/entity/TemplateTask';
import { IDaoSub } from './IDaoSub';
import { Options } from '../../ORM/entity/Options';

export class DaoTemplate implements IDaoSub<TemplateTask> {
   private db: Repository<TemplateTask>;
   private option: Repository<Options>;
   private dbRelations: string[];

   constructor(db: DataSource) {
      this.db = db.getRepository(TemplateTask);
      this.option = db.getRepository(Options);
      this.dbRelations = [
         'options',
         'options.wordlistId',
         'options.combinatorWordlistId',
         'options.attackModeId',
         'options.workloadProfileId',
      ];
   }

   public getAll(): Promise<TemplateTask[]> {
      return this.db.find({
         relations: this.dbRelations,
      });
   }

   public async create(templateTask: TemplateTask): Promise<TemplateTask> {
      templateTask.lastestModification = new Date();
      return this.update(templateTask);
   }

   public deleteById(id: number): void {
      this.db.delete(id);
   }

   public async getById(id: number): Promise<TemplateTask> {
      const templateTask = await this.db.findOne({
         where: { id },
         ...{ relations: this.dbRelations },
      });
      return templateTask === null ? new TemplateTask() : templateTask;
   }

   public async update(templateTask: TemplateTask): Promise<TemplateTask> {
      templateTask.lastestModification = new Date();
      templateTask.options = await this.updateOptions(templateTask.options);
      return this.db.save(templateTask);
   }

   private updateOptions(options: Options): Promise<Options> {
      return this.option.save(options);
   }
}
