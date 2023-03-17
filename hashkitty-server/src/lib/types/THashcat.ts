export type THashcatFlags = {
    hashType: FlagStandard;
    attackMode: FlagStandard;
    restore: FlagWithNoAlias;
    runtime: FlagWithNoAlias;
    session: FlagWithNoAlias;
    outputFile: FlagStandard;
    outputFormat: FlagWithNoAlias;
    show: FlagWithNoAlias;
    left: FlagWithNoAlias;
    increment: FlagStandard;
    incrementMin: FlagWithNoAlias;
    incrementMax: FlagWithNoAlias;
    potfilePath: FlagWithNoAlias;
    speedOnly: FlagWithNoAlias;
    cpuOnly: FlagStandard;
    progressOnly: FlagWithNoAlias;
    kernelOptimisation: FlagStandard;
    workloadProfile: FlagStandard;
    kernelAccel: FlagStandard;
    kernelLoops: FlagStandard;
    kernelThreads: FlagStandard;
    temperatureAbort: FlagWithNoAlias;
    statusJson: FlagWithNoAlias;
    statusTimer: FlagWithNoAlias;
    status: FlagWithNoAlias;
    quiet: FlagWithNoAlias;
    restoreFilePath: FlagWithNoAlias;
    restoreDisable: FlagWithNoAlias;
    ruleLeft: FlagStandard;
    ruleRight: FlagStandard;
    rulesFile: FlagStandard;
    customCharset1: FlagStandard;
    customCharset2: FlagStandard;
    customCharset3: FlagStandard;
    customCharset4: FlagStandard;
};

export type ThashcatAllowedFlags = keyof THashcatFlags;

// export type ThashcatParams = {
//     [Prop in keyof THashcatFlags]: THashcatFlags[Prop] extends FlagStandard
//         ? THashcatFlags[Prop]
//         : Omit<THashcatFlags[Prop], 'alias'>;
// };

type FlagStandard = {
    alias: string;
    flag: string;
    needAParam: boolean;
    isRepeatableFlag?: boolean;
    defaultValue?: string;
};

type FlagWithNoAlias = Omit<FlagStandard, 'alias'>;

export type PartialCmdData = {
    key: ThashcatAllowedFlags;
    value?: string | number | string[];
};

export type CmdData = PartialCmdData & {
    flagData: THashcatFlags[PartialCmdData['key']];
};

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
    exitInfo: {
        message: string;
        isError: boolean;
    };
    runningStatus: THashcatRunningStatus;
};
