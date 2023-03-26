import { DataSource } from 'typeorm';
import { Constants } from '../Constants';

export const AppDataSource = new DataSource({
   type: 'mysql',
   host: Constants.dbEnpoint,
   port: Constants.dbPort,
   username: Constants.dbUsername,
   password: Constants.dbPassword,
   database: Constants.dbDatabase,
   synchronize: Constants.isProduction,
   logging: false,
   entities: [__dirname + '/entity/*js'],
   migrations: [],
   subscribers: [],
});
