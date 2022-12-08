import { AppDataSource } from './data-source';
import { Factory } from './migration/Factory';
import { Migration } from './migration/Migration';

AppDataSource.initialize()
    .then(() => {
        const migration = new Migration(AppDataSource);
        const factory = new Factory(AppDataSource);
        // migration.migrateHashTypes();
        // factory.fakeAll(20); // You can generate fake data on the database using this method
        // factory.fakeTasks(20);
        // factory.fakeHashLists(20);
        factory.fakeTemplateTasks(20);
    })
    .catch(error => console.log(error));
