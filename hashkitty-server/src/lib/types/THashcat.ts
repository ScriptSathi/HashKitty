export type ThashcatAllowedFlags =
    | 'hashType'
    | 'attackMode'
    | 'restore'
    | 'runtime'
    | 'session'
    | 'outputFile'
    | 'outputFormat'
    | 'show'
    | 'left'
    | 'potfilePath'
    | 'speedOnly'
    | 'progressOnly'
    | 'kernelOptimisation'
    | 'workloadProfile'
    | 'kernelAccel'
    | 'kernelLoops'
    | 'kernelThreads'
    | 'temperatureAbort'
    | 'rulesFiles'
    | 'statusJson'
    | 'quiet'
    | 'restoreDisable';

export type ThashcatParams = {
    [key in ThashcatAllowedFlags]: string;
};

export type THashcatPartialStatus = {
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
    isRunning: boolean;
    ended: boolean;
    status: Partial<THashcatPartialStatus>;
};
