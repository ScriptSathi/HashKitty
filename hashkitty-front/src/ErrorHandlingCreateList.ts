import { newListFormData } from './types/TComponents';
import { ErrorHandling } from './ErrorHandling';
import { ListKeyErrors, newListInputsError } from './types/TErrorHandling';

export class ErrorHandlingCreateList extends ErrorHandling<
    newListInputsError,
    ListKeyErrors
> {
    constructor() {
        super(['formList', 'formName']);
    }

    public analyse(form: newListFormData): void {
        this.checkName(form.formName);
        this.checkFile(form.formList);
    }

    private checkName(name: string): void {
        this.results.formName =
            name.length === 0 ? this.requieredFields : this.defaultField;
    }

    private checkFile(file: File | undefined): void {
        // TODO test if file is a proper TXT file (use FileReader() and regex all TXT ?)
        this.results.formList = file ? this.defaultField : this.requieredFile;
    }
}
