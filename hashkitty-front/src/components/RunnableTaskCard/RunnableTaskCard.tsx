import React, { Component } from 'react';
import duration from 'humanize-duration';

import { TTask } from '../../types/TypesORM';

import '../../assets/styles/main.scss';
import './RunnableTaskCard.scss';
import loader from '../../assets/images/loader.svg';
import stopTask from '../../assets/images/stopTask.svg';
import stopTaskHover from '../../assets/images/stopTaskHover.svg';
import startTaskHover from '../../assets/images/playTaskHover.svg';
import startTask from '../../assets/images/playTask.svg';
import { Constants } from '../../Constants';
import { THashcatStatus } from '../../types/TServer';

type RunnableTaskCardState = {
    mouseIsEnterTaskCard: boolean;
    mouseIsEnterRunTask: boolean;
    taskIsFinnished: boolean;
    moreDetailsClicked: boolean;
    clickedRunTask: boolean;
    onErrorStart: string;
    isRunning: boolean;
    isLoading: boolean;
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
        taskIsFinnished: false,
        moreDetailsClicked: false,
        clickedRunTask: this.props.isRunning,
        isRunning: this.props.isRunning,
        isLoading: false,
        onErrorStart: '',
        estimatedStop: 'Not running',
        runningProgress: '0',
        speed: '0',
    };
    private logo = this.state.clickedRunTask ? stopTask : startTask;
    private logoHover = this.state.clickedRunTask
        ? stopTaskHover
        : startTaskHover;
    private displayedLogo = this.logo;

    public componentDidMount(): void {
        this.refreshStatus();
    }

    public render() {
        return (
            <div
                onMouseEnter={this.onMouseEnterCard}
                onMouseLeave={this.onMouseLeaveCard}
                className="cardBodyGeneric"
            >
                <div className="topPart">
                    <div className="topLeftPart">
                        <p className="taskName">{this.props.name}</p>
                        <div className="taskSoftInfos">
                            <this.renderTaskInfo />
                        </div>
                    </div>
                    <div className="moreDetails">
                        <p onClick={() => alert(1)} className="moreDetails">
                            More details
                        </p>
                        <p className="cardOnStartError">
                            {this.state.onErrorStart}
                        </p>
                    </div>
                </div>
                <div className="bottomBox">
                    <div>
                        <p className="bottomBoxText">
                            Speed: {this.state.speed} H/s
                            <br />
                            Progress: {this.state.runningProgress}
                            <br />
                            Time left: {this.state.estimatedStop}
                        </p>
                    </div>
                    <div className="runButton">
                        {!this.state.isLoading ? (
                            <img
                                onMouseEnter={this.onMouseEnterRunTask}
                                onMouseLeave={this.onMouseLeaveRunTask}
                                onClick={this.onClickRunOrStopTask}
                                src={this.displayedLogo}
                                style={{
                                    cursor: 'pointer',
                                    display: 'block',
                                }}
                                alt="Logo"
                            />
                        ) : (
                            <img
                                onMouseLeave={this.onMouseLeaveRunTask}
                                className="loader"
                                src={loader}
                                alt="loader"
                                style={{
                                    display: 'block',
                                    marginLeft: 5,
                                    marginTop: 5,
                                }}
                            />
                        )}
                    </div>
                </div>
                {this.state.moreDetailsClicked ? <p>Bonjour</p> : ''}
            </div>
        );
    }

    private refreshStatus: () => Promise<void> = async () => {
        if (this.props.hashlistId.crackedOutputFileName) {
            this.displayHashlistAlreadyCracked();
            setTimeout(() => this.props.handleRefreshTasks(), 2000);
        } else if (this.state.isRunning) {
            await this.fetchStatus();
            setTimeout(this.refreshStatus, 2000);
        } else {
            this.setState({ isLoading: false });
            this.updateStartButton();
            this.props.handleRefreshTasks();
            this.setState({
                estimatedStop: 'Not running',
                runningProgress: '0',
                speed: '0',
            });
        }
    };

    private async fetchStatus(retryFetch = 0): Promise<void> {
        try {
            const reqJson = await fetch(
                Constants.apiGetStatus,
                Constants.mandatoryFetchOptions
            );
            const req = await reqJson.json();
            if (retryFetch < 5) {
                if (
                    req.status.status !== undefined &&
                    Object.keys(req.status.status).length !== 0 &&
                    req.status.status.session ===
                        `${this.props.name}-${this.props.id}`
                ) {
                    const status = req.status.status as THashcatStatus;
                    const runningProgress = `${
                        (status.progress[0] / status.progress[1]) * 100
                    }%`;
                    const timeLeft =
                        status.estimated_stop * 1000 - Date.now().valueOf();
                    const estimatedStop =
                        timeLeft > 0
                            ? duration(
                                  status.estimated_stop * 1000 -
                                      Date.now().valueOf(),
                                  {
                                      largest: 2,
                                      maxDecimalPoints: 0,
                                      units: ['y', 'mo', 'w', 'd', 'h', 'm'],
                                  }
                              )
                            : '0 minutes';
                    this.setState({
                        taskIsFinnished: req.status.ended,
                        estimatedStop,
                        runningProgress,
                        speed: `${status.devices[0].speed}`,
                    });
                    this.state.isRunning = req.status.isRunning;
                    this.state.isLoading = false;
                    this.updateStopButton();
                } else {
                    setTimeout(() => {
                        this.fetchStatus((retryFetch += 1));
                    }, 500);
                }
            } else {
                this.state.isRunning = false;
                this.state.isLoading = false;
                this.updateStartButton();
                this.displayErrorMessageOnHashcatStart();
            }
        } catch (e) {
            this.state.isRunning = false;
            this.state.isLoading = false;
            this.updateStartButton();
            this.displayUnreachableOnHashcatStart();
        }
    }

    private displayErrorMessageOnHashcatStart(): void {
        this.setState({ onErrorStart: 'An error occured' });
        setTimeout(() => this.setState({ onErrorStart: '' }), 3000);
    }

    private displayUnreachableOnHashcatStart(): void {
        this.setState({ onErrorStart: 'Server is unreachable' });
        setTimeout(() => this.setState({ onErrorStart: '' }), 3000);
    }

    private displayHashlistAlreadyCracked(): void {
        this.setState({
            onErrorStart: 'This hashlist has already been cracked',
        });
        setTimeout(() => this.setState({ onErrorStart: '' }), 3000);
    }

    private fetchStartHashcat(): void {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: this.props.id }),
            ...Constants.mandatoryFetchOptions,
        };
        fetch(Constants.apiPOSTStart, requestOptions);
        this.refreshStatus();
    }

    private fetchStopHashcat(): void {
        const requestOptions = {
            method: 'GET',
            ...Constants.mandatoryFetchOptions,
        };
        fetch(Constants.apiGetStop, requestOptions)
            .then(response => response.json())
            .then(() => {
                this.state.isRunning = false;
                this.refreshStatus();
                this.updateStartButton();
            });
    }

    private onClickRunOrStopTask: () => void = () => {
        if (!this.state.isRunning) {
            this.state.isRunning = true;
            this.state.isLoading = true;
            this.fetchStartHashcat();
        } else {
            this.fetchStopHashcat();
        }
    };

    private updateStopButton(): void {
        this.logo = stopTask;
        this.logoHover = stopTaskHover;
        this.displayedLogo = this.state.mouseIsEnterRunTask
            ? this.logoHover
            : this.logo;
    }

    private updateStartButton(): void {
        this.logo = startTask;
        this.logoHover = startTaskHover;
        this.displayedLogo = this.state.mouseIsEnterRunTask
            ? this.logoHover
            : this.logo;
    }

    private onMouseEnterCard: () => void = () => {
        this.setState({
            mouseIsEnterTaskCard: true,
        });
    };

    private onMouseLeaveCard: () => void = () => {
        this.setState({
            mouseIsEnterTaskCard: false,
        });
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
