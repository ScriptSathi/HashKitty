import { DataSource } from 'typeorm';
import { attackModes } from '../data/attackModes';
import { hashTypes } from '../data/hashtypes';
import { AttackMode } from '../entity/AttackMode';
import { HashType } from '../entity/HashType';

export class Migration {
    private appDataSource: DataSource;

    constructor(appDataSource: DataSource) {
        this.appDataSource = appDataSource;
    }

    public migrateAll(): void {
        this.migrateAttackModes();
        this.migrateHashTypes();
    }

    public async migrateHashTypes(): Promise<void> {
        for (const hashType of hashTypes) {
            const dbHashType = new HashType();
            dbHashType.typeNumber = parseInt(hashType.id);
            dbHashType.name = hashType.name;
            dbHashType.description = hashType.description;
            await this.appDataSource.manager.save(dbHashType);
        }
    }

    public async migrateAttackModes(): Promise<void> {
        for (const attackMode of attackModes) {
            const dbAttackMode = new AttackMode();
            dbAttackMode.type = attackMode.type;
            dbAttackMode.name = attackMode.name;
            await this.appDataSource.manager.save(dbAttackMode);
        }
    }
}
