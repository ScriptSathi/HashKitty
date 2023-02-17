import React, { Component } from 'react';

import Frame from '../../components/Frame/Frame';
import Button from '../../components/ui/Button/Button';
import './Template.scss';
import Card from '../../components/ui/Card/Card';
import CreateTemplate from './CreateTemplate/CreateTemplate';
import { Constants } from '../../Constants';
import { TemplateTask } from '../../types/TypesORM';
import DeleteButton from '../../components/ui/DeleteButton/DeleteButton';

type TemplateState = {
    createTemplateToggle: boolean;
    templateCreationMessage: JSX.Element;
    templateCreationError: boolean;
    templates: TemplateTask[];
};

type TemplateProps = {};

export default class Template extends Component<TemplateProps, TemplateState> {
    constructor(props: TemplateProps) {
        super(props);
        this.state = {
            createTemplateToggle: false,
            templateCreationMessage: <></>,
            templateCreationError: false,
            templates: [],
        };
    }

    public async componentDidMount(): Promise<void> {
        await this.loadTemplates();
    }

    public render() {
        return (
            <Frame
                className={this.state.createTemplateToggle ? 'lockScreen' : ''}
                message={this.state.templateCreationMessage}
            >
                <div className="Title">
                    <div className="divGridSplit TitleWidth">
                        <p className="noMarginTop">Templates</p>
                        <Button onClick={this.toggleCreateTemplate}>
                            Create new template
                        </Button>
                    </div>
                </div>
                <div className="flex alignCenter">
                    <div className="templateCardGrid ">
                        <this.TemplateCards />
                    </div>
                </div>
                <div id="blur">
                    <CreateTemplate
                        handleTemplateCreation={this.handleTemplateCreation}
                        toggleNewTask={this.toggleCreateTemplate}
                        isToggled={this.state.createTemplateToggle}
                    />
                </div>
            </Frame>
        );
    }

    private TemplateCards = () => {
        function shorten(str: string): string {
            return str.length > 20 ? str.substring(0, 15) + '...' : str;
        }
        return (
            <>
                {this.state.templates.map(template => (
                    <Card key={template.id} smallCard>
                        <div className="topLeftPart">
                            <div className="grid gridColumn3-1">
                                <p className="taskName marginBottom5">
                                    {shorten(template.name)}
                                </p>
                                <div className="templateDeleteButton">
                                    <DeleteButton
                                        apiEndpoint={
                                            Constants.apiPOSTDeleteTemplate
                                        }
                                        idToDelete={template.id}
                                        handleRefreshAfterDelete={
                                            this.refreshTemplates
                                        }
                                    />
                                </div>
                            </div>
                            <div className="taskSoftInfos sizingTemplateCard">
                                <p className="noMarginBottom">{`${template.options.attackModeId.mode} - ${template.options.attackModeId.name}`}</p>
                                <p className="noMargin">
                                    <strong>Wordlist :</strong>{' '}
                                    {template.options.wordlistId.name}
                                </p>
                                <p className="noMargin">
                                    {template.options.potfileName &&
                                    template.options.potfileName?.length > 0 ? (
                                        <>
                                            <strong>Potfile :</strong>{' '}
                                            {template.options.potfileName}
                                        </>
                                    ) : (
                                        ''
                                    )}
                                </p>
                                <p className="noMargin">
                                    {template.options.ruleName &&
                                    template.options.ruleName?.length > 0 ? (
                                        <>
                                            <strong>Rule :</strong>{' '}
                                            {template.options.ruleName}
                                        </>
                                    ) : (
                                        ''
                                    )}
                                </p>
                            </div>
                        </div>
                    </Card>
                ))}
            </>
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

    private handleTemplateCreation = (message: string, isError = false) => {
        this.setState({
            templateCreationMessage: (
                <p
                    className={`fontMedium creationTaskStatusMessage ${
                        isError ? 'colorRed' : 'colorGreen'
                    }`}
                >
                    {message}
                </p>
            ),
        });
        this.toggleCreateTemplate();
        this.loadTemplates();
        setTimeout(() => {
            this.setState({
                templateCreationMessage: <></>,
            });
        }, 5000);
    };

    private async loadTemplates(): Promise<void> {
        const templates =
            ((
                await (
                    await fetch(
                        Constants.apiGetTemplate,
                        Constants.mandatoryFetchOptions
                    )
                ).json()
            ).success as TemplateTask[]) || [];
        this.setState({
            templates,
        });
    }

    private refreshTemplates = () => {
        this.loadTemplates();
    };
}
