import React, { Component } from 'react';

import {
    cardBody,
    mandatoryBody,
    title,
    mandatoryBodyRight,
    mandatoryBodyLeft,
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
} from '../styles/CreateTask';
import { Constants } from '../Constants';
import { THashlist, TemplateTask } from '../types/TypesORM';
import InputDropdown from './minorComponents/InputDropdown';
import toggleClose from '../assets/images/toggleClose.svg';
import toggleOpen from '../assets/images/toggleOpen.svg';

interface CreateTaskState {
    handleTaskCreationAdded: () => void;
    handleTaskCreationError: () => void;
    toggleNewTask: () => void;
    createOptionsToggle: boolean;
    isMouseIn: boolean;
    checkboxChecked: boolean;
    templateTaskCheckBoxId: number;
    hashlist: THashlist[];
    templateTasks: TemplateTask[];
    formName: string;
    formHashlistName: string;
    formAttackMode: number;
    formCpuOnly: boolean;
    formRuleName: string;
    formMaskQuery: string;
    formPotfileName: string;
    formKernelOpti: boolean;
    formWordlistName: string;
    formWordloadProfileId: number;
    formBreakpointGPUTemperature: number;
}

interface CreateTaskProps {
    handleTaskCreationAdded: () => void;
    handleTaskCreationError: () => void;
    toggleNewTask: () => void;
}

type inputDatalist = {
    list: THashlist[] | TemplateTask[];
    formName: keyof CreateTaskState;
};

export default class CreateTask extends Component<
    CreateTaskProps,
    CreateTaskState
> {
    private toggleIcon = toggleClose;
    constructor(props: CreateTaskProps) {
        super(props);
        this.state = {
            handleTaskCreationAdded: props.handleTaskCreationAdded,
            handleTaskCreationError: props.handleTaskCreationError,
            toggleNewTask: props.toggleNewTask,
            createOptionsToggle: false,
            isMouseIn: false,
            checkboxChecked: false,
            templateTaskCheckBoxId: -1,
            hashlist: [],
            templateTasks: [],
            formName: '',
            formHashlistName: '',
            formAttackMode: 0,
            formCpuOnly: false,
            formRuleName: '',
            formMaskQuery: '',
            formPotfileName: '',
            formKernelOpti: false,
            formWordlistName: '',
            formWordloadProfileId: -1,
            formBreakpointGPUTemperature: -1,
        };
    }

    public async componentDidMount(): Promise<void> {
        const hashlist = await this.fetchListWithEndpoint<THashlist>(
            Constants.apiGetHashlists
        );
        const templateTasks = await this.fetchListWithEndpoint<TemplateTask>(
            Constants.apiGetTemplateTasks
        );
        this.setState({
            hashlist,
            templateTasks,
        });
    }

    private handleInputChange = event => {
        if (event.target.name !== '' && event.target.name in this.state) {
            const target = event.target;
            const value =
                target.type === 'checkbox'
                    ? target.checked
                    : target.value.replace(/[^a-z0-9-_]/gi, '');
            this.setState({
                [target.name]: value,
            } as Pick<CreateTaskState, keyof CreateTaskState>);
        }
    };

    private handleSubmit = event => {
        event.preventDefault();
        const templateTask = this.state.templateTasks.find(templateTask => {
            return templateTask.id === this.state.templateTaskCheckBoxId;
        });
        const hashList = this.state.hashlist.find(hashlist => {
            return hashlist.name === this.state.formHashlistName;
        });
        if (hashList && templateTask) {
            this.submitForm({
                name: this.state.formName,
                description: 'test',
                hashTypeId: hashList.hashTypeId.id,
                hashlistId: hashList.id,
                templateTaskId: templateTask.id,
            });
        } else {
            //TODO No reference found
        }
        this.state.toggleNewTask();
    };

    private submitForm(form): void {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
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
            });
    }

    private async fetchListWithEndpoint<List>(
        endpoint: string
    ): Promise<List[]> {
        const req = await (await fetch(endpoint)).json();
        return req && req.success.length > 0 ? req.success : [];
    }

    private handleTemplateTaskCheckbox(event) {
        if (this.state.checkboxChecked) {
            this.setState({
                templateTaskCheckBoxId: -1,
                checkboxChecked: !this.state.checkboxChecked,
            });
        } else {
            this.setState({
                templateTaskCheckBoxId: parseInt(event.target.name),
                checkboxChecked: !this.state.checkboxChecked,
            });
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

    private renderTemplateTaskCheckBox = ({
        list,
    }: Pick<inputDatalist, 'list'>) => {
        return list.length > 0 ? (
            <div style={divCheckbox}>
                {list.map(elem => {
                    return (
                        <label key={elem.id}>
                            <input
                                style={inputCheckboxes}
                                type="checkbox"
                                checked={
                                    this.state.templateTaskCheckBoxId ===
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
        );
    };

    private renderAdvancedConfigButton = () => {
        return (
            <div style={advancedConfigs} onClick={this.toggleOptionCreation}>
                <p style={advancedConfigsTxt}>Advanced configs</p>
                <img
                    style={advancedConfigsImg}
                    src={this.toggleIcon}
                    alt="options icon"
                />
            </div>
        );
    };

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
                            style={mandatoryBody}
                        >
                            <div style={mandatoryBodyLeft}>
                                <label style={labels}>
                                    Name
                                    <input
                                        type="text"
                                        placeholder="Task name"
                                        style={{ ...inputs, ...inputName }}
                                        value={this.state.formName}
                                        name="formName"
                                        onChange={event =>
                                            this.handleInputChange(event)
                                        }
                                    ></input>
                                </label>
                                <br />
                                <label style={labels}>
                                    Choose a hashlist
                                    <InputDropdown
                                        list={this.state.hashlist}
                                        formName="formHashlistName"
                                        handleInputChange={
                                            this.handleInputChange
                                        }
                                    />
                                    <this.renderAdvancedConfigButton />
                                </label>
                            </div>
                            <div style={mandatoryBodyRight}>
                                <label>
                                    Choose a template
                                    <this.renderTemplateTaskCheckBox
                                        list={this.state.templateTasks}
                                    />
                                </label>
                                <input
                                    style={{ ...inputs, ...submitInput }}
                                    type="submit"
                                    value="Create task"
                                ></input>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}
