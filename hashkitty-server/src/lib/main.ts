import 'reflect-metadata';
import { HttpServer } from './API/HttpServer';
import { Constants } from './Constants';
import { AppDataSource } from './ORM/data-source';
import { Task } from './ORM/entity/Task';
import { Wordlist } from './ORM/entity/Wordlist';

async function main(): Promise<void> {
    new HttpServer(
        Constants.defaultApiConfig,
        await AppDataSource.initialize()
    ).listen();
}

main();
