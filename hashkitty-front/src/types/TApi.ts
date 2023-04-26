import {
   TAttackMode,
   THashType,
   THashlist,
   TTask,
   TTemplate,
} from './TypesORM';

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
   taskInfos: Partial<{
      name: string;
   }>;
   exitInfo: {
      message: string;
      isError: boolean;
   };
   runningStatus: Partial<THashcatRunningStatus>;
};

type ApiOptionsFormData = {
   attackModeId: number;
   breakpointGPUTemperature: number;
   wordlistName: string;
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

export type TaskUpdate = BaseCreate & {
   hashlistId: number;
   options: ApiOptionsFormData;
   templateTaskId?: number;
};

export type TemplateUpdate = BaseCreate & {
   options: ApiOptionsFormData;
};

type BaseCreate = {
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

export type ResponseBase = {
   message: string;
   success: boolean;
   httpCode: number;
   error?: string;
};

export type ResponseStatus = ResponseBase & {
   status: THashcatStatus;
};

// TODO ALL BELOW - Add this type to hooks
export type ResponseCrackedPasswds = ResponseBase & {
   passwds: string[];
};

export type ResponseList<
   List extends
      | THashType
      | TAttackMode
      | TTask
      | Notification
      | ListItem<ListItemAvailable>,
> = ResponseBase & {
   items: List[];
};
