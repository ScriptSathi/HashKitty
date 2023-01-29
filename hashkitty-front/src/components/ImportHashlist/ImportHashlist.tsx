import React, { ChangeEvent, Component, FormEvent } from 'react';

import BackgroundBlur from '../BackgroundBlur/BackGroundBlur';
import './ImportHashlist.scss';
import { Utils } from '../../Utils';
import { TUploadReqBody, newTHashlistFormData } from '../../types/TComponents';
import { ErrorHandlingCreateHashlist } from '../../ErrorHandlingCreateHashlist';
import { GenericForm } from '../../types/TForm';
import { newHashlistInputsError } from '../../types/TErrorHandling';
import { InputHashtypes, InputName } from '../Inputs/Inputs';
import { TDBData, THashType } from '../../types/TypesORM';
import { Constants } from '../../Constants';
import DragNDrop from '../DragNDrop/DragNDrop';
import Button from '../Button/Button';

type ImportHashlistProps = {
    isToggled: boolean;
    toggleFn: () => void;
};

type ImportHashlistState = {} & newTHashlistFormData &
    GenericForm<newHashlistInputsError> &
    Pick<TDBData, 'hashtypes'>;

const defaultFormData = {
    formName: '',
    formHashtypeName: '',
    formHashlist: undefined,
};

export default class ImportHashlist extends Component<
    ImportHashlistProps,
    ImportHashlistState
> {
    private inputsError: ErrorHandlingCreateHashlist;
    private hashTypeId: number;

    constructor(props: ImportHashlistProps) {
        super(props);
        this.inputsError = new ErrorHandlingCreateHashlist();
        this.hashTypeId = -1;
        this.state = {
            hashtypes: [],
            inputsErrorCheck: this.inputsError.results,
            formHasErrors: false,
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
                <div className="HashlistCardBody">
                    <form
                        onSubmit={e => {
                            this.handleSubmit(e);
                        }}
                        className="HashlistFormBody"
                    >
                        <p className="title">Import a list of hashs</p>
                        <div className="mandatoryBody">
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
                        <div className="hashlistSubmitDivButton">
                            <Button
                                type="submit"
                                className="submitInputHashlist"
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
            form.append('file', this.state.formHashlist);
            form.append('hashTypeId', `${this.hashTypeId}`);
        }
        return form;
        // return {
        //     formName: this.state.formName,
        //     formHashlist: this.state.formHashlist || undefined,
        //     formHashtypeName: this.state.formHashtypeName,
        // };
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
            } as Pick<newTHashlistFormData, keyof Omit<newTHashlistFormData, 'formHashlist'>>);
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
            console.log(this.state.formHashtypeName);
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
            // headers: { 'Content-Type': 'multipart/form-data' },
            body: this.form,
            ...Constants.mandatoryFetchOptions,
        };
        fetch(Constants.apiPOSTAddHashlist, requestOptions)
            .then(response => {
                return response.json();
            })
            .then(res => {
                console.log(res);
                // if (res.success) {
                //     this.state.handleTaskCreationAdded();
                // } else {
                //     this.state.handleTaskCreationError();
                // }
                // this.state.toggleNewTask();
            });
    }
}
