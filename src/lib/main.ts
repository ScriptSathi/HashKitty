import { Hashcat } from './hashcat/Hashcat';
import { TStandardEndpoint } from './types/TApi';
import { logger } from './Utils/Logger';

function main(): void {
    const options: TStandardEndpoint = {
        wordlist: '/opt/wordlists/maWordList.txt',
        flags: [
            {
                name: 'hashType',
                arg: '1000',
            },
            {
                name: 'attackMode',
                arg: '0',
            },
            {
                name: 'potfilePath',
                arg: '/opt/potfiles/toto.txt',
            },
        ],
        hashList: {
            name: 'toto',
            hashs: ['test1', 'test2', 'test3'],
        },
    };
    const hashcat = new Hashcat(options);
    logger.debug('aaa');
    logger.info('aaa');
    logger.info(hashcat.generateCmd());
}

(() => {
    try {
        main();
    } catch (e) {
        logger.error(e);
    }
})();
