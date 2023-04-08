import type {
   FieldErrors,
   UseFormRegister,
   UseFormSetValue,
} from 'react-hook-form';
import type { TDBData } from './TypesErrorHandler';

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
   workloadProfile: string;
   breakpointGPUTemperature: string;
   templateId: string;
};

export type CreateTemplateForm = Omit<
   CreateTaskForm,
   'hashlistName' | 'templateId' | 'rules'
> & {
   rules: string[];
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

export type TUseState<State> = [
   State,
   React.Dispatch<React.SetStateAction<State>>,
];

export type AttackModeStepProps<Form extends CreateTemplateForm> = {
   register: UseFormRegister<Form>;
   DBData: Omit<TDBData, 'templates' | 'hashtypes'>;
   setValue: UseFormSetValue<Form>;
   errors: FieldErrors<Form>;
};
