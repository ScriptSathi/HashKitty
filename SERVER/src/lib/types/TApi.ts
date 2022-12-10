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

export type TExecEndpoint = {
    wordlist: string;
    hashList: ThashList;
    flags: TflagOption[];
};

export type TRestoreEndpoint = TflagOption<string, 'session'>;

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

export type TresponseData =
    | string
    | number
    | boolean
    | Object
    | Object[]
    | number[]
    | boolean[]
    | string[];

type TMessage = Partial<
    Record<TresponsesMessagesObjectKeys | 'error', TresponseData>
>;

export type TresponseMessage = {
    httpCode: number;
    message: TMessage;
};

export type TresponseMessageWithData<
    T extends TresponseMessagesTypesAgregator
> = {
    httpCode: number;
    message: (data: T | TresponseMessagesTypesAgregator) => TMessage;
};

export type TresponsesErrorMessagesNames =
    | 'DBrelationNotFound'
    | 'unexpectedError';

export type TresponsesMessagesObjectKeys = 'success' | 'fail';

export type TresponseErrorMessages = {
    [key in TresponsesErrorMessagesNames]: TresponseMessage;
};

type TresponsesMessagesObject<
    key,
    T extends TresponseMessagesTypesAgregator
> = key extends 'fail'
    ? TresponseMessageWithData<void>
    : TresponseMessageWithData<T>;

export type TresponsesNamesWithDataOMessagesObjectKeys<
    T extends TresponseMessagesTypesAgregator
> = {
    [key in TresponsesMessagesObjectKeys]: TresponsesMessagesObject<key, T>;
};

export type TresponsesNamesWitMessagesObjectKeys = keyof TresponseMessages;

export type TresponseMessages = {
    status: TresponsesNamesWithDataOMessagesObjectKeys<THashcatStatus>;
    exec: TresponsesNamesWithDataOMessagesObjectKeys<void>;
    stop: TresponsesNamesWithDataOMessagesObjectKeys<void>;
};

export type TresponseMessagesTypesAgregator = void | THashcatStatus;
