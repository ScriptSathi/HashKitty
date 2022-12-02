import { ThashcatAllowedFlags } from './THashcat';

export type TEndpoint = 'standard' | 'benchmark';

export type TflagOption = {
    name: ThashcatAllowedFlags;
    arg: string | number;
};

export type ThashList = {
    name: string;
    hashs: string[];
};

export type TStandardEndpoint = {
    wordlist: string;
    hashList: ThashList;
    flags: TflagOption[];
};
