import { Options } from '../ORM/entity/Options';

export type TDaoCreate = {
    name: string;
    description: string;
};

export type TsanitizeCheckById = {
    hasSucceded: boolean;
    message: string;
};

export type TsanitizeCheck = {
    taskData: TDaoTaskCreate;
} & TsanitizeCheckById;

export type TDaoById = { id: number };

export type TDaoTaskCreate = TDaoCreate & {
    hashTypeId: number;
    hashlistId: number;
    options?: Options;
    templateTaskId?: number;
};
export type TDaoTaskUpdate = TDaoTaskCreate & TDaoById;
export type TDaoTaskDelete = TDaoById;

export type TDaoTemplateTaskCreate = TDaoCreate & {
    options?: Options;
};
export type TDaoTemplateTaskUpdate = TDaoTemplateTaskCreate & TDaoById;
export type TDaoTemplateTaskDelete = TDaoById;

export type TDaoHashlistDelete = TDaoById;
export type TDaoHashlistCreate = TDaoCreate & {
    path: string;
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
