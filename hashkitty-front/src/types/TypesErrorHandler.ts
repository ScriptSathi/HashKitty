import {
   CreateTaskForm,
   ImportHashlistFormData,
   ImportListFormData,
   ItemBase,
} from './TComponents';
import { TAttackMode, THashlist } from './TypesORM';

export type FieldError = {
   isError: boolean;
   message: string;
   itemId: number;
};

export type TDBData = {
   attackModes: TAttackMode[];
   hashlist: THashlist[];
   wordlist: ItemBase[];
   rules: ItemBase[];
   potfiles: ItemBase[];
};

export type DefaultFormErrors = {
   [key: string]: FieldError;
};

export type CreateTaskErrors = {
   [key in keyof CreateTaskForm]: FieldError;
};

export type ImportHashlistErrors = {
   [key in keyof ImportHashlistFormData]: FieldError;
};

export type ImportListErrors = {
   [key in keyof ImportListFormData]: FieldError;
};
