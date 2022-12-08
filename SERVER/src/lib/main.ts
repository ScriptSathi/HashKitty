import 'reflect-metadata';
import { HttpServer } from './API/HttpServer';
import { Constants } from './Constants';

export * from './ORM/index';

function main(): void {
    new HttpServer(Constants.defaultApiConfig).listen();
}

main();
