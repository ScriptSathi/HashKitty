import 'reflect-metadata';
import { HttpServer } from './API/HttpServer';
import { Constants } from './Constants';
import { AppDataSource } from './ORM/data-source';

function main(): void {
    AppDataSource.initialize();
    new HttpServer(Constants.defaultApiConfig).listen();
}

main();
