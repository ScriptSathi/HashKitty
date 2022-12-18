import React, { Component } from 'react';

import { TTask } from '../types/TypesORM';
import {
    bottomBox,
    bottomBoxText,
    cardBodyGeneric,
    cardOnStartError,
    moreDetails,
    runButton,
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
import { THashcatStatus } from '../types/TServer';
import { Constants } from '../Constants';

type CardTaskState = {
    mouseIsEnterTaskCard: boolean;
    mouseIsEnterRunTask: boolean;
    clickedRunTask: boolean;
    onErrorStart: string;
    status: THashcatStatus | { isRunning: boolean };
};

export default class CardTask extends Component<
    TTask & { status: THashcatStatus | { isRunning: boolean } },
    CardTaskState
> {
    private isRunning =
        'isRunning' in this.props.status ? this.props.status.isRunning : false;
    public state: CardTaskState = {
        mouseIsEnterTaskCard: false,
        mouseIsEnterRunTask: false,
        clickedRunTask: this.isRunning,
        status: this.props.status,
        onErrorStart: '',
    };
    private speed = 0; // TODO
    private progress = 0; // TODO
    private estimatedStop =
        this.isRunning && 'estimated_stop' in this.props.status
            ? this.props.status.estimated_stop
            : 'Not running';
    private logo = this.state.clickedRunTask ? stopTask : playTask;
    private logoHover = this.state.clickedRunTask
        ? stopTaskHover
        : playTaskHover;
    private displayedLogo = this.logo;
    private cardBody = cardBodyGeneric;

    private async fetchStatus(): Promise<void> {
        if (!this.isRunning) {
            const req = await (await fetch(Constants.apiGetStatus)).json();
            if (
                req.status !== undefined &&
                Object.keys(req.status).length !== 0
            ) {
                const status = req.status as THashcatStatus;
                this.state.status = { ...this.state.status, ...status };
            } else {
                this.state.status.isRunning = false;
                this.onClickRunTask();
                this.displayErrorMessageOnHashcatStart();
            }
        }
    }

    private displayErrorMessageOnHashcatStart(): void {
        this.setState({ onErrorStart: 'An error occured' });
        setTimeout(() => this.setState({ onErrorStart: '' }), 5000);
    }

    private fetchStartHashcat(isClicked: boolean): void {
        if (isClicked && !this.isRunning) {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: this.props.id }),
            };
            fetch(Constants.apiPOSTStart, requestOptions)
                .then(response => response.json())
                .then(() => this.fetchStatus());
        }
    }

    private onClickRunTask: () => void = () => {
        this.setState({
            clickedRunTask: !this.state.clickedRunTask,
        });
        this.fetchStartHashcat(!this.state.clickedRunTask);
        this.logo = this.state.clickedRunTask ? playTask : stopTask;
        this.logoHover = this.state.clickedRunTask
            ? playTaskHover
            : stopTaskHover;
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
            boxShadow: '0px 12px 5px 0px #FC6F6F',
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
                        <p style={cardOnStartError}>
                            {this.state.onErrorStart}
                        </p>
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
            </div>
        );
    }
}
