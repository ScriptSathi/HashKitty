import { ApiImportList, ListItem } from './TApi';
import { CreateTaskForm, CreateTemplateForm, StandardList } from './TComponents';
import { TAttackMode, THashType, THashlist, TTemplate } from './TypesORM';

export type FieldError = {
   isError: boolean;
   message: string;
   itemId: number;
};

export type TDBData = {
   hashtypes: THashType[];
   hashlists: ListItem<THashlist>[];
   wordlists: ListItem<StandardList>[];
   templates: ListItem<TTemplate>[];
   rules: ListItem<StandardList>[];
   attackModes: TAttackMode[];
   potfiles: ListItem<StandardList>[];
};

export type DefaultFormErrors = {
   [key: string]: FieldError;
};

export type CreateTaskErrors = {
   [key in keyof CreateTaskForm]: FieldError;
};

export type CreateTemplateErrors = {
   [key in keyof CreateTemplateForm]: FieldError;
};

export type ImportListErrors = {
   [key in keyof ApiImportList]: FieldError;
};
