import { resolve } from 'node:path';
import { Hashcat } from './hashcat/Hashcat';
import { TExecEndpoint } from './types/TApi';
import { logger } from './utils/Logger';

async function main(): Promise<void> {
    const execOptions: TExecEndpoint = {
        flags: [
            {
                name: 'hashType',
                arg: '1000',
            },
            {
                name: 'session',
                arg: 'session1',
            },
            {
                name: 'attackMode',
                arg: '0',
            },
            // {
            //     name: 'potfilePath',
            //     arg: '/opt/potfiles/toto.txt',
            // },
        ],
        wordlist: '/opt/kracceis/wordlists/rockyou.txt',
        hashList: {
            name: 'test2',
            hashs: [
                '90B0563973F20A99F6CC4AA9790E5111',
                '9869A2E7E99474B763301F00409058DB',
            ],
        },
    };
    const hashcat = new Hashcat({ exec: execOptions });
    hashcat.exec();
    // setTimeout(() => {
    //     hashcat.stop();
    // }, 100000);
    // setTimeout(
    //     () => { hashcat.stop(); }, 
    //     1000);
}

(() => {
    try {
        main();
    } catch (e) {
        logger.error(e);
    }
})();
