import { newTaskFormData } from '../../types/TComponents';
import { newTaskInputsError } from '../../types/TErrorHandling';
import { TAttackMode, TemplateTask, THashlist } from '../../types/TypesORM';
import { inputItem } from '../InputDropDown./InputDropdown';

export type CreateTaskState = {
    handleTaskCreationAdded: () => void;
    handleTaskCreationError: () => void;
    toggleNewTask: () => void;
    inputsErrorCheck: newTaskInputsError;
    formHasErrors: boolean;
    createOptionsToggle: boolean;
    hashlistCreationToggle: boolean;
    isMouseIn: boolean;
    templateCheckboxIsChecked: boolean;
    templateTaskCheckBoxId: number;
    hashlist: THashlist[];
    wordlists: inputItem[];
    templateTasks: TemplateTask[];
    rules: inputItem[];
    attackModes: TAttackMode[];
    potfiles: inputItem[];
} & newTaskFormData;

export interface CreateTaskProps {
    handleTaskCreationAdded: () => void;
    handleTaskCreationError: () => void;
    toggleNewTask: () => void;
    toggleImportHashlist: () => void;
}

export type inputDatalist = {
    list: THashlist[] | TemplateTask[];
    formName: keyof CreateTaskState;
};
