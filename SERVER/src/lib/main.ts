import 'reflect-metadata';
import { HttpServer } from './API/HttpServer';
import { Constants } from './Constants';
import { AppDataSource } from './ORM/data-source';
import { Task } from './ORM/entity/Task';
import { Wordlist } from './ORM/entity/Wordlist';

async function main(): Promise<void> {
    // console.log(
    //     JSON.stringify({
    //         "id": 1,
    //         "name": "nb59 s",
    //         "description": "V Xe G0B 7yJICr10kSwm z2Yz s98N w3j j a31G83h8Kqf 1c9gGW8O C",
    //         "createdAt": "2022-10-07",
    //         "lastestModification": "2022-04-13",
    //         "options": {
    //           "id": 68,
    //           "breakpointGPUTemperature": 90,
    //           "kernelOpti": true,
    //           "CPUOnly": false,
    //           "ruleName": "",
    //           "maskQuery": "",
    //           "maskFilename": ""
    //         }
    //       }
    //       )
    // );

    new HttpServer(
        Constants.defaultApiConfig,
        await AppDataSource.initialize()
    ).listen();
}

main();
