import React, { ChangeEvent, Component, FormEvent } from 'react';

import BackgroundBlur from '../ui/BackgroundBlur/BackGroundBlur';
import './ImportHashList.scss';
import { Utils } from '../../Utils';
import { newHashlistFormData } from '../../types/TComponents';
import { ErrorHandlingCreateHashlist } from '../../ErrorHandlingCreateHashlist';
import { GenericForm } from '../../types/TForm';
import { newHashlistInputsError } from '../../types/TErrorHandling';
import { InputHashtypes, InputName } from '../Inputs/Inputs';
import { TDBData, THashType } from '../../types/TypesORM';
import { Constants } from '../../Constants';
import DragNDrop from '../ui/DragNDrop/DragNDrop';
import Button from '../ui/Button/Button';

type ImportHashListProps = {
    isToggled: boolean;
    toggleFn: () => void;
    handleImportHasSucced: () => void;
};

type ImportHashListState = {
    onErrorImport: string;
} & newHashlistFormData &
    GenericForm<newHashlistInputsError> &
    Pick<TDBData, 'hashtypes'>;

const defaultFormData = {
    formName: '',
    formHashtypeName: '',
    formHashlist: undefined,
};

export default class ImportHashList extends Component<
    ImportHashListProps,
    ImportHashListState
> {
    private inputsError: ErrorHandlingCreateHashlist;
    private hashTypeId: number;

    constructor(props: ImportHashListProps) {
        super(props);
        this.inputsError = new ErrorHandlingCreateHashlist();
        this.hashTypeId = -1;
        this.state = {
            hashtypes: [],
            inputsErrorCheck: this.inputsError.results,
            formHasErrors: false,
            onErrorImport: '',
            ...defaultFormData,
        };
    }

    public async componentDidMount(): Promise<void> {
        const hashtypes = await Utils.fetchListWithEndpoint<THashType>(
            Constants.apiGetHashTypes
        );
        this.setState({
            hashtypes,
        });
    }

    public render() {
        return (
            <BackgroundBlur
                isToggled={this.props.isToggled}
                toggleFn={this.props.toggleFn}
                centerContent
            >
                <div className="ImportHashList__cardBody">
                    <form
                        onSubmit={e => {
                            this.handleSubmit(e);
                        }}
                        className="ImportHashList__formBody"
                    >
                        <p
                            className={
                                this.state.onErrorImport.length > 0
                                    ? 'title noMargin'
                                    : 'title'
                            }
                        >
                            Import a list of hashes
                        </p>
                        <p className="title ImportHashList__importError">
                            {this.state.onErrorImport}
                        </p>
                        <div className="grid2Fr">
                            <div>
                                <InputName
                                    state={this.state}
                                    handleInputChange={this.handleInputChange}
                                />
                                <InputHashtypes
                                    state={this.state}
                                    handleInputChange={this.handleInputChange}
                                />
                            </div>
                            <div className="marginLeft30 marginMinus5Up">
                                <p
                                    className={
                                        this.state.formHasErrors &&
                                        this.state.inputsErrorCheck.formHashlist
                                            .isError
                                            ? 'isError labelsTitles noMargin'
                                            : 'hideBlock noMargin'
                                    }
                                >
                                    {
                                        this.state.inputsErrorCheck.formHashlist
                                            .message
                                    }
                                </p>
                                <DragNDrop setFile={this.setFile} />
                            </div>
                        </div>
                        <div className="ImportHashList__button">
                            <Button
                                type="submit"
                                className="ImportHashList__submit"
                            >
                                Import Hashlist
                            </Button>
                        </div>
                    </form>
                </div>
            </BackgroundBlur>
        );
    }

    private get form(): FormData {
        const form = new FormData();
        if (this.state.formHashlist) {
            form.append('fileName', this.state.formName);
            form.append('type', 'hashlist');
            form.append('file', this.state.formHashlist);
            form.append('hashTypeId', this.hashTypeId.toString());
        }
        return form;
    }

    private setFile = (formHashlist: File): void => {
        this.setState({ formHashlist });
    };

    private handleInputChange = (
        event:
            | ChangeEvent<HTMLInputElement>
            | (React.MouseEvent<HTMLInputElement, MouseEvent> &
                  ChangeEvent<HTMLInputElement>)
    ) => {
        if (event.target.name !== '' && event.target.name in this.state) {
            const target = event.target;
            const value = Utils.santizeInput(event);
            this.setState({
                [target.name]: value,
            } as Pick<newHashlistFormData, keyof Omit<newHashlistFormData, 'formHashlist'>>);
        }
    };

    private handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        this.inputsError.analyse(
            {
                formName: this.state.formName,
                formHashlist: this.state.formHashlist || undefined,
                formHashtypeName: this.state.formHashtypeName,
            },
            {
                hashtypes: this.state.hashtypes,
            }
        );
        this.setState({
            inputsErrorCheck: this.inputsError.results,
            formHasErrors: this.inputsError.hasErrors,
        });
        if (!this.inputsError.hasErrors) {
            const hashType = this.state.hashtypes.find(hashType => {
                return this.state.formHashtypeName.includes(hashType.name);
            });
            if (hashType && this.state.formHashlist) {
                this.hashTypeId = hashType.id;
                this.submitForm();
            } else {
                //TODO No reference found
            }
        }
    };

    private submitForm(): void {
        const requestOptions = {
            method: 'POST',
            body: this.form,
            ...Constants.mandatoryFetchOptions,
        };
        fetch(Constants.apiPOSTAddList, requestOptions)
            .then(response => {
                return response.json();
            })
            .then(res => {
                if (res.success) {
                    this.props.handleImportHasSucced();
                } else {
                    this.displayErrorMessageOnImport();
                }
            });
    }

    private displayErrorMessageOnImport(): void {
        this.setState({ onErrorImport: 'An error occured' });
        setTimeout(() => this.setState({ onErrorImport: '' }), 3000);
    }
}
