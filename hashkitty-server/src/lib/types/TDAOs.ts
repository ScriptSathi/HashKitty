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
   wordlistName?: string;
   workloadProfileId: number;
   kernelOpti: boolean;
   CPUOnly: boolean;
   combinatorWordlistName?: string;
   rules?: string[];
   potfileName?: string;
   maskQuery?: string;
   maskFilename?: string;
   customCharset1?: string;
   customCharset2?: string;
   customCharset3?: string;
   customCharset4?: string;
};

export type ApiTaskDelete = TDaoById;

export type ApiTemplateTaskDelete = TDaoById;

export type TDaoHashlistDelete = TDaoById;
export type TDaoHashlistCreate = TDaoCreate & {
   path: string;
   hashTypeId: number;
};
export type TDaoHashTypeCreate = { typeNumber: number } & TDaoCreate;

export type NotificationType =
   | 'success'
   | 'error'
   | 'warning'
   | 'info'
   | 'debug';
