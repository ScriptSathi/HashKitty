import path = require('path');
import { DataSource } from 'typeorm';

import { attackModes } from '../data/attackModes';
import { hashTypes } from '../data/hashtypes';
import { Hashlist } from '../entity/Hashlist';
import { Options } from '../entity/Options';
import { Task } from '../entity/Task';
import { workloadProfile } from '../data/workloadProfiles';
import { TemplateTask } from '../entity/TemplateTask';
import { Wordlist } from '../entity/Wordlist';
import { AttackMode } from '../entity/AttackMode';

export class Factory {
    private appDataSource: DataSource;

    constructor(appDataSource: DataSource) {
        this.appDataSource = appDataSource;
    }

    public async fakeAll(numberOfFakes: number): Promise<void> {
        this.fakeHashLists(numberOfFakes);
        this.fakeWordLists(numberOfFakes);
        await this.fakeTasks(numberOfFakes);
        await this.fakeTemplateTasks(numberOfFakes % 2);
    }

    public async fakeTasks(numberOfFakeTasks: number): Promise<void> {
        for (const i in [...Array(numberOfFakeTasks).keys()]) {
            const task = new Task();
            task.options = await this.createFakeOption();
            task.templateTaskId = null;
            // if (Math.random() < 0.5) {
            // } else {
            //     const templateTasks = this.appDataSource.getRepository(TemplateTask).find();
            //     // const templateTask = this.createFakeTemplateTask();
            //     // task.templateTaskId =
            // }
            task.name = `${this.makeFakeString(5)}-${i}`;
            task.description =
                Math.random() < 0.5 ? this.makeFakeString(50) : '';
            task.hashTypeId = parseInt(
                hashTypes[Math.random() * hashTypes.length].id
            );
            task.isfinished = Math.random() < 0.5;
            task.lastestModification = this.randomDate();
            task.createdAt = this.randomDate();
            if (Math.random() < 0.5) task.endeddAt = this.randomDate(2022);
            this.appDataSource.manager.save(task);
        }
    }

    public async fakeTemplateTasks(numberOfFakeTasks: number): Promise<void> {
        for (let i = 0; i < numberOfFakeTasks; i++) {
            const options = this.createFakeOption();
            this.appDataSource.manager.save(options);

            // const templateTask = new TemplateTask();
            // templateTask.name = `${this.makeFakeString(5)}`;
            // templateTask.description = this.makeFakeString(50);
            // templateTask.lastestModification = this.randomDate();
            // templateTask.createdAt = this.randomDate();
            // templateTask.options = options;
            // this.appDataSource.manager.save(templateTask);
        }
    }

    public fakeHashLists(numberOfFakeHashlist: number): void {
        for (const i in [...Array(numberOfFakeHashlist).keys()]) {
            const hashlist = new Hashlist();
            hashlist.name = `${this.makeFakeString(5)}-${i}`;
            hashlist.description = this.makeFakeString(50);
            hashlist.numberOfCrackedPasswords = Math.random() * 20;
            hashlist.path = path.join(
                `/${this.makeFakeString(5)}`,
                this.makeFakeString(5),
                this.makeFakeString(5),
                this.makeFakeString(5)
            );
            hashlist.lastestModification = this.randomDate();
            hashlist.createdAt = this.randomDate();
            this.appDataSource.manager.save(hashlist);
        }
    }

    public fakeWordLists(numberOfFakeHashlist: number): void {
        for (const i in [...Array(numberOfFakeHashlist).keys()]) {
            const wordlist = new Wordlist();
            wordlist.name = `${this.makeFakeString(5)}-${i}`;
            wordlist.description = this.makeFakeString(50);
            wordlist.path = path.join(
                `/${this.makeFakeString(5)}`,
                this.makeFakeString(5),
                this.makeFakeString(5),
                this.makeFakeString(5)
            );
            this.appDataSource.manager.save(wordlist);
        }
    }

    private randomDate(year = 2021) {
        const start = new Date(year, 0, 1);
        return new Date(
            start.getTime() +
                Math.random() * (new Date().getTime() - start.getTime())
        );
    }

    private makeFakeString(length: number): string {
        let result = '';
        const characters =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(
                Math.floor(Math.random() * characters.length)
            );
            result += Math.random() < 0.15 ? ' ' : '';
        }
        return result;
    }

    private async createFakeOption(): Promise<Options> {
        const options = new Options();
        const attackModes =
            await this.tryAgainOrCreateListAndReturn<AttackMode>(
                AttackMode,
                this.fakeWordLists
            );
        options.attackModeId =
            attackModes[Math.random() * attackModes.length].type;
        options.CPUOnly = Math.random() < 0.3;
        options.breakpointGPUTemperature = Math.random() * 50 + 40;
        options.kernelOpti = Math.random() < 0.3;
        options.workloadProfileId =
            workloadProfile[Math.random() * workloadProfile.length].profileId;

        const wordlists = await this.tryAgainOrCreateListAndReturn<Wordlist>(
            Wordlist,
            this.fakeWordLists
        );
        options.wordlistId = wordlists[Math.random() * wordlists.length].id;
        return options;
    }

    private async tryAgainOrCreateListAndReturn<T>(
        EntityList: any,
        creationListFn: (numberOfFakeHashlist: number) => void,
        tryAgainCount = 0
    ): Promise<T[]> {
        try {
            return (await this.appDataSource
                .getRepository(EntityList)
                .find()) as T[];
        } catch (e) {
            if (tryAgainCount > 0) {
                throw e;
            }
            creationListFn(1);
            this.tryAgainOrCreateListAndReturn(
                this.appDataSource.getRepository(EntityList).find(),
                creationListFn,
                1
            );
        }
        return (await this.appDataSource
            .getRepository(EntityList)
            .find()) as T[];
    }
}
