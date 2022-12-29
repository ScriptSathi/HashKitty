import 'reflect-metadata';
import { HttpServer } from './API/HttpServer';
import { Constants } from './Constants';
import { AppDataSource } from './ORM/data-source';
import { logger } from './utils/Logger';

async function main(): Promise<void> {
    let appDataSource = undefined;

    while (appDataSource === undefined) {
        try {
            appDataSource = await AppDataSource.initialize();
        } catch (error) {
            const sleepTime = 5;
            logger.info(
                `Wait for MySQL to start, sleep for ${sleepTime} seconds`
            );
            await new Promise<void>(resolve =>
                setTimeout(() => {
                    resolve();
                }, sleepTime * 1000)
            );
        }
    }

    new HttpServer(Constants.defaultApiConfig, appDataSource).listen();
}

main();
