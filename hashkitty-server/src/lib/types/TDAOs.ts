import { Options } from '../ORM/entity/Options';

export type TDaoCreate = {
    name: string;
    description: string;
};

export type TDaoCreateAttackMode = {
    name: string;
    mode: number;
};

type PatialSanitizeCheck = {
    hasSucceded: boolean;
    message: string;
};

export type TsanitizeCheck<T = undefined> = T extends undefined
    ? PatialSanitizeCheck
    : PatialSanitizeCheck & { data: T };

export type TDaoById = { id: number };

export type ApiOptionsFormData = {
    attackModeId: number;
    breakpointGPUTemperature: number;
    wordlistName: string;
    workloadProfileId: number;
    kernelOpti: boolean;
    CPUOnly: boolean;
    ruleName?: string;
    potfileName?: string;
    maskQuery?: string;
    maskFilename?: string;
};

export type ApiTaskCreate = TDaoCreate & {
    hashlistId: number;
    options: ApiOptionsFormData;
    templateTaskId?: number;
};
export type ApiTaskUpdate = ApiTaskCreate & TDaoById;
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
export type TDaoHashTypeCreate = { typeNumber: number } & TDaoCreate;
