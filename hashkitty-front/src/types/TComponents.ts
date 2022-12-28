export type newTaskFormData = {
    formName: string;
    formHashlistName: string;
    formAttackModeId: number;
    formCpuOnly: boolean;
    formRuleName: string;
    formMaskQuery: string;
    formPotfileName: string;
    formKernelOpti: boolean;
    formWordlistName: string;
    formWorkloadProfile: number;
    formBreakpointGPUTemperature: number;
};

export type ApiTaskFormData = {
    name: string;
    description: string;
    hashlistId: number;
    id?: number;
    templateTaskId?: number;
    options: ApiOptionsFormData;
};

export type ApiOptionsFormData = {
    attackModeId: number;
    breakpointGPUTemperature: number;
    wordlistName: string;
    workloadProfileId: number;
    kernelOpti: boolean;
    CPUOnly: boolean;
    ruleName?: string;
    potfileName?: string;
    maskQuery?: string;
    maskFilename?: string;
};
