import path = require('path');

import { DataSource } from 'typeorm';
import { Hashlist } from '../../ORM/entity/Hashlist';
import { TDaoHashlistCreate } from '../../types/TDAOs';
import { IDaoSub } from './IDaoSub';
import { Dao } from './Dao';
import { Constants } from '../../Constants';
import { logger } from '../../utils/Logger';

export class DaoHashlist implements IDaoSub<Hashlist, TDaoHashlistCreate> {
    private db: DataSource;
    private parentDao: Dao;

    constructor(db: DataSource, parentDao: Dao) {
        this.db = db;
        this.parentDao = parentDao;
    }

    public getAll(): Promise<Hashlist[]> {
        return this.db
            .getRepository(Hashlist)
            .find({ relations: ['hashTypeId'] });
    }

    public create(hashlistData: TDaoHashlistCreate): Promise<Hashlist> {
        const hashlist = new Hashlist();
        hashlist.name = hashlistData.name;
        hashlist.description = hashlistData.description;
        hashlist.hashTypeId = hashlistData.hashTypeId;
        hashlist.createdAt = new Date();
        hashlist.lastestModification = new Date();
        hashlist.path = path.join(Constants.hashlistsPath, hashlist.name);
        return this.db.getRepository(Hashlist).save(hashlist);
    }

    public async update(hashlistData: Hashlist): Promise<void> {
        const hashlist = await this.db.getRepository(Hashlist).findOne({
            where: {
                id: hashlistData.id,
            },
            relations: ['hashTypeId'],
        });
        if (hashlist) {
            hashlist.name = hashlistData.name;
            hashlist.description = hashlistData.description;
            hashlist.lastestModification = new Date();
            this.db.getRepository(Hashlist).save(hashlist);
            logger.debug('Update hashlist with id:' + hashlistData.id);
        }
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
