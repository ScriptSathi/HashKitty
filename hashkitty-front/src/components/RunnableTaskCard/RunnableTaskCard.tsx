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
import { THashcatRunningStatus, THashcatStatus } from '../../types/TServer';

type RunnableTaskCardState = {
    mouseIsEnterTaskCard: boolean;
    mouseIsEnterRunTask: boolean;
    moreDetailsClicked: boolean;
    clickedRunTask: boolean;
    onErrorStart: string;
    processState: 'running' | 'pending' | 'stopped';
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
        processState: 'stopped',
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
            <div className="cardBodyGeneric">
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
                            Speed: {this.state.speed}
                            <br />
                            Progress: {this.state.runningProgress}
                            <br />
                            Time left: {this.state.estimatedStop}
                        </p>
                    </div>
                    <div className="runButton">
                        {!this.isPending ? (
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
                                    marginRight: 10,
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

    private get isRunning(): boolean {
        return this.state.processState === 'running';
    }

    private get isPending(): boolean {
        return this.state.processState === 'pending';
    }

    private refreshStatus: () => Promise<void> = async () => {
        if (this.props.hashlistId.crackedOutputFileName) {
            this.displayErrorMessage('This hashlist has already been cracked');
            setTimeout(() => this.props.handleRefreshTasks(), 500);
        } else if (this.isRunning || this.isPending) {
            await this.fetchStatus();
            setTimeout(this.refreshStatus, 500);
        } else {
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
            const req: { status: THashcatStatus } = await reqJson.json();
            this.setProcessStateOnFetch(req);
            if (this.isPending || this.isRunning || retryFetch < 0) {
                if (Object.keys(req.status.runningStatus).length !== 0) {
                    this.setStatusData(req.status.runningStatus);
                    this.updateStopButton();
                } else {
                    setTimeout(() => {
                        this.fetchStatus(
                            this.isPending ? 0 : (retryFetch += 1)
                        );
                    }, 500);
                }
            } else if (req.status.exitInfo.length > 0) {
                this.updateStartButton();
                this.displayErrorMessage(req.status.exitInfo);
            } else {
                this.updateStartButton();
                this.displayErrorMessage('An error occured');
            }
        } catch (e) {
            this.updateStartButton();
            this.displayErrorMessage('Server is unreachable');
        }
    }

    private setProcessStateOnFetch(req: { status: THashcatStatus }) {
        try {
            this.state.processState = req.status.processState;
        } catch (e) {
            this.state.processState = 'stopped';
        }
    }

    private displayErrorMessage(msg: string): void {
        this.setState({ onErrorStart: msg });
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
        this.state.processState = 'pending';
        setTimeout(() => {
            this.fetchStatus();
            this.refreshStatus();
        }, 1000);
    }

    private fetchStopHashcat(): void {
        const requestOptions = {
            method: 'GET',
            ...Constants.mandatoryFetchOptions,
        };
        fetch(Constants.apiGetStop, requestOptions)
            .then(response => response.json())
            .then(() => {
                this.refreshStatus();
                this.updateStartButton();
            });
    }

    private onClickRunOrStopTask: () => void = () => {
        if (!this.isRunning) {
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

    private setStatusData(status: THashcatRunningStatus): void {
        function getFirstDigitsOfNumber(number: number): number {
            return parseInt(number.toString().split('.')[0]);
        }
        const runningProgress = `${
            (status.progress[0] / status.progress[1]) * 100
        }%`;
        const timeLeft = status.estimated_stop * 1000 - Date.now().valueOf();
        const estimatedStop =
            timeLeft > 0
                ? duration(
                      status.estimated_stop * 1000 - Date.now().valueOf(),
                      {
                          largest: 2,
                          maxDecimalPoints: 0,
                          units: ['y', 'mo', 'w', 'd', 'h', 'm'],
                      }
                  )
                : '0 minutes';
        const unFormatedSpeed = status.devices[0].speed;
        let speed = '';
        if (unFormatedSpeed > Math.pow(10, 12)) {
            const tmp = unFormatedSpeed / Math.pow(10, 12);
            speed = `${getFirstDigitsOfNumber(tmp)} TH/S`;
        } else if (unFormatedSpeed > Math.pow(10, 9)) {
            const tmp = unFormatedSpeed / Math.pow(10, 9);
            speed = `${getFirstDigitsOfNumber(tmp)} GH/S`;
        } else if (unFormatedSpeed > Math.pow(10, 6)) {
            const tmp = unFormatedSpeed / Math.pow(10, 6);
            speed = `${getFirstDigitsOfNumber(tmp)} MH/S`;
        } else if (unFormatedSpeed > Math.pow(10, 3)) {
            const tmp = unFormatedSpeed / Math.pow(10, 3);
            speed = `${getFirstDigitsOfNumber(tmp)} KH/S`;
        }
        this.setState({
            estimatedStop,
            runningProgress,
            speed,
        });
    }
}
