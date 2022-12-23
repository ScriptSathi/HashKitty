import { Options } from '../ORM/entity/Options';
import { Task } from '../ORM/entity/Task';
import { TemplateTask } from './TApi';

export type TDaoCreate = {
    name: string;
    description: string;
};

type PatialSanitizeCheckById = {
    hasSucceded: boolean;
    message: string;
};

export type TsanitizeCheckById<T = undefined> = T extends undefined
    ? PatialSanitizeCheckById
    : PatialSanitizeCheckById & { data: T };

export type TDaoById = { id: number };

export type TDaoTaskCreate = TDaoCreate & {
    hashlistId: number;
    options?: Options;
    templateTaskId?: number;
};
export type TDaoTaskUpdate = TDaoTaskCreate & TDaoById;
export type TDaoTaskDelete = TDaoById;

export type TDaoTemplateTaskCreate = TDaoCreate & {
    options: Options;
};
export type TDaoTemplateTaskUpdate = TDaoTemplateTaskCreate & TDaoById;
export type TDaoTemplateTaskDelete = TDaoById;

export type TDaoHashlistDelete = TDaoById;
export type TDaoHashlistCreate = TDaoCreate & {
    path: string;
    hashTypeId: number;
};

export type TDaoAllPossibleInputs =
    | TDaoHashlistCreate
    | TDaoHashlistDelete
    | TDaoTemplateTaskDelete
    | TDaoTemplateTaskUpdate
    | TDaoTemplateTaskCreate
    | TDaoTaskUpdate
    | TDaoTaskCreate
    | TDaoTaskDelete;
