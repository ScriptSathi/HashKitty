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
            logger.error(error);
            logger.info(
                `Error while trying to connect to MySQL, retry in ${sleepTime} seconds`
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
