import { logger } from './utils/Logger';
import { HttpServer } from './API/HttpServer';
import { Constants } from './Constants';

async function main(): Promise<void> {
    const httpServer = new HttpServer(Constants.defaultApiConfig);
    httpServer.listen();
}

(() => {
    try {
        main();
    } catch (e) {
        logger.error(e);
    }
})();
