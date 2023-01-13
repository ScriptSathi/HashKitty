import React, { Component } from 'react';
import duration from 'humanize-duration';

import { TTask } from '../types/TypesORM';
import {
    bottomBox,
    bottomBoxText,
    cardBodyGeneric,
    cardOnStartError,
    moreDetails,
    deleteButton,
    taskName,
    taskSoftInfos,
    topLeftPart,
    topPart,
    resultsButton,
} from '../styles/EndedTaskCard';
import '../assets/styles/main.scss';
import trash from '../assets/images/trash.svg';
import resultsLogo from '../assets/images/results.png';
import { Constants } from '../Constants';
import BackgroundBlur from './BackgroundBlur/BackGroundBlur';
import ResultsCard from './ResultsCard/ResultsCard';

type EndedTaskCardState = {
    mouseIsEnterTaskCard: boolean;
    mouseIsEnterRunTask: boolean;
    moreDetailsClicked: boolean;
    clickedRunTask: boolean;
    onErrorStart: string;
    isRunning: boolean;
    isMouseOverResultBtn: boolean;
    toggledResults: boolean;
    endedSince: string;
};

type EndedTaskCardProps = TTask & { isRunning: boolean } & {
    handleRefreshTasks: () => Promise<void>;
    toggleDisplayResults: () => void;
};

export default class EndedTaskCard extends Component<
    EndedTaskCardProps,
    EndedTaskCardState
> {
    public state: EndedTaskCardState = {
        mouseIsEnterTaskCard: false,
        mouseIsEnterRunTask: false,
        moreDetailsClicked: false,
        toggledResults: false,
        clickedRunTask: this.props.isRunning,
        isRunning: this.props.isRunning,
        onErrorStart: '',
        endedSince: 'Unknown',
        isMouseOverResultBtn: false,
    };

    private interval: number;
    private displayedLogo = trash;
    private cardBody = cardBodyGeneric;

    public componentDidMount() {
        this.setNewDurationTime();
        this.interval = setInterval(() => this.setNewDurationTime(), 20000);
    }

    public componentWillUnmount() {
        clearInterval(this.interval);
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
                        <img
                            style={
                                this.state.isMouseOverResultBtn
                                    ? {
                                          ...resultsButton,
                                          filter: 'invert(55%) sepia(6%) saturate(5000%) hue-rotate(314deg) brightness(100%) contrast(200%)',
                                      }
                                    : resultsButton
                            }
                            onClick={this.displayResults}
                            onMouseEnter={this.mouseOverResBtn}
                            onMouseLeave={this.mouseOverResBtn}
                            src={resultsLogo}
                            alt="Displaying results"
                        ></img>
                        <p style={cardOnStartError}>
                            {this.state.onErrorStart}
                        </p>
                    </div>
                </div>
                <div style={bottomBox}>
                    <p style={bottomBoxText}>
                        <br />
                        Ended since: {this.state.endedSince}
                        <br />
                        Nb of cracked passwords:{' '}
                        {this.props.hashlistId.numberOfCrackedPasswords}
                    </p>
                    <div style={deleteButton}>
                        <img
                            className={
                                this.state.mouseIsEnterRunTask
                                    ? 'deleteTask'
                                    : ''
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
                <BackgroundBlur
                    isToggled={this.state.toggledResults}
                    toggleFn={this.displayResults}
                    centerContent={true}
                >
                    <ResultsCard
                        hashlistName={this.props.hashlistId.name}
                        hashlistId={this.props.hashlistId.id}
                    />
                </BackgroundBlur>
            </div>
        );
    }

    private setNewDurationTime(): void {
        this.setState({
            endedSince: duration(
                Date.parse(this.props.endeddAt || '') - Date.now().valueOf(),
                {
                    largest: 1,
                    maxDecimalPoints: 0,
                    units: ['y', 'mo', 'w', 'd', 'h', 'm'],
                }
            ),
        });
    }

    private displayErrorMessageOnDeleteTask(): void {
        this.setState({ onErrorStart: 'An error occured' });
        setTimeout(() => this.setState({ onErrorStart: '' }), 3000);
    }

    private mouseOverResBtn = (): void => {
        this.setState({
            isMouseOverResultBtn: !this.state.isMouseOverResultBtn,
        });
    };

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

    private displayResults = () => {
        this.props.toggleDisplayResults();
        this.setState({
            toggledResults: !this.state.toggledResults,
        });
    };

    private onClickDeleteTask: () => void = () => {
        this.fetchDeleteTask(!this.state.clickedRunTask);
    };

    private onMouseEnterCard: () => void = () => {
        this.setState({
            mouseIsEnterTaskCard: true,
        });
        this.cardBody = {
            ...cardBodyGeneric,
            boxShadow: '0px 5px 5px 0px #FC6F6F',
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
