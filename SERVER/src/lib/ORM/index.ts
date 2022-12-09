import { Constants } from '../Constants';
import { AppDataSource } from './data-source';
import { Factory } from './migration/Factory';
import { Migration } from './migration/Migration';

/* eslint-disable @typescript-eslint/no-unused-vars */
AppDataSource.initialize()
    .then(async () => {
        const migration = new Migration(AppDataSource);
        if (Constants.isProduction) {
            const factory = new Factory(AppDataSource);
            await factory.fakeAll(20); //You can create any of the needed elements for your tests
        }
    })
    .catch(error => console.log(error));
