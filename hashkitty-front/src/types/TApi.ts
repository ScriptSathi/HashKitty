import { THashlist, TTask, TTemplate } from './TypesORM';

export type THashcatRunningStatus = {
   session: string;
   guess: {
      [key: string]: string | number | null | boolean;
   };
   status: number;
   target: string;
   progress: number[];
   restore_point: number;
   recovered_hashes: number[];
   recovered_salts: number[];
   rejected: number;
   devices: {
      device_id: number;
      device_name: string;
      device_type: string;
      speed: number;
      temp: number;
      util: number;
   }[];
   time_start: number;
   estimated_stop: number;
};

export type THashcatStatus = {
   processState: 'running' | 'pending' | 'stopped';
   exitInfo: string;
   runningStatus: THashcatRunningStatus;
};

type ApiOptionsFormData = {
   attackModeId: number;
   breakpointGPUTemperature: number;
   wordlistName: string;
   workloadProfileId: number;
   kernelOpti: boolean;
   CPUOnly: boolean;
   rules?: string[];
   potfileName?: string;
   maskQuery?: string;
   maskFilename?: string;
};

export type TaskUpdate = TBaseCreateTask & {
   hashlistId: number;
   options: ApiOptionsFormData;
   templateTaskId?: number;
};

type TBaseCreateTask = {
   id?: number;
   name: string;
   description: string;
};

export type UploadFileType =
   | 'rule'
   | 'mask'
   | 'wordlist'
   | 'hashlist'
   | 'potfile';

type UploadFile = {
   fileName: string;
   file: File;
};

export type ApiImportList = UploadFile & {
   type: UploadFileType;
   hashTypeId?: number;
};

export type ListBase = {
   id: number;
   name: string;
};

export type ListItemAvailable = TTemplate | THashlist | ListBase;

export type ListItem<Item extends ListItemAvailable> = {
   item: Item;
   canBeDeleted: boolean;
   bindTo: TTask[];
};
