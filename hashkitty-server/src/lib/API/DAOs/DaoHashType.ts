import { IDaoSub } from './IDaoSub';
import { DataSource, Repository } from 'typeorm';
import { HashType } from '../../ORM/entity/HashType';

export class DaoHashType implements IDaoSub<HashType> {
   private db: Repository<HashType>;

   constructor(db: DataSource) {
      this.db = db.getRepository(HashType);
   }

   public getAll(): Promise<HashType[]> {
      return this.db.find();
   }

   public create(hashType: HashType): Promise<HashType> {
      return this.db.save(hashType);
   }

   public async getById(id: number): Promise<HashType> {
      const hashType = await this.db.findOne({ where: { id } });
      return hashType === null ? new HashType() : hashType;
   }
}
