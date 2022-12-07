import { HttpServer } from './API/HttpServer';
import { Constants } from './Constants';
import 'reflect-metadata';

function main(): void {
    new HttpServer(Constants.defaultApiConfig).listen();
}

main();
