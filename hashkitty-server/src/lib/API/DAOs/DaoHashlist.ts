import { DataSource } from 'typeorm';
import { Hashlist } from '../../ORM/entity/Hashlist';
import { IDaoSub } from './IDaoSub';

export class DaoHashlist implements IDaoSub<Hashlist> {
    private db: DataSource;

    constructor(db: DataSource) {
        this.db = db;
    }

    public getAll(): Promise<Hashlist[]> {
        return this.db
            .getRepository(Hashlist)
            .find({ relations: ['hashTypeId'] });
    }

    public create(hashlist: Hashlist): Promise<Hashlist> {
        hashlist.createdAt = new Date();
        return this.update(hashlist);
    }

    public update(
        hashlist: Hashlist,
        isModification = true
    ): Promise<Hashlist> {
        if (isModification) hashlist.lastestModification = new Date();
        return this.db.getRepository(Hashlist).save(hashlist);
    }

    public deleteById(id: number): void {
        this.db.getRepository(Hashlist).delete(id);
    }

    public async getById(id: number): Promise<Hashlist> {
        const hashlist = await this.db.getRepository(Hashlist).findOne({
            where: {
                id: id,
            },
            relations: ['hashTypeId'],
        });
        return hashlist === null ? new Hashlist() : hashlist;
    }
}
