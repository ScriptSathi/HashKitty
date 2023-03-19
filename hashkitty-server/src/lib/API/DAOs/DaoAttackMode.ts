import { AttackMode } from '../../ORM/entity/AttackMode';
import { IDaoSub } from './IDaoSub';
import { DataSource, Repository } from 'typeorm';

export class DaoAttackMode implements IDaoSub<AttackMode> {
   private db: Repository<AttackMode>;

   constructor(db: DataSource) {
      this.db = db.getRepository(AttackMode);
   }

   public getAll(): Promise<AttackMode[]> {
      return this.db.find();
   }

   public create(attackMode: AttackMode): Promise<AttackMode> {
      return this.db.save(attackMode);
   }

   public async getById(id: number): Promise<AttackMode> {
      const attackMode = await this.db.findOne({ where: { id } });
      return attackMode === null ? new AttackMode() : attackMode;
   }
}
