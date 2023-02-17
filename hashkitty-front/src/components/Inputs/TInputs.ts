import { CreateTaskState } from '../../pages/HomePage/CreateTask/TCreateTask';
import { THashlist, TemplateTask } from '../../types/TypesORM';

export type inputDatalist = {
    list: THashlist[] | TemplateTask[];
    formName: keyof CreateTaskState;
};
