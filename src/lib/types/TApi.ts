import { ThashcatAllowedFlags } from './THashcat';

export type TEndpoint = 'exec' | 'restore';

export type TflagOption<T> = {
    name: ThashcatAllowedFlags;
    arg?: T;
};

export type ThashList = {
    name: string;
    hashs: string[];
};

export type TExecEndpoint = {
    wordlist: string;
    hashList: ThashList;
    flags: TflagOption<string | number>[];
};

export type TRestoreEndpoint = TflagOption<string>;
