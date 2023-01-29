import { newTaskFormData } from '../../types/TComponents';
import { newTaskInputsError } from '../../types/TErrorHandling';
import { GenericForm } from '../../types/TForm';
import { TDBData, THashlist, TemplateTask } from '../../types/TypesORM';

export type CreateTaskState = {
    handleTaskCreationAdded: () => void;
    handleTaskCreationError: () => void;
    toggleNewTask: () => void;
    createOptionsToggle: boolean;
    hashlistCreationToggle: boolean;
    isMouseIn: boolean;
    templateCheckboxIsChecked: boolean;
    templateTaskCheckBoxId: number;
} & newTaskFormData &
    GenericForm<newTaskInputsError> &
    Omit<TDBData, 'hashtypes'>;

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
