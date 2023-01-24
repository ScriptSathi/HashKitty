import React, { Component, FormEvent } from 'react';

import './CreateTask.scss';

import { Constants } from '../../Constants';
import {
    RenderAdvancedConfigButton,
    RenderLabelAttackModes,
    RenderLabelCPUOnly,
    RenderLabelHashlist,
    RenderLabelKernelOpti,
    RenderLabelName,
    RenderLabelPotfiles,
    RenderLabelRules,
    RenderLabelWordlist,
    RenderLabelWorkloadProfiles,
    RenderTemplateTaskCheckBox,
} from './Render';
import { ErrorHandling } from '../../ErrorHandling';
import { THashlist, TemplateTask, TAttackMode } from '../../types/TypesORM';
import {
    ApiOptionsFormData,
    ApiTaskFormData,
    newTaskFormData,
} from '../../types/TComponents';
import { inputItem } from '../InputDropDown./InputDropdown';
import toggleClose from '../../assets/images/toggleClose.svg';
import toggleOpen from '../../assets/images/toggleOpen.svg';
import { CreateTaskProps, CreateTaskState } from './TCreateTask';
import './CreateTask.scss';

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

export default class CreateTask extends Component<
    CreateTaskProps,
    CreateTaskState
> {
    private toggleIcon = toggleClose;
    private inputsError: ErrorHandling;
    constructor(props: CreateTaskProps) {
        super(props);
        this.inputsError = new ErrorHandling();
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
            formHashlistName: '',
            ...defaultFormData,
        };
    }

    public async componentDidMount(): Promise<void> {
        const hashlist = await this.fetchListWithEndpoint<THashlist>(
            Constants.apiGetHashlists
        );
        const templateTasks = await this.fetchListWithEndpoint<TemplateTask>(
            Constants.apiGetTemplateTasks
        );
        const rules = await this.fetchListWithEndpoint<string>(
            Constants.apiGetRules
        );
        const potfiles = await this.fetchListWithEndpoint<string>(
            Constants.apiGetPotfiles
        );
        const wordlists = await this.fetchListWithEndpoint<string>(
            Constants.apiGetWordlists
        );
        const attackModes = await this.fetchListWithEndpoint<TAttackMode>(
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

    public render() {
        return (
            <div className="cardBody">
                <div
                    style={{
                        height: this.state.createOptionsToggle ? 750 : 350,
                    }}
                >
                    <div className="contentBody">
                        <p className="title">New Task</p>
                        <form
                            onSubmit={e => {
                                this.handleSubmit(e);
                            }}
                            className="formBody"
                        >
                            <div className="mandatoryBody">
                                <div>
                                    <RenderLabelName
                                        state={this.state}
                                        handleInputChange={
                                            this.handleInputChange
                                        }
                                    />
                                    <br />
                                    <RenderLabelHashlist
                                        state={this.state}
                                        handleInputChange={
                                            this.handleInputChange
                                        }
                                        buttonClick={() => {}}
                                    />
                                    <RenderAdvancedConfigButton
                                        toggleOptionCreation={
                                            this.toggleOptionCreation
                                        }
                                        toggleIcon={this.toggleIcon}
                                    />
                                </div>
                                <div>
                                    <RenderTemplateTaskCheckBox
                                        list={this.state.templateTasks}
                                        state={this.state}
                                        handleTemplateTaskCheckbox={
                                            this.handleTemplateTaskCheckbox
                                        }
                                    />
                                </div>
                            </div>
                            <div
                                className={
                                    this.state.createOptionsToggle
                                        ? 'advancedConfigsDivMain'
                                        : 'hideBlock'
                                }
                            >
                                <div>
                                    <RenderLabelRules
                                        state={this.state}
                                        handleInputChange={
                                            this.handleInputChange
                                        }
                                    />
                                    <br />
                                    <RenderLabelWordlist
                                        state={this.state}
                                        handleInputChange={
                                            this.handleInputChange
                                        }
                                    />
                                    <br />
                                    <br />
                                    <RenderLabelWorkloadProfiles
                                        state={this.state}
                                        handleInputChange={
                                            this.handleInputChange
                                        }
                                    />
                                    <br />
                                    <RenderLabelCPUOnly
                                        state={this.state}
                                        handleInputChange={
                                            this.handleInputChange
                                        }
                                    />
                                    <br />
                                    <RenderLabelKernelOpti
                                        state={this.state}
                                        handleInputChange={
                                            this.handleInputChange
                                        }
                                    />
                                </div>
                                <div className="advancedConfigsDivLeft">
                                    <RenderLabelPotfiles
                                        state={this.state}
                                        handleInputChange={
                                            this.handleInputChange
                                        }
                                    />
                                    <RenderLabelAttackModes
                                        state={this.state}
                                        handleInputChange={
                                            this.handleInputChange
                                        }
                                    />
                                    <br />
                                    <RenderLabelWorkloadProfiles
                                        state={this.state}
                                        handleInputChange={
                                            this.handleInputChange
                                        }
                                    />
                                </div>
                            </div>
                            <input
                                className="inputs submitInput"
                                type="submit"
                                value="Create task"
                            ></input>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    private constructInputList(list: string[]): inputItem[] {
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

    private handleInputChange = event => {
        if (event.target.name !== '' && event.target.name in this.state) {
            const target = event.target;
            let value =
                target.type === 'checkbox'
                    ? target.checked
                    : target.value.replace(' ', '-').replace(/[^\w._-]/gi, '');
            if (target.name === 'formWorkloadProfile') {
                value = parseInt(value) || 1;
                if (value < 1) value = 1;
                else if (value > 4) value = 4;
            }
            if (target.name === 'formBreakpointGPUTemperature') {
                value = parseInt(value) || 0;
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
                    value = parseInt(value);
                }
            }
            this.setState({
                [target.name]: value,
            } as Pick<CreateTaskState, keyof CreateTaskState>);
        }
    };

    private handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        this.inputsError.checkTask(this.form, {
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
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
            ...Constants.mandatoryFetchOptions,
        };
        fetch(Constants.apiPOSTCreateTask, requestOptions)
            .then(response => {
                return response.json();
            })
            .then(res => {
                if (res.success) {
                    this.state.handleTaskCreationAdded();
                } else {
                    this.state.handleTaskCreationError();
                }
                this.state.toggleNewTask();
            });
    }

    private async fetchListWithEndpoint<List>(
        endpoint: string
    ): Promise<List[]> {
        const req = await (
            await fetch(endpoint, Constants.mandatoryFetchOptions)
        ).json();
        return req && req.success && req.success.length > 0 ? req.success : [];
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

    private toggleOptionCreation = () => {
        this.setState({
            createOptionsToggle: !this.state.createOptionsToggle,
        });
        this.toggleIcon = this.state.createOptionsToggle
            ? toggleClose
            : toggleOpen;
    };

    private toggleHashlistCreation = () => {
        this.setState({
            hashlistCreationToggle: !this.state.hashlistCreationToggle,
        });
    };
}
