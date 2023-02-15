import React, { Component } from 'react';

import Frame from '../../components/Frame/Frame';
import Button from '../../components/Button/Button';
import './Template.scss';
import Card from '../../components/Card/Card';
import CreateTemplate from '../../components/CreateTemplate/CreateTemplate';
import { Constants } from '../../Constants';
import { TemplateTask } from '../../types/TypesORM';

type TemplateState = {
    createTemplateToggle: boolean;
    templateCreationAdded: boolean;
    templateCreationError: boolean;
    templates: TemplateTask[];
};

type TemplateProps = {};

export default class Template extends Component<TemplateProps, TemplateState> {
    constructor(props: TemplateProps) {
        super(props);
        this.state = {
            createTemplateToggle: false,
            templateCreationAdded: false,
            templateCreationError: false,
            templates: [],
        };
    }

    public async componentDidMount(): Promise<void> {
        await this.loadTemplates();
    }

    public render() {
        // if (!this.state.createTemplateToggle) {
        //     location.href = '';
        // }
        return (
            <Frame
                className={this.state.createTemplateToggle ? 'lockScreen' : ''}
            >
                <div className="Title">
                    <div className="divGridSplit TitleWidth">
                        <p className="noMarginTop">Templates</p>
                        <Button onClick={this.toggleCreateTemplate}>
                            Create new template
                        </Button>
                    </div>
                </div>
                <div className="tasksBody">
                    <this.TemplateCards />
                </div>
                <div id="blur">
                    <CreateTemplate
                        handleTaskCreationAdded={
                            this.handleTemplateCreationAdded
                        }
                        handleTaskCreationError={
                            this.handleTemplateCreationError
                        }
                        toggleNewTask={this.toggleCreateTemplate}
                        isToggled={this.state.createTemplateToggle}
                    />
                </div>
            </Frame>
        );
    }

    private TemplateCards = () => {
        const hashTypeName =
            'this.props.hashlistId.hashTypeId.name'.length > 20
                ? 'this.props.hashlistId.hashTypeId.name'.substring(0, 20) +
                  '...'
                : 'this.props.hashlistId.hashTypeId.name';
        return (
            <div>
                {this.state.templates.map(template => (
                    <Card key={template.id}>
                        <div className="topPart">
                            <div className="topLeftPart">
                                <p className="taskName">{template.name}</p>
                                <div className="taskSoftInfos">
                                    <p>
                                        {`${template.options.attackModeId.mode} - ${template.options.attackModeId.name}`}
                                        <br />
                                        this.props.templateTaskId ?
                                        this.props.templateTaskId.name : ''
                                        <br />
                                        this.props.hashlistId.name
                                        <br />
                                        this.props.options.wordlistId.name
                                        <br />
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bottomBox">
                            <div>
                                <p className="bottomBoxText">Mistery Data</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        );
    };

    private toggleCreateTemplate: () => void = () => {
        this.setState({
            createTemplateToggle: !this.state.createTemplateToggle,
        });
        this.state.createTemplateToggle
            ? (document.body.style.overflow = 'visible')
            : (document.body.style.overflow = 'hidden');
    };

    private handleTemplateCreationAdded = () => {
        this.setState({
            templateCreationAdded: true,
        });
        this.loadTemplates();
        setTimeout(() => {
            this.setState({
                templateCreationAdded: false,
            });
        }, 5000);
    };

    private handleTemplateCreationError = () => {
        this.setState({
            templateCreationError: true,
        });
        setTimeout(() => {
            this.setState({
                templateCreationError: false,
            });
        }, 5000);
    };

    private async loadTemplates(): Promise<void> {
        const templates =
            ((
                await (
                    await fetch(
                        Constants.apiGetTemplateTasks,
                        Constants.mandatoryFetchOptions
                    )
                ).json()
            ).success as TemplateTask[]) || [];
        this.setState({
            templates,
        });
    }
}
