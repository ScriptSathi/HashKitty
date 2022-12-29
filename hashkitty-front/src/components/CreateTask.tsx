import React, { Component } from 'react';

import {
    cardBody,
    mandatoryBody,
    title,
    contentBody,
    inputs,
    inputName,
    labels,
    submitInput,
    divCheckbox,
    inputCheckboxes,
    advancedConfigs,
    advancedConfigsImg,
    advancedConfigsTxt,
    advancedConfigsDivMain,
    advancedConfigsDivLeft,
    formBody,
    divRadio,
} from '../styles/CreateTask';
import { Constants } from '../Constants';
import { ErrorHandling } from '../ErrorHandling';
import { THashlist, TemplateTask, TAttackMode } from '../types/TypesORM';
import {
    ApiOptionsFormData,
    ApiTaskFormData,
    newTaskFormData,
} from '../types/TComponents';
import { newTaskInputsError } from '../types/TErrorHandling';
import InputDropdown, { inputItem } from './minorComponents/InputDropdown';
import toggleClose from '../assets/images/toggleClose.svg';
import toggleOpen from '../assets/images/toggleOpen.svg';

type CreateTaskState = {
    handleTaskCreationAdded: () => void;
    handleTaskCreationError: () => void;
    toggleNewTask: () => void;
    inputsErrorCheck: newTaskInputsError;
    formHasErrors: boolean;
    createOptionsToggle: boolean;
    isMouseIn: boolean;
    templateCheckboxIsChecked: boolean;
    templateTaskCheckBoxId: number;
    hashlist: THashlist[];
    wordlists: inputItem[];
    templateTasks: TemplateTask[];
    rules: inputItem[];
    attackModes: TAttackMode[];
    potfiles: inputItem[];
} & newTaskFormData;

interface CreateTaskProps {
    handleTaskCreationAdded: () => void;
    handleTaskCreationError: () => void;
    toggleNewTask: () => void;
}

type inputDatalist = {
    list: THashlist[] | TemplateTask[];
    formName: keyof CreateTaskState;
};

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
            <div
                style={{
                    position: 'absolute',
                    top: '10%',
                    left: '27.5%',
                    width: '45%',
                    height: this.state.createOptionsToggle ? 800 : 400,
                }}
            >
                <div style={cardBody}>
                    <div style={contentBody}>
                        <p style={title}>New Task</p>
                        <form
                            onSubmit={e => {
                                this.handleSubmit(e);
                            }}
                            style={formBody}
                        >
                            <div style={mandatoryBody}>
                                <div>
                                    <this.renderLabelName />
                                    <br />
                                    <this.renderLabelHashlist />
                                    <this.renderAdvancedConfigButton />
                                </div>
                                <div>
                                    <this.renderTemplateTaskCheckBox
                                        list={this.state.templateTasks}
                                    />
                                </div>
                            </div>
                            <div
                                style={
                                    this.state.createOptionsToggle
                                        ? advancedConfigsDivMain
                                        : { visibility: 'hidden' }
                                }
                            >
                                <div style={advancedConfigsDivLeft}>
                                    <this.renderLabelRules />
                                    <br />
                                    <this.renderLabelWordlist />
                                    <br />
                                    <this.renderLabelWorkloadProfiles />
                                    <br />
                                    <this.renderLabelCPUOnly />
                                    <br />
                                    <br />
                                    <this.renderLabelKernelOpti />
                                </div>
                                <div style={advancedConfigsDivLeft}>
                                    <this.renderLabelPotfiles />
                                    <this.renderLabelAttackModes />
                                    <br />
                                    <this.renderLabelBreakpointTemp />
                                </div>
                            </div>
                            <input
                                style={{ ...inputs, ...submitInput }}
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
                    : target.value.replace(/[^\w._-]/gi, '');
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

    private handleSubmit = event => {
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

    private renderLabelAttackModes = () => {
        return this.state.attackModes.length > 0 ? (
            <div style={{ marginTop: 30 }}>
                <p style={{ margin: 0 }}>Choose an attack mode</p>
                <p
                    style={
                        this.state.formHasErrors
                            ? { margin: 0, color: 'red' }
                            : { margin: 0, visibility: 'hidden' }
                    }
                >
                    {this.state.inputsErrorCheck.formAttackModeId.message}
                </p>
                <div style={divRadio}>
                    {this.state.attackModes.map(elem => {
                        return (
                            <label key={elem.id}>
                                <input
                                    style={inputCheckboxes}
                                    type="radio"
                                    name="formAttackModeId"
                                    value={elem.id}
                                    checked={
                                        this.state.formAttackModeId === elem.id
                                    }
                                    onChange={event =>
                                        this.handleInputChange(event)
                                    }
                                ></input>
                                {`${elem.mode} - ${elem.name}`}
                            </label>
                        );
                    })}
                </div>
            </div>
        ) : (
            <p>No attack modes loaded</p>
        );
    };

    private renderTemplateTaskCheckBox = ({
        list,
    }: Pick<inputDatalist, 'list'>) => {
        return (
            <label>
                Choose a template
                {list.length > 0 ? (
                    <div style={divCheckbox}>
                        {list.map(elem => {
                            return (
                                <label key={elem.id}>
                                    <input
                                        style={inputCheckboxes}
                                        type="checkbox"
                                        checked={
                                            this.state
                                                .templateTaskCheckBoxId ===
                                            elem.id
                                        }
                                        name={elem.id}
                                        value={elem.name}
                                        onChange={e =>
                                            this.handleTemplateTaskCheckbox(e)
                                        }
                                    ></input>
                                    {elem.name.length > 20
                                        ? elem.name.slice(0, 17) + '...'
                                        : elem.name}
                                </label>
                            );
                        })}
                    </div>
                ) : (
                    <p>No template tasks loaded</p>
                )}
            </label>
        );
    };

    private renderAdvancedConfigButton = () => {
        return (
            <div style={advancedConfigs} onClick={this.toggleOptionCreation}>
                <img
                    style={advancedConfigsImg}
                    src={this.toggleIcon}
                    alt="options icon"
                />
                <p style={advancedConfigsTxt}>Advanced configs</p>
            </div>
        );
    };

    private renderLabelWordlist = () => {
        return (
            <label style={labels}>
                Choose a wordlist
                <p
                    style={
                        this.state.formHasErrors &&
                        this.state.inputsErrorCheck.formWordlistName.isError
                            ? { margin: 0, color: 'red' }
                            : { margin: 0, visibility: 'hidden' }
                    }
                >
                    {this.state.inputsErrorCheck.formWordlistName.message}
                </p>
                <InputDropdown
                    list={this.state.wordlists}
                    formName="formWordlistName"
                    handleInputChange={this.handleInputChange}
                />
            </label>
        );
    };

    private renderLabelRules = () => {
        return (
            <label style={labels}>
                Choose a rule
                <p
                    style={
                        this.state.formHasErrors &&
                        this.state.inputsErrorCheck.formRuleName.isError
                            ? { margin: 0, color: 'red' }
                            : { margin: 0, visibility: 'hidden' }
                    }
                >
                    {this.state.inputsErrorCheck.formRuleName.message}
                </p>
                <InputDropdown
                    list={this.state.rules}
                    formName="formRuleName"
                    handleInputChange={this.handleInputChange}
                />
            </label>
        );
    };

    private renderLabelPotfiles = () => {
        return (
            <label style={labels}>
                Choose a potfile
                <p
                    style={
                        this.state.formHasErrors &&
                        this.state.inputsErrorCheck.formPotfileName.isError
                            ? { display: 'grid', margin: 0, color: 'red' }
                            : { margin: 0, visibility: 'hidden' }
                    }
                >
                    {this.state.inputsErrorCheck.formPotfileName.message}
                </p>
                <InputDropdown
                    list={this.state.potfiles}
                    formName="formPotfileName"
                    handleInputChange={this.handleInputChange}
                />
            </label>
        );
    };

    private renderLabelHashlist = () => {
        return (
            <label style={{ ...labels, display: 'grid' }}>
                Choose a hashlist
                <p
                    style={
                        this.state.formHasErrors &&
                        this.state.inputsErrorCheck.formHashlistName.isError
                            ? { display: 'grid', margin: 0, color: 'red' }
                            : { margin: 0, visibility: 'hidden' }
                    }
                >
                    {this.state.inputsErrorCheck.formHashlistName.message}
                </p>
                <InputDropdown
                    list={this.state.hashlist}
                    formName="formHashlistName"
                    handleInputChange={this.handleInputChange}
                />
            </label>
        );
    };

    private renderLabelName = () => {
        return (
            <label style={labels}>
                Name
                <p
                    style={
                        this.state.formHasErrors &&
                        this.state.inputsErrorCheck.formName.isError
                            ? { display: 'grid', margin: 0, color: 'red' }
                            : { margin: 0, visibility: 'hidden' }
                    }
                >
                    {this.state.inputsErrorCheck.formName.message}
                </p>
                <input
                    type="text"
                    placeholder="Task name"
                    style={{ ...inputs, ...inputName }}
                    value={this.state.formName}
                    name="formName"
                    onChange={event => this.handleInputChange(event)}
                ></input>
            </label>
        );
    };

    private renderLabelWorkloadProfiles = () => {
        return (
            <label style={labels}>
                Workload profile (default: 3)
                <p
                    style={
                        this.state.formHasErrors &&
                        this.state.inputsErrorCheck.formWorkloadProfile.isError
                            ? { display: 'grid', margin: 0, color: 'red' }
                            : { margin: 0, visibility: 'hidden' }
                    }
                >
                    {this.state.inputsErrorCheck.formWorkloadProfile.message}
                </p>
                <input
                    type="number"
                    placeholder="Workload profile"
                    style={{
                        ...inputs,
                        width: '50px',
                        display: 'block',
                        marginTop: 10,
                    }}
                    value={this.state.formWorkloadProfile}
                    name="formWorkloadProfile"
                    onChange={event => this.handleInputChange(event)}
                ></input>
            </label>
        );
    };

    private renderLabelBreakpointTemp = () => {
        return (
            <label style={labels}>
                Breakpoint Temperature (default: 90)
                <p
                    style={
                        this.state.formHasErrors &&
                        this.state.inputsErrorCheck.formBreakpointGPUTemperature
                            .isError
                            ? { display: 'grid', margin: 0, color: 'red' }
                            : { margin: 0, visibility: 'hidden' }
                    }
                >
                    {
                        this.state.inputsErrorCheck.formBreakpointGPUTemperature
                            .message
                    }
                </p>
                <input
                    type="number"
                    placeholder="Breakpoint Temperature"
                    style={{
                        ...inputs,
                        width: '50px',
                        display: 'block',
                        marginTop: 10,
                    }}
                    value={this.state.formBreakpointGPUTemperature}
                    name="formBreakpointGPUTemperature"
                    onChange={event => this.handleInputChange(event)}
                ></input>
            </label>
        );
    };

    private renderLabelKernelOpti = () => {
        return (
            <label style={labels}>
                Kernel optimization (default: No)
                <input
                    type="checkbox"
                    value="true"
                    name="formKernelOpti"
                    checked={this.state.formKernelOpti}
                    style={{ marginLeft: 10, width: 20, height: 20 }}
                    onChange={event => this.handleInputChange(event)}
                ></input>
            </label>
        );
    };

    private renderLabelCPUOnly = () => {
        return (
            <label style={labels}>
                CPU Only (default: No)
                <input
                    type="checkbox"
                    value="true"
                    name="formCpuOnly"
                    checked={this.state.formCpuOnly}
                    style={{ marginLeft: 10, width: 20, height: 20 }}
                    onChange={event => this.handleInputChange(event)}
                ></input>
            </label>
        );
    };
}
