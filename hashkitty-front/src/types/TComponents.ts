export type CreateTaskForm = {
   name: string;
   hashlistName: string;
   attackModeId: string;
   cpuOnly: boolean;
   rules: string[];
   maskQuery: string;
   maskFileName: string;
   potfileName: string;
   kernelOpti: boolean;
   wordlistName: string;
   workloadProfile: number;
   breakpointGPUTemperature: number;
   templateId: number;
};

export type TemplateForm = Omit<CreateTaskForm, 'fashlistName'>;

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
   rules?: string;
   potfileName?: string;
   maskQuery?: string;
   maskFilename?: string;
};

export type TUploadReqBody = {
   hashlist: File;
   filename: string;
};

export type TUploadFileName = 'rule' | 'potfile' | 'wordlist' | 'hashlist';

export type InputStandard = {
   id: number;
   label: string;
};

export type StandardList = {
   id: number;
   name: string;
};

export type RadioOnChangeEvent<E = string> = React.BaseSyntheticEvent<
   Event,
   EventTarget & Element,
   EventTarget & { value: E }
>;
