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
} from '../styles/EndedTaskCard';
import '../assets/styles/main.scss';
import trash from '../assets/images/trash.svg';
import { Constants } from '../Constants';

type EndedTaskCardState = {
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

type EndedTaskCardProps = TTask & { isRunning: boolean } & {
    handleRefreshTasks: () => Promise<void>;
};

export default class EndedTaskCard extends Component<
    EndedTaskCardProps,
    EndedTaskCardState
> {
    public state: EndedTaskCardState = {
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
    private displayedLogo = trash;
    private cardBody = cardBodyGeneric;

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
                            <br />
                            Ended at: {this.props.endeddAt}
                            <br />
                            Nb of cracked passwords:{' '}
                            {this.props.hashlistId.numberOfCrackedPasswords}
                        </p>
                    </div>
                    <div style={runButton}>
                        <img
                            className={
                                this.state.mouseIsEnterRunTask
                                    ? ''
                                    : 'deleteTask'
                            }
                            onMouseEnter={this.onMouseEnterRunTask}
                            onMouseLeave={this.onMouseLeaveRunTask}
                            onClick={this.onClickDeleteTask}
                            src={this.displayedLogo}
                            alt="Logo"
                        />
                    </div>
                </div>
                {this.state.moreDetailsClicked ? <p>Bonjour</p> : ''}
            </div>
        );
    }

    private displayErrorMessageOnDeleteTask(): void {
        this.setState({ onErrorStart: 'An error occured' });
        setTimeout(() => this.setState({ onErrorStart: '' }), 3000);
    }

    private fetchDeleteTask(isClicked: boolean): void {
        if (isClicked) {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: this.props.id }),
                ...Constants.mandatoryFetchOptions,
            };
            fetch(Constants.apiPOSTDeleteTasks, requestOptions)
                .then(response => response.json())
                .then(() => {
                    setTimeout(() => this.props.handleRefreshTasks(), 100);
                    //Delay is needed here to let the server update itself
                });
        }
    }

    private onClickDeleteTask: () => void = () => {
        this.fetchDeleteTask(!this.state.clickedRunTask);
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
    };

    private onMouseLeaveRunTask: () => void = () => {
        this.setState({
            mouseIsEnterRunTask: false,
        });
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
