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
            //     name: 'restoreDisable',
            // },
            // {
            //     name: 'potfilePath',
            //     arg: '/opt/potfiles/toto.txt',
            // },
        ],
        wordlist: '/opt/kracceis/wordlists/rockyou.txt',
        hashList: {
            name: 'test2',
            hashs: [
                '90B0563973F20399F6CC4AA9790E5111',
                '9869A2E7E99474C763301F00409058DB',
                '9869A2E7E99474B743301F00409058DB',
                '9869A2E7E99478B763301F00409058DB',
                '9869A2E7E99474B763101F00409058DB',
                '9869A2E7E99874B763301F00809058DB',
                '9869A2E7E99474B763301F00409058DB',
                '9869A2E7EB9474B763301F00009058DB',
                '9869A2E7EB9474B763301F00009058DB',
                '9869A2E7EB9474B763301F00009058DB',
                '9869A2E7EB9474B763301F00009058DB',
                '9869A2E7EB9474B763301F00009058DB',
                '9869A2E7EB9474B763301F00009058DB',
                '9869A2E7EB9474B763301F00009058DB',
                '9869A2E7EB9474B763301F00009058DB',
                '9869A2E7EB9474B763301F00009058DB',
                '9869A2E7EB9474B963301F00009058DB',
                '9869A2E7EB9474B763301F00009058DB',
                '9869A2E7EB9474B767301F00009058DB',
                '9869A2E7EB9474B763001F00009058DB',
                '1869A2E7EB9474B7637301F0009058DB',
                '9869A2E7EB9474B7633A0F00009058DB',
            ],
        },
    };
    const hashcat = new Hashcat({ exec: execOptions });
    hashcat.exec();
}

(() => {
    try {
        main();
    } catch (e) {
        logger.error(e);
    }
})();
