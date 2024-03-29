export type TTask = {
   id: number;
   name: string;
   options: Options;
   hashlistId: THashlist;
   createdAt: string;
   lastestModification: string;
   isfinished: number;
   description?: string;
   templateTaskId?: TTemplate;
   endeddAt?: string | null;
};

export type Options = {
   id: number;
   attackModeId: TAttackMode;
   breakpointGPUTemperature: number;
   wordlistId?: TWordlist;
   kernelOpti: boolean;
   CPUOnly: boolean;
   workloadProfileId?: TWorkloadProfile;
   combinatorWordlistId?: TWordlist;
   rules?: string;
   potfileName?: string;
   maskQuery?: string;
   maskFilename?: string;
   customCharset1?: string;
   customCharset2?: string;
   customCharset3?: string;
   customCharset4?: string;
};

export type TTemplate = {
   id: number;
   name: string;
   description?: string;
   createdAt: string;
   lastestModification: string;
   options: Options;
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
   hashTypeId: THashType;
   createdAt: string;
   lastestModification: string;
   numberOfCrackedPasswords: number;
   crackedOutputFileName: string;
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
   mode: 0 | 1 | 3 | 6 | 7 | 9;
};

export type TWorkloadProfile = {
   id: number;
   profileId: number;
   desktopImpact: string;
   powerConsumation: string;
};

export type AllListsItems =
   | TAttackMode
   | TWordlist
   | THashlist
   | TTemplate
   | TTask;

export type TNotification = {
   id: number;
   message: string;
   status: 'success' | 'error' | 'warning' | 'info';
   createdAt: string;
};
