import { newTaskFormData } from './types/TComponents';
import {
    newTaskInputsError,
    keyErrors,
    fieldError,
} from './types/TErrorHandling';
import { TAttackMode, THashlist } from './types/TypesORM';
import { inputItem } from './components/minorComponents/InputDropdown';

const newTaskKeys: keyErrors[] = [
    'formAttackMode',
    'formRuleName',
    'formMaskQuery',
    'formPotfileName',
    'formKernelOpti',
    'formWordlistName',
    'formWorkloadProfile',
    'formBreakpointGPUTemperature',
    'formCpuOnly',
    'formHashlistName',
    'formName',
];

export class ErrorHandling {
    public results: newTaskInputsError;
    public hasErrors: boolean;

    constructor() {
        this.results = this.setDefault(newTaskKeys);
        this.hasErrors = false;
    }

    public getResults(): newTaskInputsError {
        return this.results;
    }

    private setDefault(keys: keyErrors[]): newTaskInputsError {
        let results = {};
        for (const key of keys) {
            results = { ...results, [key]: this.defaultField };
        }
        return results as newTaskInputsError;
    }

    public checkTask(
        form: newTaskFormData,
        dbData: {
            attackModes: TAttackMode[];
            hashlist: THashlist[];
            wordlist: inputItem[];
            rules: inputItem[];
            potfiles: inputItem[];
        }
    ): void {
        this.hasErrors = false;
        this.checkName(form.formName);
        this.checkAttackMode(form.formAttackMode, dbData.attackModes);
        this.checkHashlist(form.formHashlistName, dbData.hashlist);
        this.checkWordlist(form.formWordlistName, dbData.wordlist);
        this.checkRules(form.formRuleName, dbData.rules);
        this.checkPotfiles(form.formPotfileName, dbData.potfiles);
    }

    private get defaultField(): fieldError {
        return {
            isError: false,
            message: '',
            itemId: -1,
        };
    }

    private get requieredFields(): fieldError {
        return {
            isError: true,
            itemId: -1,
            message: 'This field is required',
        };
    }

    private get wrongData(): fieldError {
        return {
            isError: true,
            itemId: -1,
            message: 'The submitted data is not correct',
        };
    }

    private checkName(name: string): void {
        this.results.formName =
            name.length === 0 ? this.requieredFields : this.defaultField;
    }

    private checkAttackMode(
        attackMode: TAttackMode['mode'],
        dbAttackModes: TAttackMode[]
    ): void {
        const find = dbAttackModes.find(elem => {
            return elem.mode === attackMode;
        });
        if (find) {
            this.results.formAttackMode = {
                isError: false,
                message: '',
                itemId: find.id,
            };
        } else {
            this.results.formAttackMode = this.requieredFields;
            this.hasErrors = true;
        }
    }

    private checkWordlist(name: string, list: inputItem[]): void {
        const find = list.find(elem => {
            return elem.name === name;
        });
        if (find) {
            this.defaultField;
        } else if (name === '') {
            this.results.formWordlistName = this.requieredFields;
            this.hasErrors = true;
        } else {
            this.results.formWordlistName = this.wrongData;
            this.hasErrors = true;
        }
    }

    private checkHashlist(name: THashlist['name'], list: THashlist[]): void {
        const find = list.find(elem => {
            return elem.name === name;
        });
        if (find) {
            this.results.formHashlistName = {
                isError: false,
                message: '',
                itemId: find.id,
            };
        } else if (name === '') {
            this.results.formHashlistName = this.requieredFields;
            this.hasErrors = true;
        } else {
            this.results.formHashlistName = this.wrongData;
            this.hasErrors = true;
        }
    }

    private checkRules(name: string, list: inputItem[]): void {
        const find = list.find(elem => {
            return elem.name === name;
        });
        if (find || name.length === 0) {
            this.results.formPotfileName = this.defaultField;
        } else {
            this.results.formPotfileName = this.requieredFields;
            this.hasErrors = true;
        }
    }

    private checkPotfiles(name: string, list: inputItem[]): void {
        const find = list.find(elem => {
            return elem.name === name;
        });
        if (find || name.length === 0) {
            this.results.formPotfileName = this.defaultField;
        } else {
            this.results.formPotfileName = this.requieredFields;
            this.hasErrors = true;
        }
    }
}
