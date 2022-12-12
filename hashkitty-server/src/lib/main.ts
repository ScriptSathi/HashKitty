import 'reflect-metadata';
import { HttpServer } from './API/HttpServer';
import { Constants } from './Constants';
import { AppDataSource } from './ORM/data-source';

async function main(): Promise<void> {
    new HttpServer(
        Constants.defaultApiConfig,
        await AppDataSource.initialize()
    ).listen();
}

main();
