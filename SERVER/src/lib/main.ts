import 'reflect-metadata';
import { HttpServer } from './API/HttpServer';
import { Constants } from './Constants';
import { AppDataSource } from './ORM/data-source';

async function main(): Promise<void> {
    await AppDataSource.initialize();
    new HttpServer(Constants.defaultApiConfig, AppDataSource).listen();
}

main();
