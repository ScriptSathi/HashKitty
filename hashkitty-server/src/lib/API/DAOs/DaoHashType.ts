import { IDaoSub } from './IDaoSub';
import { DataSource } from 'typeorm';
import { HashType } from '../../ORM/entity/HashType';

export class DaoHashType implements IDaoSub<HashType> {
    private db: DataSource;

    constructor(db: DataSource) {
        this.db = db;
    }

    public getAll(): Promise<HashType[]> {
        return this.db.getRepository(HashType).find();
    }

    public create(hashType: HashType): Promise<HashType> {
        return this.db.getRepository(HashType).save(hashType);
    }

    public deleteById(id: number): void {
        id;
        return; // Nothing to do here
    }

    public async getById(id: number): Promise<HashType> {
        const hashType = await this.db
            .getRepository(HashType)
            .findOne({ where: { id } });
        return hashType === null ? new HashType() : hashType;
    }

    public update(reqBody: HashType): Promise<HashType> {
        return new Promise(() => {
            reqBody;
        }); // Nothing to do here
    }
}
