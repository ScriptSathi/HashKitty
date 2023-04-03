import {
   DataSource,
   EntityTarget,
   FindOptionsWhere,
   ObjectLiteral,
} from 'typeorm';

import { AttackMode } from '../../ORM/entity/AttackMode';
import { Hashlist } from '../../ORM/entity/Hashlist';
import { Task } from '../../ORM/entity/Task';
import { TemplateTask } from '../../ORM/entity/TemplateTask';
import { Wordlist } from '../../ORM/entity/Wordlist';
import { WorkloadProfile } from '../../ORM/entity/WorkloadProfile';
import { DaoTasks } from './DaoTasks';
import { DaoTemplate } from './DaoTemplate';
import { DaoHashlist } from './DaoHashlist';
import { DaoAttackMode } from './DaoAttackMode';
import { DaoHashType } from './DaoHashType';
import { FsUtils } from '../../utils/FsUtils';
import { Constants } from '../../Constants';
import { logger } from '../../utils/Logger';
import { Migration } from '../../ORM/Migration';
import { HashType } from '../../ORM/entity/HashType';
import { DaoNotification } from './DaoNotification';
import { Notification } from '../../ORM/entity/Notification';
import {
   ListItem,
   Options,
   THashlist,
   TTask,
   UploadFileType,
} from '../../types/TApi';

export class Dao {
   public static get UnexpectedError(): string {
      return 'An unexpected error occurred';
   }

   public static get NoIdProvided(): string {
      return 'You need to provide an id';
   }

   public static async migrateOnInitDb(db: DataSource): Promise<void> {
      const migration = new Migration(db);
      this.migrateIfNotExist<AttackMode>(
         db,
         AttackMode,
         migration.migrateAttackModes
      );
      this.migrateIfNotExist<HashType>(
         db,
         HashType,
         migration.migrateHashTypes
      );
      this.migrateIfNotExist<WorkloadProfile>(
         db,
         WorkloadProfile,
         migration.migrateWorkloadProfiles
      );
      this.migrateIfNotExist<Wordlist>(db, Wordlist, migration.migrateWordlist);
   }

   private static async migrateIfNotExist<T extends ObjectLiteral>(
      db: DataSource,
      EntityList: EntityTarget<T>,
      migrateFunc: () => Promise<void>,
      findObject = {},
      tryAgainCount = 0
   ): Promise<T[]> {
      let req: T[] = [];
      try {
         req = await db.getRepository(EntityList).find(findObject);
      } catch (e) {
         if (tryAgainCount > 0) {
            throw e;
         }
      } finally {
         if (req.length === 0) {
            await migrateFunc();
            await this.migrateIfNotExist(
               db,
               EntityList,
               migrateFunc,
               findObject,
               1
            );
         }
      }
      return req;
   }

   public db: DataSource;
   public task: DaoTasks;
   public hashlist: DaoHashlist;
   public template: DaoTemplate;
   public attackMode: DaoAttackMode;
   public hashType: DaoHashType;
   public notification: DaoNotification;

   constructor(db: DataSource) {
      this.db = db;
      this.task = new DaoTasks(db);
      this.template = new DaoTemplate(db);
      this.hashlist = new DaoHashlist(db);
      this.attackMode = new DaoAttackMode(db);
      this.hashType = new DaoHashType(db);
      this.notification = new DaoNotification(db);
   }

   public async reloadWordlistInDB(): Promise<void> {
      const filesInDir = FsUtils.listFileInDir(Constants.wordlistPath);
      const wordlistInDb = await this.db.getRepository(Wordlist).find();
      const missingInDb = filesInDir.filter(
         file => !wordlistInDb.find(elem => file === elem.name)
      );
      missingInDb.map(file => {
         const wl = new Wordlist();
         wl.name = file;
         wl.description = '';
         wl.path = `${Constants.wordlistPath}/${file}`;
         try {
            this.db.getRepository(Wordlist).save(wl);
         } catch (e) {
            logger.error('An error occured', e);
         }
      });
      const dbElemToDelete = wordlistInDb.filter(
         file => !filesInDir.includes(file.name)
      );
      dbElemToDelete.map(wl => this.db.getRepository(Wordlist).delete(wl.id));
   }

   public async taskExistById(id: number): Promise<boolean> {
      return await this.db.getRepository(Task).exist({
         where: {
            id: id,
         },
      });
   }

   public async templateExistById(id: number): Promise<boolean> {
      return await this.db.getRepository(TemplateTask).exist({
         where: {
            id: id,
         },
      });
   }

   public findWordlistWhere(where: {
      name?: string;
      id?: number;
   }): Promise<Wordlist | null> {
      return this.db.getRepository(Wordlist).findOne({
         where: where,
      });
   }

   public findWorkloadProfileByName(
      profileId: number
   ): Promise<WorkloadProfile | null> {
      return this.db.getRepository(WorkloadProfile).findOne({
         where: {
            profileId,
         },
      });
   }

   public async findAttackModeById(id: number): Promise<AttackMode | null> {
      return await this.db.getRepository(AttackMode).findOne({
         where: {
            id: id,
         },
      });
   }

   public async findHashlistExistWhere(
      where: FindOptionsWhere<Hashlist>
   ): Promise<boolean> {
      return await this.db.getRepository(Hashlist).exist({ where });
   }

   public async findHashTypeExistById(id: number): Promise<boolean> {
      return await this.db.getRepository(HashType).exist({ where: { id } });
   }

   public async notificationExistById(id: number): Promise<boolean> {
      return await this.db.getRepository(Notification).exist({ where: { id } });
   }

   public async getReferenceOfList(
      fileType: UploadFileType,
      searchFileName: string
   ): Promise<Task[]> {
      const tasks = await this.task.getAll();
      switch (fileType) {
         case 'hashlist': {
            return tasks.filter(
               task =>
                  (task.hashlistId as unknown as THashlist).name ===
                  searchFileName
            );
         }
         case 'rule': {
            return tasks.filter(
               task =>
                  (task.options as unknown as Options).rules === searchFileName
            );
         }
         case 'potfile': {
            return tasks.filter(
               task =>
                  (task.options as unknown as Options).potfileName ===
                  searchFileName
            );
         }
         case 'wordlist': {
            return tasks.filter(task => {
               const wordlist = (task.options as unknown as Options)
                  .wordlistId as Wordlist;
               return wordlist.name === searchFileName;
            });
         }
         default:
            throw new Error(`The provided fileType ${fileType} is incorrect`);
      }
   }

   public async getListContext<List extends ListItem['item']>(
      items: List[],
      filterCallback: (item: List, task: TTask) => boolean,
      isHashlist = false
   ): Promise<ListItem[]> {
      const tasks = (await this.task.getAll()) as unknown as TTask[];
      return items.reduce((acc, list) => {
         const listIsBindTo = tasks.filter(task => filterCallback(list, task));
         return [
            ...acc,
            {
               item: list,
               canBeDeleted: isHashlist ? listIsBindTo.length === 0 : true,
               bindTo: listIsBindTo as unknown as TTask[],
            },
         ];
      }, [] as ListItem[]);
   }

   public nullifyReferences(fileType: UploadFileType, tasks: Task[]) {
      let nullify: (task: Task) => void;
      switch (fileType) {
         case 'hashlist':
            // Noop because of constraint with tasks
            nullify = () => {};
            break;
         case 'rule':
            nullify = this.nullifyRules;
            break;
         case 'potfile':
            nullify = this.nullifyPotfile;
            break;
         case 'wordlist':
            nullify = this.nullifyWordlist;
            break;
         default:
            throw new Error(`The provided fileType ${fileType} is incorrect`);
      }
      for (const task of tasks) {
         nullify(task);
      }
   }

   private nullifyWordlist = async (task: Task): Promise<void> => {
      const name = '* (All Wordlists)';
      const wordlistReplacement = await this.db
         .getRepository(Wordlist)
         .findOne({ where: { name } });
      task.options.wordlistId = wordlistReplacement?.id || new Wordlist().id;
      this.task.update(task);
   };

   private nullifyPotfile = (task: Task): void => {
      task.options.potfileName = '';
      this.task.update(task);
   };

   private nullifyRules = (task: Task): void => {
      task.options.rules = '';
      this.task.update(task);
   };
}
