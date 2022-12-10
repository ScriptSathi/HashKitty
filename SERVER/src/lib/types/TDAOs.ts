import { Options } from '../ORM/entity/Options';

export type TDaoCreate = {
    name: string;
    description: string;
};

export type TDaoTaskCreate = TDaoCreate & {
    hashTypeId: number;
    hashlistId: number;
    options?: Options;
    templateTaskId?: number;
};
