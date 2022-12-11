import path = require('path');
import { DataSource } from 'typeorm';

import { Hashlist } from './entity/Hashlist';
import { Options } from './entity/Options';
import { Task } from './entity/Task';
import { TemplateTask } from './entity/TemplateTask';
import { Wordlist } from './entity/Wordlist';
import { AttackMode } from './entity/AttackMode';
import { WorkloadProfile } from './entity/WorkloadProfile';
import { Migration } from './Migration';
import { HashType } from './entity/HashType';

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
            if (Math.random() < 0) {
                const options = await this.createFakeOption();
                this.appDataSource.manager.save(options);
                task.options = options;
            } else {
                const templateTasks =
                    await this.createListIfNotExist<TemplateTask>(
                        TemplateTask,
                        this.fakeTemplateTasks,
                        {
                            relations: {
                                options: true,
                            },
                        }
                    );
                const templateTask =
                    templateTasks[
                        this.getRandomValueInRange(templateTasks.length)
                    ];
                task.templateTaskId = templateTask.id;
                task.options = templateTask.options;
            }
            const hashlists = await this.createListIfNotExist<Hashlist>(
                Hashlist,
                this.fakeHashLists
            );
            task.hashlistId =
                hashlists[this.getRandomValueInRange(hashlists.length)].id;
            task.name = `${this.makeFakeString(5)}-${i}`;
            task.description =
                Math.random() < 0.5 ? this.makeFakeString(50) : '';

            const hashTypes = await this.createListIfNotExist<HashType>(
                HashType,
                this.migration.migrateHashTypes
            );
            task.hashTypeId =
                hashTypes[this.getRandomValueInRange(hashTypes.length)].id;
            task.isfinished = Math.random() < 0.5 ? 0 : 1;
            task.lastestModification = this.randomDate();
            task.createdAt = this.randomDate();
            if (Math.random() < 0.5) task.endeddAt = this.randomDate(2022);
            this.appDataSource.manager.save(task);
        }
    }

    public fakeTemplateTasks = async (
        numberOfFakeTasks: number
    ): Promise<void> => {
        for (let i = 0; i < numberOfFakeTasks; i++) {
            const options = await this.createFakeOption();
            this.appDataSource.manager.save(options);
            const templateTask = new TemplateTask();
            templateTask.name = `${this.makeFakeString(5)}`;
            templateTask.description = this.makeFakeString(50);
            templateTask.lastestModification = this.randomDate();
            templateTask.createdAt = this.randomDate();
            templateTask.options = options;
            this.appDataSource.manager.save(templateTask);
        }
    };

    private randomDate(year = 2021) {
        const start = new Date(year, 0, 1);
        return new Date(
            start.getTime() +
                Math.floor(
                    Math.random() * (new Date().getTime() - start.getTime())
                )
        );
    }

    private makeFakeString(length: number): string {
        let result = '';
        const characters =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(
                this.getRandomValueInRange(characters.length)
            );
            result += Math.random() < 0.15 ? ' ' : '';
        }
        return result;
    }

    private async createFakeOption(): Promise<Options> {
        const options = new Options();
        const attackModes = await this.createListIfNotExist<AttackMode>(
            AttackMode,
            this.migration.migrateAttackModes
        );
        const workloadProfile =
            await this.createListIfNotExist<WorkloadProfile>(
                WorkloadProfile,
                this.fakeWorkloadProfile
            );
        options.attackModeId =
            attackModes[this.getRandomValueInRange(attackModes.length)].id;
        options.CPUOnly = Math.random() < 0.3;
        options.breakpointGPUTemperature = Math.floor(Math.random() * 50 + 40);
        options.kernelOpti = Math.random() < 0.3;
        options.workloadProfileId =
            workloadProfile[
                this.getRandomValueInRange(workloadProfile.length)
            ].id;
        const wordlists = await this.createListIfNotExist<Wordlist>(
            Wordlist,
            this.fakeWordLists
        );
        options.wordlistId =
            wordlists[this.getRandomValueInRange(wordlists.length)].id;
        return options;
    }

    private async createListIfNotExist<T extends ObjectLiteral>(
        EntityList: EntityTarget<T>,
        creationListFn: (numberOfFakeToCreate: number) => Promise<void>,
        findObject = {},
        tryAgainCount = 0
    ): Promise<T[]> {
        let req: T[] = [];
        try {
            req = await this.appDataSource
                .getRepository(EntityList)
                .find(findObject);
        } catch (e) {
            if (tryAgainCount > 0) {
                throw e;
            }
        } finally {
            if (req.length === 0) {
                creationListFn(1);
                await this.createListIfNotExist(
                    EntityList,
                    creationListFn,
                    findObject,
                    1
                );
            }
        }
        return req;
    }

    private getRandomValueInRange(range: number): number {
        return Math.floor(Math.random() * range);
    }

    private fakeWordLists = async (
        numberOfFakeToCreate: number
    ): Promise<void> => {
        for (const i in [...Array(numberOfFakeToCreate).keys()]) {
            const wordlist = new Wordlist();
            wordlist.name = `${this.makeFakeString(5)}-${i}`;
            wordlist.description = this.makeFakeString(50);
            wordlist.path = path.join(
                `/${this.makeFakeString(5)}`,
                this.makeFakeString(5),
                this.makeFakeString(5),
                this.makeFakeString(5)
            );
            await this.appDataSource.manager.save(wordlist);
        }
    };

    private fakeHashLists = async (
        numberOfFakeToCreate: number
    ): Promise<void> => {
        for (const i in [...Array(numberOfFakeToCreate).keys()]) {
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
            await this.appDataSource.manager.save(hashlist);
        }
    };

    private fakeWorkloadProfile = async (
        numberOfFakeToCreate: number
    ): Promise<void> => {
        for (let i = 0; i < numberOfFakeToCreate; i++) {
            const workloadProfile = new WorkloadProfile();
            workloadProfile.profileId = this.getRandomValueInRange(4);
            workloadProfile.powerConsumation = this.makeFakeString(10);
            workloadProfile.desktopImpact = this.makeFakeString(10);
            await this.appDataSource.manager.save(workloadProfile);
        }
    };
}
