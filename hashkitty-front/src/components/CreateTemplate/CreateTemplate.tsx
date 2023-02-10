import React, { ChangeEvent, Component, FormEvent } from 'react';

import './CreateTemplate.scss';

import { Constants } from '../../Constants';
import { Utils } from '../../Utils';
import {
    InputAttackModes,
    InputCPUOnly,
    InputHashlist,
    InputKernelOpti,
    InputName,
    InputPotfiles,
    InputRules,
    InputWordlist,
    InputWorkloadProfiles,
    RenderTemplateTaskCheckBox,
    InputBreakpointTemp,
} from '../Inputs/Inputs';
import { ErrorHandlingCreateTemplate } from '../../ErrorHandlingCreateTemplate';
import { THashlist, TemplateTask, TAttackMode } from '../../types/TypesORM';
import {
    ApiOptionsFormData,
    ApiTaskFormData,
    itemBase,
    newTaskFormData,
} from '../../types/TComponents';
import { CreateTemplateProps, CreateTemplateState } from './TCreateTemplate';
import Button from '../Button/Button';
import ImportList from '../ImportList/ImportList';
import BackgroundBlur from '../BackgroundBlur/BackGroundBlur';

const defaultFormData = {
    formAttackModeId: -1,
    formCpuOnly: false,
    formRuleName: '',
    formMaskQuery: '',
    formPotfileName: '',
    formKernelOpti: false,
    formWordlistName: '',
    formWorkloadProfile: 3,
    formBreakpointGPUTemperature: 90,
};

// TODO Carrousel https://codesandbox.io/s/form-carousel-h9mnm?file=/src/Form/atoms.js:1131-1137

export default class CreateTemplate extends Component<
    CreateTemplateProps,
    CreateTemplateState
> {
    private inputsError: ErrorHandlingCreateTemplate;
    constructor(props: CreateTemplateProps) {
        super(props);
        this.inputsError = new ErrorHandlingCreateTemplate();
        this.state = {
            inputsErrorCheck: this.inputsError.results,
            handleTaskCreationAdded: props.handleTaskCreationAdded,
            handleTaskCreationError: props.handleTaskCreationError,
            toggleNewTask: props.toggleNewTask,
            createOptionsToggle: false,
            hashlistCreationToggle: false,
            formHasErrors: false,
            isMouseIn: false,
            templateCheckboxIsChecked: false,
            templateTaskCheckBoxId: -1,
            hashlist: [],
            wordlists: [],
            attackModes: [],
            rules: [],
            potfiles: [],
            templateTasks: [],
            formName: '',
            importHashlistSuccessMessage: '',
            formHashlistName: '',
            ...defaultFormData,
        };
    }

    public async componentDidMount(): Promise<void> {
        await this.fetchData();
    }

    public render() {
        return (
            <div>
                <BackgroundBlur
                    isToggled={this.props.isToggled}
                    toggleFn={this.props.toggleNewTask}
                    centerContent={false}
                >
                    <div className="createTemplateBody">
                        <div style={{ height: 750 }}>
                            <div className="createTemplateContentBody">
                                <p className="title">New Template</p>
                                <form
                                    onSubmit={e => {
                                        this.handleSubmit(e);
                                    }}
                                    className="formBody"
                                >
                                    <div className="mandatoryBody">
                                        <div>
                                            <InputName
                                                state={this.state}
                                                handleInputChange={
                                                    this.handleInputChange
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="advancedConfigsDivMain">
                                        <div>
                                            <InputRules
                                                state={this.state}
                                                handleInputChange={
                                                    this.handleInputChange
                                                }
                                            />
                                            <br />
                                            <InputWordlist
                                                state={this.state}
                                                handleInputChange={
                                                    this.handleInputChange
                                                }
                                            />
                                            <br />
                                            <br />
                                            <InputWorkloadProfiles
                                                state={this.state}
                                                handleInputChange={
                                                    this.handleInputChange
                                                }
                                            />
                                            <br />
                                            <InputCPUOnly
                                                state={this.state}
                                                handleInputChange={
                                                    this.handleInputChange
                                                }
                                            />
                                            <br />
                                            <InputKernelOpti
                                                state={this.state}
                                                handleInputChange={
                                                    this.handleInputChange
                                                }
                                            />
                                        </div>
                                        <div className="advancedConfigsDivLeft">
                                            <InputPotfiles
                                                state={this.state}
                                                handleInputChange={
                                                    this.handleInputChange
                                                }
                                            />
                                            <InputAttackModes
                                                state={this.state}
                                                handleInputChange={
                                                    this.handleInputChange
                                                }
                                            />
                                            <br />
                                            <InputBreakpointTemp
                                                state={this.state}
                                                handleInputChange={
                                                    this.handleInputChange
                                                }
                                            />
                                        </div>
                                    </div>
                                    <Button
                                        type="submit"
                                        className="submitInputCreateTemplate"
                                    >
                                        Create template
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </div>
                </BackgroundBlur>
                <ImportList
                    isToggled={this.state.hashlistCreationToggle}
                    toggleFn={this.toggleHashlistCreation}
                    handleImportHasSucced={this.importHashlistSuccess}
                />
            </div>
        );
    }

    private constructInputList(list: string[]): itemBase[] {
        return list.map((elem, i) => {
            return {
                name: elem,
                id: i,
            };
        });
    }

    private get form(): newTaskFormData {
        return {
            formName: this.state.formName,
            formHashlistName: this.state.formHashlistName,
            formAttackModeId: this.state.formAttackModeId,
            formCpuOnly: this.state.formCpuOnly,
            formRuleName: this.state.formRuleName,
            formMaskQuery: this.state.formMaskQuery,
            formPotfileName: this.state.formPotfileName,
            formKernelOpti: this.state.formKernelOpti,
            formWordlistName: this.state.formWordlistName,
            formWorkloadProfile: this.state.formWorkloadProfile,
            formBreakpointGPUTemperature:
                this.state.formBreakpointGPUTemperature,
        };
    }

    private handleInputChange = (
        event:
            | ChangeEvent<HTMLInputElement>
            | (React.MouseEvent<HTMLInputElement, MouseEvent> &
                  ChangeEvent<HTMLInputElement>)
    ) => {
        if (event.target.name !== '' && event.target.name in this.state) {
            const target = event.target;
            let value = Utils.santizeInput(event);
            if (target.name === 'formWorkloadProfile') {
                value = parseInt(value as string) || 1;
                if (value < 1) value = 1;
                else if (value > 4) value = 4;
            }
            if (target.name === 'formBreakpointGPUTemperature') {
                value = parseInt(value as string) || 0;
                if (value < 0) value = 0;
                else if (value > 110) value = 110;
            }
            if (target.name === 'formAttackModeId') {
                if (this.state.templateCheckboxIsChecked) {
                    const templateTask = this.state.templateTasks.find(
                        templateTask => {
                            return (
                                templateTask.id ===
                                this.state.templateTaskCheckBoxId
                            );
                        }
                    );
                    value =
                        templateTask?.options.attackModeId.id ||
                        this.state.attackModes[0].id;
                } else {
                    value = parseInt(value as string);
                }
            }
            this.setState({
                [target.name]: value,
            } as Pick<newTaskFormData, keyof newTaskFormData>);
        }
    };

    private handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        this.inputsError.analyse(this.form, {
            attackModes: this.state.attackModes,
            hashlist: this.state.hashlist,
            wordlist: this.state.wordlists,
            rules: this.state.rules,
            potfiles: this.state.potfiles,
        });
        this.setState({
            inputsErrorCheck: this.inputsError.results,
            formHasErrors: this.inputsError.hasErrors,
        });
        if (!this.inputsError.hasErrors) {
            const templateTask = this.state.templateTasks.find(templateTask => {
                return templateTask.id === this.state.templateTaskCheckBoxId;
            });
            const hashList = this.state.hashlist.find(hashlist => {
                return hashlist.name === this.state.formHashlistName;
            });
            const options: ApiOptionsFormData = {
                attackModeId: this.state.formAttackModeId,
                breakpointGPUTemperature:
                    this.state.formBreakpointGPUTemperature,
                wordlistName: this.state.formWordlistName,
                workloadProfileId: this.state.formWorkloadProfile,
                kernelOpti: this.state.formKernelOpti,
                CPUOnly: this.state.formCpuOnly,
            };
            if (hashList && templateTask) {
                this.submitForm({
                    name: this.state.formName,
                    description: 'test',
                    hashlistId: hashList.id,
                    templateTaskId: templateTask.id,
                    options,
                });
            } else if (hashList && this.form.formWordlistName.length > 0) {
                this.submitForm({
                    name: this.state.formName,
                    description: 'test',
                    hashlistId: hashList.id,
                    options,
                });
            } else {
                //TODO No reference found
            }
        }
    };

    private submitForm(form: ApiTaskFormData): void {
        // const requestOptions = {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(form),
        //     ...Constants.mandatoryFetchOptions,
        // };
        // fetch(Constants.apiPOSTCreateTemplate, requestOptions)
        //     .then(response => {
        //         return response.json();
        //     })
        //     .then(res => {
        //         if (res.success) {
        //             this.state.handleTaskCreationAdded();
        //         } else {
        //             this.state.handleTaskCreationError();
        //         }
        //         this.state.toggleNewTask();
        //     });
    }

    private handleTemplateTaskCheckbox(event) {
        if (this.state.templateCheckboxIsChecked) {
            this.setState({
                templateTaskCheckBoxId: -1,
                templateCheckboxIsChecked:
                    !this.state.templateCheckboxIsChecked,
                ...defaultFormData,
            });
        } else {
            const templateId = parseInt(event.target.name);
            const template = this.state.templateTasks.find(template => {
                return template.id === templateId;
            });
            if (template) {
                this.setState({
                    templateTaskCheckBoxId: templateId,
                    templateCheckboxIsChecked:
                        !this.state.templateCheckboxIsChecked,
                    formAttackModeId: template.options.attackModeId.id,
                    formCpuOnly: template.options.CPUOnly,
                    formRuleName: template.options.ruleName || '',
                    formMaskQuery: template.options.maskQuery || '',
                    formPotfileName: template.options.potfileName || '',
                    formKernelOpti: template.options.kernelOpti,
                    formWordlistName: template.options.wordlistId.name,
                    formWorkloadProfile:
                        template.options.workloadProfileId.profileId,
                    formBreakpointGPUTemperature:
                        template.options.breakpointGPUTemperature,
                });
            }
        }
    }

    private toggleHashlistCreation = () => {
        this.setState({
            hashlistCreationToggle: !this.state.hashlistCreationToggle,
        });
        this.state.hashlistCreationToggle
            ? (document.body.style.overflow = 'hidden')
            : (document.body.style.overflow = 'visible');
    };

    private importHashlistSuccess = () => {
        this.setState({
            importHashlistSuccessMessage: 'Successfull import',
        });
        this.fetchData();
        this.toggleHashlistCreation();
    };

    private async fetchData(): Promise<void> {
        const hashlist = await Utils.fetchListWithEndpoint<THashlist>(
            Constants.apiGetHashlists
        );
        const templateTasks = await Utils.fetchListWithEndpoint<TemplateTask>(
            Constants.apiGetTemplateTasks
        );
        const rules = await Utils.fetchListWithEndpoint<string>(
            Constants.apiGetRules
        );
        const potfiles = await Utils.fetchListWithEndpoint<string>(
            Constants.apiGetPotfiles
        );
        const wordlists = await Utils.fetchListWithEndpoint<string>(
            Constants.apiGetWordlists
        );
        const attackModes = await Utils.fetchListWithEndpoint<TAttackMode>(
            Constants.apiGetAttackModes
        );

        this.setState({
            hashlist,
            templateTasks,
            rules: this.constructInputList(rules),
            potfiles: this.constructInputList(potfiles),
            wordlists: this.constructInputList(wordlists),
            attackModes,
        });
    }
}
