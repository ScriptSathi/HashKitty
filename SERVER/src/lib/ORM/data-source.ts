import { DataSource } from 'typeorm';
import { HashType } from './entity/HashType';
import { Constants } from '../Constants';
import { AttackMode } from './entity/AttackMode';
import { Hashlist } from './entity/Hashlist';
import { Options } from './entity/Options';
import { Task } from './entity/Task';
import { TemplateTask } from './entity/TemplateTask';
import { Wordlist } from './entity/Wordlist';
import { WorkloadProfile } from './entity/WorkloadProfile';

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'hashkitty',
    password: 'hashkitty',
    database: 'hashkitty',
    synchronize: Constants.isProduction,
    logging: false,
    entities: [
        HashType,
        AttackMode,
        Hashlist,
        Options,
        Task,
        TemplateTask,
        Wordlist,
        WorkloadProfile,
    ],
    migrations: [],
    subscribers: [],
});
