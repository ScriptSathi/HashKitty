import React, { Component } from 'react';
import duration from 'humanize-duration';

import { TTask } from '../../types/TypesORM';
import '../../assets/styles/main.scss';
import './EndedTaskCard.scss';
import trash from '../../assets/images/trash.svg';
import resultsLogo from '../../assets/images/results.png';
import { Constants } from '../../Constants';
import BackgroundBlur from '../BackgroundBlur/BackGroundBlur';
import ResultsCard from '../ResultsCard/ResultsCard';

type EndedTaskCardState = {
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

    public componentDidMount() {
        this.setNewDurationTime();
        this.interval = setInterval(() => this.setNewDurationTime(), 20000);
    }

    public componentWillUnmount() {
        clearInterval(this.interval);
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
                        <img
                            onClick={this.displayResults}
                            src={resultsLogo}
                            className="resultsButton"
                            alt="Displaying results"
                        ></img>
                        <p className="cardOnStartError">
                            {this.state.onErrorStart}
                        </p>
                    </div>
                </div>
                <div className="bottomBox">
                    <p className="bottomBoxText">
                        <br />
                        Ended since: {this.state.endedSince}
                        <br />
                        Nb of cracked passwords:{' '}
                        {this.props.hashlistId.numberOfCrackedPasswords}
                    </p>
                    <div className="deleteButton">
                        <img
                            className="deleteTask"
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
