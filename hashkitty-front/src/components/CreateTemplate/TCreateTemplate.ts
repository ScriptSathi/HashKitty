import { templateFormData } from '../../types/TComponents';
import { newTaskInputsError } from '../../types/TErrorHandling';
import { GenericForm } from '../../types/TForm';
import { TDBData, THashlist, TemplateTask } from '../../types/TypesORM';

export type CreateTemplateState = {
    toggleNewTask: () => void;
    hashlistCreationToggle: boolean;
    isMouseIn: boolean;
    templateCheckboxIsChecked: boolean;
    templateTaskCheckBoxId: number;
    activePage: number;
    importHashlistSuccessMessage: string;
} & templateFormData &
    GenericForm<newTaskInputsError> &
    Omit<TDBData, 'hashtypes'>;

export interface CreateTemplateProps {
    handleTemplateCreation: (message: string, isError: boolean) => void;
    toggleNewTask: () => void;
    isToggled: boolean;
    // toggleImportHashlist: () => void;
}

export type inputDatalist = {
    list: THashlist[] | TemplateTask[];
    formName: keyof CreateTemplateState;
};
