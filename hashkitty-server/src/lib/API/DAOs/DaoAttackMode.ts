import { AttackMode } from '../../ORM/entity/AttackMode';
import { TDaoCreateAttackMode } from '../../types/TDAOs';
import { IDaoSub } from './IDaoSub';
import { DataSource } from 'typeorm';

export class DaoAttackMode
    implements IDaoSub<AttackMode, TDaoCreateAttackMode>
{
    private db: DataSource;

    constructor(db: DataSource) {
        this.db = db;
    }

    public getAll(): Promise<AttackMode[]> {
        return this.db.getRepository(AttackMode).find();
    }

    public create(reqBody: TDaoCreateAttackMode): Promise<AttackMode> {
        const attackMode = new AttackMode();
        attackMode.mode = reqBody.mode;
        attackMode.name = reqBody.name;
        return this.db.getRepository(AttackMode).save(attackMode);
    }

    public deleteById(id: number): void {
        id;
        return; // Nothing to do here
    }

    public async getById(id: number): Promise<AttackMode> {
        const attackMode = await this.db
            .getRepository(AttackMode)
            .findOne({ where: { id } });
        return attackMode === null ? new AttackMode() : attackMode;
    }

    public update(reqBody: Partial<AttackMode>): Promise<void> {
        return new Promise(() => {
            reqBody;
        }); // Nothing to do here
    }
}
