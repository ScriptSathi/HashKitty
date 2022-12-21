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
    inputDatalists,
    submitInput,
    divCheckbox,
    inputCheckboxes,
} from '../styles/CreateTask';
import { Constants } from '../Constants';
import { THashlist, TemplateTask } from '../types/TypesORM';

interface CreateTaskState {
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

type inputDatalist = {
    list: THashlist[] | TemplateTask[];
    formName: keyof CreateTaskState;
};

export default class CreateTask extends Component<{}, CreateTaskState> {
    constructor(props: CreateTask) {
        super(props);
        this.state = {
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

    private handleInputChange(event) {
        if (event.target.name !== '' && event.target.name in this.state) {
            const target = event.target;
            const value =
                target.type === 'checkbox' ? target.checked : target.value;
            this.setState({
                [target.name]: value,
            } as Pick<CreateTaskState, keyof CreateTaskState>);
        }
    }

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
                hashTypeId: 1000, // TODO OMMMGGG IL FAUT CHANGER ça POUR LE METTRE DANS HASHLIST
                hashlistId: hashList.id,
                templateTaskId: templateTask.id,
            });
        } else {
            //TODO No reference found
        }
    };

    private submitForm(form): void {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        };
        fetch(Constants.apiPOSTCreateTask, requestOptions)
            .then(response => {
                console.log(response);
                return response.json();
            })
            .then(res => {
                if (res.success) {
                    console.log('WOOORKSS');
                    console.dir(res);
                } else {
                    console.log('Not work :(');
                    console.dir(res);
                }
            });
    }

    private async fetchListWithEndpoint<T>(endpoint: string): Promise<T[]> {
        const req = await (await fetch(endpoint)).json();
        return req && req.success.length > 0 ? req.success : [];
    }

    private renderInputDatalist = ({ list, formName }: inputDatalist) => {
        return list.length > 0 ? (
            <div>
                <input
                    type="text"
                    list={formName}
                    placeholder="Name of the list"
                    style={{ ...inputs, ...inputDatalists }}
                    value={this.state[formName] as string}
                    name={formName}
                    onChange={event => this.handleInputChange(event)}
                ></input>
                <datalist id={formName}>
                    {list.map(elem => {
                        return (
                            <option key={elem.id} value={elem.name}>
                                {elem.name.length > 20
                                    ? elem.name.slice(0, 17) + '...'
                                    : elem.name}
                            </option>
                        );
                    })}
                </datalist>
            </div>
        ) : (
            <p>No hashlist loaded</p>
        );
    };

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

    public render() {
        return (
            <div style={cardBody}>
                <div style={contentBody}>
                    <p style={title}>New Task</p>
                    <form
                        // action="/"
                        // method="post"
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
                                <this.renderInputDatalist
                                    list={this.state.hashlist}
                                    formName="formHashlistName"
                                />
                            </label>
                        </div>
                        <div style={mandatoryBodyRight}>
                            <label>
                                Choose a template task
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
        );
    }
}
