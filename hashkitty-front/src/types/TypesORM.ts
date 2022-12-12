export type TTask = {
    id: number;
    name: string;
    options: Options;
    hashTypeId: THashType;
    hashlistId: THashlist;
    createdAt: string;
    lastestModification: string;
    isfinished: number;
    description?: string;
    templateTaskId?: TemplateTask;
    endeddAt?: string | null;
};

export type Options = {
    id: number;
    attackModeId: TAttackMode;
    breakpointGPUTemperature: number;
    wordlistId: TWordlist;
    workloadProfileId: TWorkloadProfile;
    kernelOpti: Boolean;
    CPUOnly: Boolean;
    ruleName?: string;
    potfileName?: string;
    maskQuery?: string;
    maskFilename?: string;
};

export type TemplateTask = {
    id: number;
    name: string;
    description?: string;
    createdAt: string;
    lastestModification: string;
};

export type THashType = {
    id: number;
    typeNumber: number;
    name: string;
    description: string;
};

export type THashlist = {
    id: number;
    name: string;
    description: string;
    path: string;
    createdAt: string;
    lastestModification: string;
    numberOfCrackedPasswords: number;
};

export type TWordlist = {
    id: number;
    name: string;
    description: string;
    path: string;
};

export type TAttackMode = {
    id: number;
    name: string;
    mode: number;
};

export type TWorkloadProfile = {
    id: number;
    profileId: number;
    desktopImpact: string;
    powerConsumation: string;
};
