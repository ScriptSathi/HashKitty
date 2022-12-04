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
