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
    | 'rulesFiles';

export type ThashcatParams = {
    [key in ThashcatAllowedFlags]: string;
};
