import { AttackMode } from '../../ORM/entity/AttackMode';
import { IDaoSub } from './IDaoSub';
import { DataSource } from 'typeorm';

export class DaoAttackMode implements IDaoSub<AttackMode> {
    private db: DataSource;

    constructor(db: DataSource) {
        this.db = db;
    }

    public getAll(): Promise<AttackMode[]> {
        return this.db.getRepository(AttackMode).find();
    }

    public create(attackMode: AttackMode): Promise<AttackMode> {
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

    public update(attackMode: AttackMode): Promise<AttackMode> {
        return new Promise(() => {
            attackMode;
        }); // Nothing to do here
    }
}
