import { ThashcatParams } from '../types/THashcat';

export const hashcatParam = {
    hashType: {
        alias: 'm',
        flag: 'hash-type',
        needAParam: true,
    },
    attackMode: {
        alias: 'a',
        flag: 'attack-mode',
        needAParam: true,
    },
    restore: {
        flag: 'restore',
        needAParam: false,
    },
    runtime: {
        flag: 'runtime',
        needAParam: true,
    },
    session: {
        flag: 'session',
        needAParam: true,
    },
    outputFile: {
        alias: 'o',
        flag: 'outfile',
        needAParam: true,
    },
    outputFormat: {
        flag: 'output-format',
        needAParam: true,
    },
    show: {
        flag: 'show',
        needAParam: false,
    },
    left: {
        flag: 'left',
        needAParam: false,
    },
    increment: {
        alias: 'i',
        flag: 'increment',
        needAParam: false,
    },
    incrementMin: {
        flag: 'increment-min',
        needAParam: true,
    },
    incrementMax: {
        flag: 'increment-max',
        needAParam: true,
    },
    potfilePath: {
        flag: 'potfile-path',
        needAParam: true,
    },
    speedOnly: {
        flag: 'speed-only',
        needAParam: false,
    },
    cpuOnly: {
        alias: 'D',
        flag: 'opencl-device-types',
        needAParam: false,
        defaultValue: '1',
    },
    progressOnly: {
        flag: 'progress-only',
        needAParam: false,
    },
    kernelOptimisation: {
        alias: 'O',
        flag: 'optimized-kernel-enable',
        needAParam: false,
    },
    workloadProfile: {
        alias: 'w',
        flag: 'workload-profile',
        needAParam: true,
        defaultValue: '3',
    },
    kernelAccel: {
        alias: 'n',
        flag: 'kernel-accel',
        needAParam: true,
    },
    kernelLoops: {
        alias: 'u',
        flag: 'kernel-loops',
        needAParam: true,
    },
    kernelThreads: {
        alias: 'T',
        flag: 'kernel-threads',
        needAParam: true,
    },
    temperatureAbort: {
        flag: 'hwmon-temp-abort',
        needAParam: true,
        defaultValue: '90',
    },
    statusJson: {
        flag: 'status-json',
        needAParam: false,
    },
    statusTimer: {
        flag: 'status-timer',
        needAParam: true,
    },
    status: {
        flag: 'status',
        needAParam: false,
    },
    quiet: {
        flag: 'quiet',
        needAParam: false,
    },
    restoreFilePath: {
        flag: 'restore-file-path',
        needAParam: true,
    },
    restoreDisable: {
        flag: 'restore-disable',
        needAParam: false,
    },
    ruleLeft: {
        alias: 'j',
        flag: 'rule-left',
        needAParam: true,
    },
    ruleRight: {
        alias: 'k',
        flag: 'rule-right',
        needAParam: true,
    },
    rulesFile: {
        alias: 'r',
        flag: 'rules-file',
        needAParam: true,
    },
    customCharset1: {
        alias: '1',
        flag: 'custom-charset1',
        needAParam: true,
    },
    customCharset2: {
        alias: '2',
        flag: 'custom-charset2',
        needAParam: true,
    },
    customCharset3: {
        alias: '3',
        flag: 'custom-charset3',
        needAParam: true,
    },
    customCharset4: {
        alias: '4',
        flag: 'custom-charset4',
        needAParam: true,
    },
} satisfies ThashcatParams;
