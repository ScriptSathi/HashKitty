import { fieldError } from './TErrorHandling';

export type GenericForm<InputsError extends { [key: string]: fieldError }> = {
    inputsErrorCheck: InputsError;
    formHasErrors: boolean;
};
