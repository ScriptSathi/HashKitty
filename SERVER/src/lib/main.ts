import 'reflect-metadata';
import { HttpServer } from './API/HttpServer';
import { Constants } from './Constants';

function main(): void {
    new HttpServer(Constants.defaultApiConfig).listen();
}

main();
