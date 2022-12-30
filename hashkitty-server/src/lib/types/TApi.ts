import { ThashcatAllowedFlags, THashcatStatus } from './THashcat';

export type TEndpoint = 'exec' | 'restore';

export type TflagOption<T = string | number, S = ThashcatAllowedFlags> = {
    name: S;
    arg?: T;
};

export type ThashList = {
    name: string;
    hashs: string[];
};

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

type TMessage<ResponseFormat extends AllowedResponseFormat> = Partial<
    Record<TresponsesMessagesObjectKeys | 'error', ResponseFormat>
>;

type TresponsesErrorMessageObjects = {
    httpCode: number;
    message: TMessage<string>;
};

export type TresponseMessage<ResponseFormat extends AllowedResponseFormat> = {
    httpCode: number;
    message: TMessage<ResponseFormat>;
};

type TresponseMessageObject<ResponseFormat extends AllowedResponseFormat> = {
    httpCode: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    message: (data: any) => TMessage<ResponseFormat>;
};

export type TresponsesErrorMessagesNames =
    | 'DBrelationNotFound'
    | 'unexpectedError';

export type TresponsesMessagesObjectKeys = 'success' | 'fail';

export type TresponseErrorMessages = {
    [key in TresponsesErrorMessagesNames]: TresponsesErrorMessageObjects;
};

export type TresponsesNamesMessagesObjectKeys<
    ResponseFormat extends AllowedResponseFormat
> = {
    success: TresponseMessageObject<ResponseFormat>;
    fail: TresponseMessageObject<string>;
};

export type TresponsesNamesWitMessagesObjectKeys = keyof TresponseMessages;

export type TresponseMessages = {
    status: TresponsesNamesMessagesObjectKeys<THashcatStatus>;
    exec: TresponsesNamesMessagesObjectKeys<string>;
    stop: TresponsesNamesMessagesObjectKeys<string>;
    create: TresponsesNamesMessagesObjectKeys<string>;
    delete: TresponsesNamesMessagesObjectKeys<string>;
    update: TresponsesNamesMessagesObjectKeys<string>;
};

export type AllowedResponseFormat = string | THashcatStatus;

export type TresponseMessagesTypesAgregator =
    | AllowedResponseFormat
    | number
    | void;

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
    ruleName?: string;
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
