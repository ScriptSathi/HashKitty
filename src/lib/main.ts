import { Hashcat } from './hashcat/Hashcat';
import { TStandardEndpoint } from './types/TApi';
import { logger } from './utils/Logger';
import { Worker, isMainThread, parentPort } from 'node:worker_threads';

async function main(): Promise<void> {
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
    const worker = new Worker('./build/src/lib/utils/CommandUtils.js');
    // const worker = new Worker(__filename); // Soit initialiser Hashcat ici et le stop avec le 1er postMessage
    // If API call to run hashcat

    worker.postMessage('bash -c "while true; do echo 1234; sleep 2; done"'); // Soit trouver un moyen de le démarrer une 1ere fois et de l'arreter ensuite
    worker.on('message', hashcatStatus => {
        logger.debug('From Worker: ' + hashcatStatus);
    });

    setTimeout(() => {
        worker.postMessage('exit');
    }, 10000);

    // const hashcat = new Hashcat(options);
    // logger.debug('aaa');
    // logger.info('aaa');
    // logger.info(hashcat.generateCmd());
}

(() => {
    try {
        main();
    } catch (e) {
        logger.error(e);
    }
})();
