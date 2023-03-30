import { AttackMode } from "../ORM/entity/AttackMode";
import { HashType } from "../ORM/entity/HashType";
import { Hashlist } from "../ORM/entity/Hashlist";
import { Notification } from "../ORM/entity/Notification";
import { Task } from "../ORM/entity/Task";

export type TEndpoint = 'exec' | 'restore';

export interface ISslConfig {
   use: boolean;
   key?: string;
   cert?: string;
}

type ServerPort = string | number;

export type THttpServerConfig = {
   ssl?: ISslConfig;
   port: ServerPort;
};

export interface IHttpServer {
   listen(): Promise<void>;
   close(): Promise<void>;
   checkHealth(): void;
}

// Is the same as ORM Task but with all relations inside instead of foreign keys
export type TTask = {
   id: number;
   name: string;
   options: Options;
   hashlistId: THashlist;
   createdAt: string;
   lastestModification: string;
   isfinished: boolean;
   description?: string;
   templateTaskId?: TemplateTask;
   endeddAt?: Date | null;
};

export type Options = {
   id: number;
   attackModeId: TAttackMode;
   breakpointGPUTemperature: number;
   wordlistId: TWordlist;
   workloadProfileId: TWorkloadProfile;
   kernelOpti: Boolean;
   CPUOnly: Boolean;
   rules?: string;
   potfileName?: string;
   maskQuery?: string;
   maskFilename?: string;
};

export type TemplateTask = {
   id: number;
   name: string;
   description?: string;
   createdAt: string;
   lastestModification: string;
};

export type THashType = {
   id: number;
   typeNumber: number;
   name: string;
   description: string;
};

export type THashlist = {
   id: number;
   name: string;
   description: string;
   hashTypeId: THashType;
   path: string;
   createdAt: string;
   lastestModification: string;
   crackedOutputFileName: string;
   numberOfCrackedPasswords: number;
};

export type TWordlist = {
   id: number;
   name: string;
   description: string;
   path: string;
};

export type TAttackMode = {
   id: number;
   name: string;
   mode: number;
};

export type TWorkloadProfile = {
   id: number;
   profileId: number;
   desktopImpact: string;
   powerConsumation: string;
};

export type UploadFileType =
   | 'rule'
   | 'mask'
   | 'wordlist'
   | 'hashlist'
   | 'potfile';

export type ListItem = {
   item: 
   | HashType
   | TemplateTask
   | Task
   | Hashlist
   | Notification
   | AttackMode
   | string;
   canBeDeleted: boolean;
   bindTo: TTask[];
};
