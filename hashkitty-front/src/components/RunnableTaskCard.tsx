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
} from '../styles/RunnableTaskCard';
import '../assets/styles/main.scss';
import stopTask from '../assets/images/stopTask.svg';
import stopTaskHover from '../assets/images/stopTaskHover.svg';
import playTaskHover from '../assets/images/playTaskHover.svg';
import playTask from '../assets/images/playTask.svg';
import { Constants } from '../Constants';
import { THashcatStatus } from '../types/TServer';

type RunnableTaskCardState = {
    mouseIsEnterTaskCard: boolean;
    mouseIsEnterRunTask: boolean;
    moreDetailsClicked: boolean;
    clickedRunTask: boolean;
    onErrorStart: string;
    isRunning: boolean;
    estimatedStop: string;
    runningProgress: string;
    speed: string;
};

type RunnableTaskCardProps = TTask & { isRunning: boolean } & {
    handleRefreshTasks: () => Promise<void>;
};

export default class RunnableTaskCard extends Component<
    RunnableTaskCardProps,
    RunnableTaskCardState
> {
    public state: RunnableTaskCardState = {
        mouseIsEnterTaskCard: false,
        mouseIsEnterRunTask: false,
        moreDetailsClicked: false,
        clickedRunTask: this.props.isRunning,
        isRunning: this.props.isRunning,
        onErrorStart: '',
        estimatedStop: 'Not running',
        runningProgress: '0',
        speed: '0',
    };
    private logo = this.state.clickedRunTask ? stopTask : playTask;
    private logoHover = this.state.clickedRunTask
        ? stopTaskHover
        : playTaskHover;
    private displayedLogo = this.logo;
    private cardBody = cardBodyGeneric;

    public componentDidMount(): void {
        if (this.state.isRunning) {
            this.refreshStatus();
        }
    }

    public render() {
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
                        <p onClick={() => alert(1)} className="moreDetails">
                            More details
                        </p>
                        <p style={cardOnStartError}>
                            {this.state.onErrorStart}
                        </p>
                    </div>
                </div>
                <div style={bottomBox}>
                    <div>
                        <p style={bottomBoxText}>
                            Speed: {this.state.speed} H/s
                            <br />
                            Progress: {this.state.runningProgress}
                            <br />
                            Estimated end: {this.state.estimatedStop}
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
                {this.state.moreDetailsClicked ? <p>Bonjour</p> : ''}
            </div>
        );
    }

    private refreshStatus: () => void = () => {
        if (this.props.hashlistId.crackedOutputFileName) {
            this.displayHashlistAlreadyCracked();
            setTimeout(() => this.props.handleRefreshTasks(), 2000);
        } else if (this.state.isRunning) {
            fetch(Constants.apiGetStatus, Constants.mandatoryFetchOptions)
                .then(data => data.json())
                .then(req => {
                    if (
                        req.status !== undefined &&
                        Object.keys(req.status).length !== 0
                    ) {
                        const status = req.status as THashcatStatus;
                        this.setState({
                            estimatedStop: `${status.estimated_stop}`,
                            runningProgress: `${status.progress[0]}`, // TODO TEST this
                            speed: `${status.devices[0].speed}`,
                        });
                    } else {
                        this.state.isRunning = false;
                        this.updateStartStopButton();
                        this.displayErrorMessageOnHashcatStart();
                    }
                });
            if (this.state.isRunning) {
                setTimeout(this.refreshStatus, 2000);
            } else {
                this.refreshStatus();
            }
        } else {
            this.props.handleRefreshTasks();
            this.setState({
                estimatedStop: 'Not running',
                runningProgress: '0',
                speed: '0',
            });
        }
    };

    private displayErrorMessageOnHashcatStart(): void {
        this.setState({ onErrorStart: 'An error occured' });
        setTimeout(() => this.setState({ onErrorStart: '' }), 3000);
    }

    private displayHashlistAlreadyCracked(): void {
        this.setState({
            onErrorStart: 'This hashlist has already been cracked',
        });
        setTimeout(() => this.setState({ onErrorStart: '' }), 3000);
    }

    private fetchStartHashcat(isClicked: boolean): void {
        if (isClicked && !this.state.isRunning) {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: this.props.id }),
                ...Constants.mandatoryFetchOptions,
            };
            fetch(Constants.apiPOSTStart, requestOptions)
                .then(response => response.json())
                .then(() => {
                    this.state.isRunning = !this.state.isRunning;
                    this.refreshStatus();
                });
        }
    }

    private onClickRunTask: () => void = () => {
        this.updateStartStopButton();
        this.fetchStartHashcat(!this.state.clickedRunTask);
    };

    private updateStartStopButton(): void {
        this.setState({
            clickedRunTask: !this.state.clickedRunTask,
        });
        this.logo = this.state.clickedRunTask ? playTask : stopTask;
        this.logoHover = this.state.clickedRunTask
            ? playTaskHover
            : stopTaskHover;
        this.displayedLogo = this.state.mouseIsEnterRunTask
            ? this.logoHover
            : this.logo;
    }

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
            this.props.hashlistId.hashTypeId.name.length > 20
                ? this.props.hashlistId.hashTypeId.name.substring(0, 20) + '...'
                : this.props.hashlistId.hashTypeId.name;
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
}