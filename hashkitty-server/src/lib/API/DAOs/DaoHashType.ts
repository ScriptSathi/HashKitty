import { IDaoSub } from './IDaoSub';
import { DataSource } from 'typeorm';
import { HashType } from '../../ORM/entity/HashType';
import { TDaoHashTypeCreate } from '../../types/TDAOs';

export class DaoHashType implements IDaoSub<HashType, TDaoHashTypeCreate> {
    private db: DataSource;

    constructor(db: DataSource) {
        this.db = db;
    }

    public getAll(): Promise<HashType[]> {
        return this.db.getRepository(HashType).find();
    }

    public create(reqBody: TDaoHashTypeCreate): Promise<HashType> {
        const hashType = new HashType();
        hashType.typeNumber = reqBody.typeNumber;
        hashType.name = reqBody.name;
        hashType.description = reqBody.description;
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

    public update(reqBody: Partial<HashType>): Promise<void> {
        return new Promise(() => {
            reqBody;
        }); // Nothing to do here
    }
}
