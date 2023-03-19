import { DataSource, Repository } from 'typeorm';
import { Hashlist } from '../../ORM/entity/Hashlist';
import { IDaoSub } from './IDaoSub';

export class DaoHashlist implements IDaoSub<Hashlist> {
   private db: Repository<Hashlist>;

   constructor(db: DataSource) {
      this.db = db.getRepository(Hashlist);
   }

   public getAll(): Promise<Hashlist[]> {
      return this.db.find({ relations: ['hashTypeId'] });
   }

   public create(hashlist: Hashlist): Promise<Hashlist> {
      hashlist.createdAt = new Date();
      return this.update(hashlist);
   }

   public update(hashlist: Hashlist, isModification = true): Promise<Hashlist> {
      if (isModification) hashlist.lastestModification = new Date();
      return this.db.save(hashlist);
   }

   public deleteById(id: number): void {
      this.db.delete(id);
   }

   public async getById(id: number): Promise<Hashlist> {
      const hashlist = await this.db.findOne({
         where: { id },
         relations: ['hashTypeId'],
      });
      return hashlist === null ? new Hashlist() : hashlist;
   }
}
