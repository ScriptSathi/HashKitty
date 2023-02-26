import { newHashlistFormData } from './types/TComponents';
import { THashType } from './types/TypesORM';
import { ErrorHandling } from './ErrorHandling';
import {
    HashlistKeyErrors,
    newHashlistInputsError,
} from './types/TErrorHandling';

export class ErrorHandlingCreateHashlist extends ErrorHandling<
    newHashlistInputsError,
    HashlistKeyErrors
> {
    constructor() {
        super(['formHashlist', 'formName', 'formHashtypeName']);
    }

    public analyse(
        form: newHashlistFormData,
        dbData: {
            hashtypes: THashType[];
        }
    ): void {
        this.checkName(form.formName);
        this.checkFile(form.formHashlist);
        this.checkHashType(form.formHashtypeName, dbData.hashtypes);
    }

    private checkName(name: string): void {
        this.results.formName =
            name.length === 0 ? this.requieredFields : this.defaultField;
    }

    private checkFile(file: File | undefined): void {
        // TODO test if file is a proper TXT file (use FileReader() and regex all TXT ?)
        this.results.formHashlist = file
            ? this.defaultField
            : this.requieredFile;
    }

    private checkHashType(hashType: string, dbHashType: THashType[]): void {
        const find = dbHashType.find(
            elem => `${elem.typeNumber}-${elem.name}` === hashType
        );
        if (find) {
            this.results.formHashtypeName = {
                isError: false,
                message: '',
                itemId: find.id,
            };
        } else if (hashType.length === 0) {
            this.results.formHashtypeName = this.requieredFields;
        } else {
            this.results.formHashtypeName = this.wrongData;
        }
    }
}
