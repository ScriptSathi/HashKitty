import { newTaskFormData } from './types/TComponents';
import {
    newTaskInputsError,
    keyErrors,
    fieldError,
} from './types/TErrorHandling';
import { TAttackMode, THashlist } from './types/TypesORM';
import { inputItem } from './components/minorComponents/InputDropdown';

const newTaskKeys: keyErrors[] = [
    'formAttackModeId',
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
        this.checkAttackMode(form.formAttackModeId, dbData.attackModes);
        this.checkHashlist(form.formHashlistName, dbData.hashlist);
        this.checkWordlist(form.formWordlistName, dbData.wordlist);
        this.checkRules(form.formRuleName, dbData.rules);
        this.checkPotfiles(form.formPotfileName, dbData.potfiles);
        this.checkWorkloadProfile(form.formWorkloadProfile);
        this.checkBreakpointTemp(form.formBreakpointGPUTemperature);
    }

    private get defaultField(): fieldError {
        return {
            isError: false,
            message: '',
            itemId: -1,
        };
    }

    private get requieredFields(): fieldError {
        this.hasErrors = true;
        return {
            isError: true,
            itemId: -1,
            message: 'This field is required',
        };
    }

    private get wrongData(): fieldError {
        this.hasErrors = true;
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
        attackModeId: TAttackMode['id'],
        dbAttackModes: TAttackMode[]
    ): void {
        const find = dbAttackModes.find(elem => {
            return elem.id === attackModeId;
        });
        if (find) {
            this.results.formAttackModeId = {
                isError: false,
                message: '',
                itemId: find.id,
            };
        } else {
            this.results.formAttackModeId = this.requieredFields;
        }
    }

    private checkWordlist(name: string, list: inputItem[]): void {
        const find = list.find(elem => {
            return elem.name === name;
        });
        if (find) {
            this.results.formWordlistName = this.defaultField;
        } else if (name === '') {
            this.results.formWordlistName = this.requieredFields;
        } else {
            this.results.formWordlistName = this.wrongData;
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
        } else {
            this.results.formHashlistName = this.wrongData;
        }
    }

    private checkRules(name: string, list: inputItem[]): void {
        const find = list.find(elem => {
            return elem.name === name;
        });
        if (find || name.length === 0) {
            this.results.formRuleName = this.defaultField;
        } else {
            this.results.formRuleName = this.wrongData;
        }
    }

    private checkPotfiles(name: string, list: inputItem[]): void {
        const find = list.find(elem => {
            return elem.name === name;
        });
        if (find || name.length === 0) {
            this.results.formPotfileName = this.defaultField;
        } else {
            this.results.formPotfileName = this.wrongData;
        }
    }

    private checkBreakpointTemp(temp: number) {
        if (temp > 110 || temp < 0 || typeof temp !== 'number') {
            this.results.formBreakpointGPUTemperature = this.wrongData;
        } else {
            this.results.formBreakpointGPUTemperature = this.defaultField;
        }
    }

    private checkWorkloadProfile(profile: number) {
        if (profile > 110 || profile < 0 || typeof profile !== 'number') {
            this.results.formWorkloadProfile = this.wrongData;
        } else {
            this.results.formWorkloadProfile = this.defaultField;
        }
    }
}
