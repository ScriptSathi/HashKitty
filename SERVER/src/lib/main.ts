import 'reflect-metadata';
import { HttpServer } from './API/HttpServer';
import { Constants } from './Constants';
import { AppDataSource } from './ORM/data-source';
import { Task } from './ORM/entity/Task';
import { Wordlist } from './ORM/entity/Wordlist';

async function main(): Promise<void> {
    // console.log(
    //     JSON.stringify({
    //         id: 3,
    //         name: 'thisIsGzzzzztataea',
    //         description: 'testa',
    //         options: {
    //           breakpointGPUTemperature: 81,
    //           kernelOpti: true,
    //           CPUOnly: false,
    //           ruleName: null,
    //           maskQuery: null,
    //           maskFilename: null
    //         },
    //         templateTaskId: 1,
    //         hashTypeId: 1,
    //         hashlistId: 10
    //       }
    //       )
    // );

    // await AppDataSource.createQueryBuilder()
    //     .update(Task)
    //     .set({
    //         name: 'bonjiyr',
    //         description: 'aa',
    //         // lastestModification: new Date(),
    //         // hashTypeId: taskData.hashTypeId,
    //         // hashlistId: taskData.hashlistId,
    //         // templateTaskId: taskData.templateTaskId,
    //     })
    //     .where('id = :id', { id: 3 })
    //     .execute();
    new HttpServer(
        Constants.defaultApiConfig,
        await AppDataSource.initialize()
    ).listen();
}

main();
