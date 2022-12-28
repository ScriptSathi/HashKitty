import { DataSource } from 'typeorm';

import { AttackMode } from '../../ORM/entity/AttackMode';
import { Hashlist } from '../../ORM/entity/Hashlist';
import { Task } from '../../ORM/entity/Task';
import { TemplateTask } from '../../ORM/entity/TemplateTask';
import { Wordlist } from '../../ORM/entity/Wordlist';
import { WorkloadProfile } from '../../ORM/entity/WorkloadProfile';
import { DaoTasks } from './DaoTasks';
import { DaoTemplateTasks } from './DaoTemplateTasks';
import { DaoHashlist } from './DaoHashlist';
import { DaoAttackMode } from './DaoAttackMode';
import { DaoHashType } from './DaoHashType';
import { FsUtils } from '../../utils/FsUtils';
import { Constants } from '../../Constants';
import { logger } from '../../utils/Logger';

export class Dao {
    public db: DataSource;
    public task: DaoTasks;
    public hashlist: DaoHashlist;
    public templateTask: DaoTemplateTasks;
    public attackMode: DaoAttackMode;
    public hashType: DaoHashType;

    public static get UnexpectedError(): string {
        return 'An unexpected error occurred';
    }

    public static get NoIdProvided(): string {
        return 'You need to provide an id';
    }

    constructor(db: DataSource) {
        this.db = db;
        this.task = new DaoTasks(db);
        this.templateTask = new DaoTemplateTasks(db);
        this.hashlist = new DaoHashlist(db);
        this.attackMode = new DaoAttackMode(db);
        this.hashType = new DaoHashType(db);
    }

    public async reloadWordlistInDB(): Promise<void> {
        const filesInDir = FsUtils.listFileInDir(Constants.wordlistPath);
        const wordlistInDb = await this.db.getRepository(Wordlist).find();
        const missingInDb = filesInDir.filter(x =>
            wordlistInDb.find(elem => !x.includes(elem.name))
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
        // const dbElemToDelete = wordlistInDb.filter(
        //     x => !filesInDir.includes(x.name)
        // );
        // TODO Remove deleted wordlists (the filter above is working)
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

    public findWordlistByName(name: string): Promise<Wordlist | null> {
        return this.db.getRepository(Wordlist).findOne({
            where: {
                name,
            },
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

    public async findHashlistExistById(id: number): Promise<boolean> {
        return await this.db.getRepository(Hashlist).exist({ where: { id } });
    }
}
