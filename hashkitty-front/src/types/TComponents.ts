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

export type CreateTemplateForm = Omit<
   CreateTaskForm,
   'hashlistName' | 'templateId'
>;

export type TUploadReqBody = {
   hashlist: File;
   filename: string;
};

export type TUploadFileName = 'rule' | 'potfile' | 'wordlist' | 'hashlist';

export type InputStandard = {
   id: number;
   label: string;
};

export type AttackModeAvailable = 0 | 1 | 3 | 6 | 7 | 9;

export type StandardList = {
   mode?: AttackModeAvailable;
   id: number;
   name: string;
};

export type RadioOnChangeEvent<E = string> = React.BaseSyntheticEvent<
   Event,
   EventTarget & Element,
   EventTarget & { value: E }
>;
