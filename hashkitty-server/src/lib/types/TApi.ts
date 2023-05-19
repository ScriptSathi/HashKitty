import { Response } from 'express';
import { Hashlist } from '../ORM/entity/Hashlist';
import { Wordlist } from '../ORM/entity/Wordlist';

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
   listen(): void;
   close(): Promise<void>;
   checkHealth(): void;
}

export type StreamEvent = { initTimestamp: number; res: Response };

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
   endeddAt?: Date | null;
};

export type Options = {
   id: number;
   attackModeId: TAttackMode;
   breakpointGPUTemperature: number;
   combinatorWordlistId: TWordlist;
   workloadProfileId: TWorkloadProfile;
   kernelOpti: Boolean;
   CPUOnly: Boolean;
   wordlistId?: TWordlist;
   rules?: string;
   potfileName?: string;
   maskQuery?: string;
   maskFilename?: string;
   customCharset1?: string;
   customCharset2?: string;
   customCharset3?: string;
   customCharset4?: string;
};

export type TTemplate = {
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

export type AttackModeAvailable = 0 | 1 | 3 | 6 | 7 | 9;

export type TAttackMode = {
   id: number;
   name: string;
   mode: AttackModeAvailable;
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

export type HashkittyStoredFilesType = 'restore' | UploadFileType;

export type ListBase = {
   id: number;
   name: string;
};

export type ListItem = {
   item: Partial<TTemplate | Wordlist | Hashlist | ListBase>;
   canBeDeleted: boolean;
   bindTo: TTask[];
};
