import React, { ChangeEvent, Component, FormEvent } from 'react';

import BackgroundBlur from '../ui/BackgroundBlur/BackGroundBlur';
import './ImportList.scss';
import { Utils } from '../../Utils';
import { newListFormData } from '../../types/TComponents';
import { ErrorHandlingCreateHashlist } from '../../ErrorHandlingCreateHashlist';
import { GenericForm } from '../../types/TForm';
import { newListInputsError } from '../../types/TErrorHandling';
import { InputName } from '../Inputs/Inputs';
import { TDBData } from '../../types/TypesORM';
import { Constants } from '../../Constants';
import DragNDrop from '../ui/DragNDrop/DragNDrop';
import Button from '../ui/Button/Button';

type ImportListProps = {
    isToggled: boolean;
    type: keyof Omit<
        TDBData,
        'hashtypes' | 'hashlist' | 'templateTasks' | 'attackModes'
    >;
    toggleFn: () => void;
    handleImportHasSucced: () => void;
};

type ImportListState = {
    onErrorImport: string;
} & newListFormData &
    GenericForm<newListInputsError>;

const defaultFormData = {
    formName: '',
    formList: undefined,
};

export default class ImportList extends Component<
    ImportListProps,
    ImportListState
> {
    private inputsError: ErrorHandlingCreateHashlist;
    private hashTypeId: number;

    constructor(props: ImportListProps) {
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
        this.displayErrorMessageOnImport();
    }

    public render() {
        return (
            <BackgroundBlur
                isToggled={this.props.isToggled}
                toggleFn={this.props.toggleFn}
                centerContent
            >
                <div className="ImportList__cardBody">
                    <form
                        onSubmit={e => {
                            this.handleSubmit(e);
                        }}
                        className="ImportList__formBody"
                    >
                        <p
                            className={
                                this.state.onErrorImport.length > 0
                                    ? 'title noMargin'
                                    : 'title'
                            }
                        >
                            Import a list of {this.props.type}
                        </p>
                        <p className="title ImportList__importError">
                            {this.state.onErrorImport}
                        </p>
                        <div className="grid2Fr">
                            <div>
                                <InputName
                                    state={this.state}
                                    handleInputChange={this.handleInputChange}
                                />
                            </div>
                            <div className="marginLeft30 marginMinus5Up">
                                <p
                                    className={
                                        this.state.formHasErrors &&
                                        this.state.inputsErrorCheck.formList
                                            .isError
                                            ? 'isError labelsTitles noMargin'
                                            : 'hideBlock noMargin'
                                    }
                                >
                                    {
                                        this.state.inputsErrorCheck.formList
                                            .message
                                    }
                                </p>
                                <DragNDrop setFile={this.setFile} />
                            </div>
                        </div>
                        <div className="ImportList__button">
                            <Button
                                type="submit"
                                className="ImportList__submit"
                            >
                                Import list
                            </Button>
                        </div>
                    </form>
                </div>
            </BackgroundBlur>
        );
    }

    private get form(): FormData {
        const form = new FormData();
        if (this.state.formList) {
            form.append('fileName', this.state.formName);
            form.append('file', this.state.formList);
        }
        return form;
    }

    private setFile = (formList: File): void => {
        this.setState({ formList });
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
            } as Pick<newListFormData, keyof newListFormData>);
        }
    };

    private handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        this.inputsError.analyse(
            {
                formName: this.state.formName,
                formList: this.state.formList || undefined,
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
            if (this.state.formList) {
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
        fetch(Constants.apiPOSTAddHashlist, requestOptions)
            .then(response => {
                return response.json();
            })
            .then(res => {
                let isError = true;
                if (res.success) isError = false;
                this.props.handleImportHasSucced(res.message, isError);
                this.state.toggleNewTask();
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
