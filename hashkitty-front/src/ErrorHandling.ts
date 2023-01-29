import { fieldError } from './types/TErrorHandling';

export class ErrorHandling<InputsErrors, keyForm extends string> {
    public results: InputsErrors;
    public hasErrors: boolean;

    constructor(keys: keyForm[]) {
        this.results = this.setDefault(keys);
        this.hasErrors = false;
    }

    public getResults(): InputsErrors {
        return this.results;
    }

    private setDefault(keys: keyForm[]): InputsErrors {
        let results = {};
        for (const key of keys) {
            results = { ...results, [key]: this.defaultField };
        }
        return results as InputsErrors;
    }

    protected get defaultField(): fieldError {
        return {
            isError: false,
            message: '',
            itemId: -1,
        };
    }

    protected get requieredFields(): fieldError {
        this.hasErrors = true;
        return {
            isError: true,
            itemId: -1,
            message: 'Required',
        };
    }

    protected get requieredFile(): fieldError {
        this.hasErrors = true;
        return {
            isError: true,
            itemId: -1,
            message: 'File needed',
        };
    }

    protected get wrongData(): fieldError {
        this.hasErrors = true;
        return {
            isError: true,
            itemId: -1,
            message: 'Incorrect data',
        };
    }
}
