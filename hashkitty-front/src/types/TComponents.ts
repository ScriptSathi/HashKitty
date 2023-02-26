export type newTaskFormData = {
    formName: string;
    formHashlistName: string;
    formAttackModeId: number;
    formCpuOnly: boolean;
    formRuleName: string;
    formMaskQuery: string;
    formMaskFileName: string;
    formPotfileName: string;
    formKernelOpti: boolean;
    formWordlistName: string;
    formWorkloadProfile: number;
    formBreakpointGPUTemperature: number;
};

export type templateFormData = Omit<newTaskFormData, 'formHashlistName'>;

export type newHashlistFormData = {
    formHashlist?: File;
    formName: string;
    formHashtypeName: string;
};

export type newListFormData = {
    formList?: File;
    formName: string;
};

export type ApiTaskFormData = {
    name: string;
    description: string;
    hashlistId: number;
    id?: number;
    templateTaskId?: number;
    options: ApiOptionsFormData;
};

export type ApiTemplateFormData = {
    name: string;
    description: string;
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

export type itemBase = { name: string; id: number };

export type TUploadReqBody = {
    hashlist: File;
    filename: string;
};

export type TUploadFileName = 'rule' | 'potfile' | 'wordlist' | 'hashlist';
