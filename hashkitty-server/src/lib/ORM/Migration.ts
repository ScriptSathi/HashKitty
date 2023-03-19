import { DataSource } from 'typeorm';
import { attackModes } from './migration/attackModes';
import { hashTypes } from './migration/hashtypes';
import { AttackMode } from './entity/AttackMode';
import { HashType } from './entity/HashType';
import { logger } from '../utils/Logger';
import { workloadProfiles } from './migration/workloadProfiles';
import { WorkloadProfile } from './entity/WorkloadProfile';
import { Wordlist } from './entity/Wordlist';
import { Constants } from '../Constants';

export class Migration {
   private appDataSource: DataSource;

   constructor(appDataSource: DataSource) {
      this.appDataSource = appDataSource;
   }

   public migrateAll(): void {
      this.migrateAttackModes();
      this.migrateHashTypes();
      this.migrateWorkloadProfiles();
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
      logger.debug('Adding known hash types in the database');
   };

   // eslint-disable-next-line @typescript-eslint/no-unused-vars
   public migrateAttackModes = async (_ = 0): Promise<void> => {
      for (const attackMode of attackModes) {
         const dbAttackMode = new AttackMode();
         dbAttackMode.mode = attackMode.mode;
         dbAttackMode.name = attackMode.name;
         await this.appDataSource.manager.save(dbAttackMode);
      }
      logger.debug('Adding known attack modes in the database');
   };

   // eslint-disable-next-line @typescript-eslint/no-unused-vars
   public migrateWorkloadProfiles = async (_ = 0): Promise<void> => {
      for (const wp of workloadProfiles) {
         const dbWP = new WorkloadProfile();
         dbWP.profileId = wp.profileId;
         dbWP.desktopImpact = wp.desktopImpact;
         dbWP.powerConsumation = wp.powerConsumation;
         await this.appDataSource.manager.save(dbWP);
      }
      logger.debug('Adding known workload profiles in the database');
   };

   public migrateWordlist = async (): Promise<void> => {
      const dbWL = new Wordlist();
      dbWL.name = '*';
      dbWL.path = Constants.wordlistPath;
      await this.appDataSource.manager.save(dbWL);
      logger.debug('Adding known "*" option wordlist');
   };
}
