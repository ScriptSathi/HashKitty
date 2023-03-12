export type CreateTaskForm = {
   name: string;
   hashlistName: string;
   attackModeId: number;
   cpuOnly: boolean;
   ruleName: string;
   maskQuery: string;
   maskFileName: string;
   potfileName: string;
   kernelOpti: boolean;
   wordlistName: string;
   workloadProfile: number;
   breakpointGPUTemperature: number;
};

export type TemplateForm = Omit<CreateTaskForm, 'fashlistName'>;

export type ImportHashlistFormData = {
   hashtypeName: string;
} & ImportListFormData;

export type ImportListFormData = {
   list?: File;
   name: string;
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

export type ItemBase = { name: string; id: number };

export type TUploadReqBody = {
   hashlist: File;
   filename: string;
};

export type TUploadFileName = 'rule' | 'potfile' | 'wordlist' | 'hashlist';
