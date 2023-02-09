import React, { Component } from 'react';

import Frame from '../../components/Frame/Frame';
import Button from '../../components/Button/Button';
import './Template.scss';
import Card from '../../components/Card/Card';

type TemplateState = {
    createTemplateToggle: boolean;
};

type TemplateProps = {};

export default class Template extends Component<TemplateProps, TemplateState> {
    constructor(props: TemplateProps) {
        super(props);
        this.state = {
            createTemplateToggle: false,
        };
    }
    public render() {
        return (
            <Frame
                className={this.state.createTemplateToggle ? 'lockScreen' : ''}
            >
                <div className="Title">
                    <div className="divGridSplit TitleWidth">
                        <p className="noMarginTop">Templates</p>
                        <Button>Create new template</Button>
                    </div>
                </div>
                <div className="tasksBody">
                    <this.TemplateCard />
                </div>
            </Frame>
        );
    }

    private TemplateCard = () => {
        const hashTypeName =
            'this.props.hashlistId.hashTypeId.name'.length > 20
                ? 'this.props.hashlistId.hashTypeId.name'.substring(0, 20) +
                  '...'
                : 'this.props.hashlistId.hashTypeId.name';
        return (
            <Card>
                <div className="topPart">
                    <div className="topLeftPart">
                        <p className="taskName">this.props.name</p>
                        <div className="taskSoftInfos">
                            <p>
                                {hashTypeName}
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
        );
    };
}
