import { newTaskFormData } from '../../types/TComponents';
import { newTaskInputsError } from '../../types/TErrorHandling';
import { GenericForm } from '../../types/TForm';
import { TDBData, THashlist, TemplateTask } from '../../types/TypesORM';

export type CreateTemplateState = {
    handleTaskCreationAdded: () => void;
    handleTaskCreationError: () => void;
    toggleNewTask: () => void;
    hashlistCreationToggle: boolean;
    isMouseIn: boolean;
    templateCheckboxIsChecked: boolean;
    templateTaskCheckBoxId: number;
    userFormStep: number;
    importHashlistSuccessMessage: string;
} & newTaskFormData &
    GenericForm<newTaskInputsError> &
    Omit<TDBData, 'hashtypes'>;

export interface CreateTemplateProps {
    handleTaskCreationAdded: () => void;
    handleTaskCreationError: () => void;
    toggleNewTask: () => void;
    isToggled: boolean;
    // toggleImportHashlist: () => void;
}

export type inputDatalist = {
    list: THashlist[] | TemplateTask[];
    formName: keyof CreateTemplateState;
};
