export type ThashcatAllowedFlags = keyof THashcatFlags;

export type THashcatFlags = {
    hashType: THashcatFlagsObjectFull;
    attackMode: THashcatFlagsObjectFull;
    restore: THashcatFlagsObjectNoAlias;
    runtime: THashcatFlagsObjectNoAlias;
    session: THashcatFlagsObjectNoAlias;
    outputFile: THashcatFlagsObjectFull;
    outputFormat: THashcatFlagsObjectNoAlias;
    show: THashcatFlagsObjectNoAlias;
    left: THashcatFlagsObjectNoAlias;
    increment: THashcatFlagsObjectFull;
    incrementMin: THashcatFlagsObjectNoAlias;
    incrementMax: THashcatFlagsObjectNoAlias;
    potfilePath: THashcatFlagsObjectNoAlias;
    speedOnly: THashcatFlagsObjectNoAlias;
    cpuOnly: THashcatFlagsObjectFull;
    progressOnly: THashcatFlagsObjectNoAlias;
    kernelOptimisation: THashcatFlagsObjectFull;
    workloadProfile: THashcatFlagsObjectFull;
    kernelAccel: THashcatFlagsObjectFull;
    kernelLoops: THashcatFlagsObjectFull;
    kernelThreads: THashcatFlagsObjectFull;
    temperatureAbort: THashcatFlagsObjectNoAlias;
    statusJson: THashcatFlagsObjectNoAlias;
    statusTimer: THashcatFlagsObjectNoAlias;
    status: THashcatFlagsObjectNoAlias;
    quiet: THashcatFlagsObjectNoAlias;
    restoreFilePath: THashcatFlagsObjectNoAlias;
    restoreDisable: THashcatFlagsObjectNoAlias;
    ruleLeft: THashcatFlagsObjectFull;
    ruleRight: THashcatFlagsObjectFull;
    rulesFile: THashcatFlagsObjectFull;
    customCharset1: THashcatFlagsObjectFull;
    customCharset2: THashcatFlagsObjectFull;
    customCharset3: THashcatFlagsObjectFull;
    customCharset4: THashcatFlagsObjectFull;
};

export type ThashcatParams = {
    [Prop in keyof THashcatFlags]: THashcatFlags[Prop] extends THashcatFlagsObjectFull
        ? THashcatFlags[Prop]
        : Omit<THashcatFlags[Prop], 'alias'>;
};

type THashcatFlagsObjectFull = {
    alias: string;
    flag: string;
    needAParam: boolean;
    defaultValue?: string;
};

type THashcatFlagsObjectNoAlias = Omit<THashcatFlagsObjectFull, 'alias'>;

export type THashcatRunningStatus = {
    session: string;
    guess: {
        [key: string]: string | number | null | boolean;
    };
    status: number;
    target: string;
    progress: number[];
    restore_point: number;
    recovered_hashes: [number, number];
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
