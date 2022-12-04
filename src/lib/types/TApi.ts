import { ThashcatAllowedFlags } from './THashcat';

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
