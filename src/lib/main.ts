import {logger} from './Utils/Logger';

function main(): void {
    logger.error('aaaaaa');
}

(() => {
    try {
        main();
    } catch (e) {
        logger.error(e);
    }
})();
