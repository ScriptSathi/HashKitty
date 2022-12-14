import React, { Component } from 'react';

import { TTask } from '../types/TypesORM';
import {
    bottomBox,
    bottomBoxText,
    cardBodyGeneric,
    moreDetails,
    runButton,
    shadow,
    taskName,
    taskSoftInfos,
    topLeftPart,
    topPart,
} from '../styles/CardTask';
import '../assets/styles/main.scss';
import stopTask from '../assets/images/stopTask.svg';
import stopTaskHover from '../assets/images/stopTaskHover.svg';
import playTaskHover from '../assets/images/playTaskHover.svg';
import playTask from '../assets/images/playTask.svg';
import CSSProperties from 'react';

export default class CardTask extends Component<
    TTask,
    {
        mouseIsEnterTaskCard: boolean;
        mouseIsEnterRunTask: boolean;
        clickedRunTask: boolean;
    }
> {
    private speed = 0; // TODO
    private progress = 0; // TODO
    private estimatedStop = 'Not running'; // TODO
    private logo = playTask; // TODO if state is running, then stopTask is displayed
    private logoHover = playTaskHover;
    private displayedLogo = this.logo;
    public state = {
        mouseIsEnterTaskCard: false,
        mouseIsEnterRunTask: false,
        clickedRunTask: false,
    };
    private cardBody = cardBodyGeneric;

    private onClickRunTask: () => void = () => {
        this.setState({
            clickedRunTask: !this.state.clickedRunTask,
        });
        this.logo = this.state.clickedRunTask ? stopTask : playTask;
        this.logoHover = this.state.clickedRunTask
            ? stopTaskHover
            : playTaskHover;
        this.displayedLogo = this.state.mouseIsEnterRunTask
            ? this.logoHover
            : this.logo;
    };

    private onMouseEnterCard: () => void = () => {
        this.setState({
            mouseIsEnterTaskCard: true,
        });
        this.cardBody = {
            ...cardBodyGeneric,
            boxShadow: '0px 15px 5px 0px #FC6F6F',
        };
    };

    private onMouseLeaveCard: () => void = () => {
        this.setState({
            mouseIsEnterTaskCard: false,
        });
        this.cardBody = cardBodyGeneric;
    };

    private onMouseEnterRunTask: () => void = () => {
        this.setState({
            mouseIsEnterRunTask: true,
        });
        this.displayedLogo = this.logoHover;
    };

    private onMouseLeaveRunTask: () => void = () => {
        this.setState({
            mouseIsEnterRunTask: false,
        });
        this.displayedLogo = this.logo;
    };

    private renderTaskInfo = () => {
        const hashTypeName =
            this.props.hashTypeId.name.length > 20
                ? this.props.hashTypeId.name.substring(0, 20) + '...'
                : this.props.hashTypeId.name;
        return (
            <p>
                {hashTypeName}
                <br />
                {this.props.templateTaskId
                    ? this.props.templateTaskId.name
                    : ''}
                <br />
                {this.props.hashlistId.name}
                <br />
                {this.props.options.wordlistId.name}
                <br />
            </p>
        );
    };

    render() {
        return (
            <div
                onMouseEnter={this.onMouseEnterCard}
                onMouseLeave={this.onMouseLeaveCard}
                style={this.cardBody}
            >
                <div style={topPart}>
                    <div style={topLeftPart}>
                        <p style={taskName}>{this.props.name}</p>
                        <div style={taskSoftInfos}>
                            <this.renderTaskInfo />
                        </div>
                    </div>
                    <div style={moreDetails}>
                        <p className="moreDetails">More details</p>
                    </div>
                </div>
                <div style={bottomBox}>
                    <div>
                        <p style={bottomBoxText}>
                            Speed: {this.speed} H/s
                            <br />
                            Progress: {this.progress}
                            <br />
                            Estimated end: {this.estimatedStop}
                        </p>
                    </div>
                    <div style={runButton}>
                        <img
                            onMouseEnter={this.onMouseEnterRunTask}
                            onMouseLeave={this.onMouseLeaveRunTask}
                            onClick={this.onClickRunTask}
                            src={this.displayedLogo}
                            alt="Logo"
                        />
                    </div>
                </div>
                <div style={shadow}></div>
            </div>
        );
    }
}
