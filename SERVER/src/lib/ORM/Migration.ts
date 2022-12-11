import { DataSource } from 'typeorm';
import { attackModes } from './migration/attackModes';
import { hashTypes } from './migration/hashtypes';
import { AttackMode } from './entity/AttackMode';
import { HashType } from './entity/HashType';

export class Migration {
    private appDataSource: DataSource;

    constructor(appDataSource: DataSource) {
        this.appDataSource = appDataSource;
    }

    public migrateAll(): void {
        this.migrateAttackModes();
        this.migrateHashTypes();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public migrateHashTypes = async (_ = 0): Promise<void> => {
        for (const hashType of hashTypes) {
            const dbHashType = new HashType();
            dbHashType.typeNumber = parseInt(hashType.id);
            dbHashType.name = hashType.name;
            dbHashType.description = hashType.description;
            await this.appDataSource.manager.save(dbHashType);
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public migrateAttackModes = async (_ = 0): Promise<void> => {
        for (const attackMode of attackModes) {
            const dbAttackMode = new AttackMode();
            dbAttackMode.mode = parseInt(attackMode.type);
            dbAttackMode.name = attackMode.name;
            await this.appDataSource.manager.save(dbAttackMode);
        }
    };
}
