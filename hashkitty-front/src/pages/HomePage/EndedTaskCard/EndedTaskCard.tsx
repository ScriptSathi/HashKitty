import React, { Component } from 'react';
import duration from 'humanize-duration';

import { TTask } from '../../../types/TypesORM';
import './EndedTaskCard.scss';

import resultsLogo from '../../../assets/images/results.png';
import { Constants } from '../../../Constants';
import BackgroundBlur from '../../../components/ui/BackgroundBlur/BackGroundBlur';
import ResultsCard from '../ResultsCard/ResultsCard';
import Card from '../../../components/ui/Card/Card';
import DeleteButton from '../../../components/ui/DeleteButton/DeleteButton';

type EndedTaskCardState = {
    moreDetailsClicked: boolean;
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
        isRunning: this.props.isRunning,
        onErrorStart: '',
        endedSince: 'Unknown',
        isMouseOverResultBtn: false,
    };

    private interval: number;

    public componentDidMount() {
        this.setNewDurationTime();
        this.interval = setInterval(() => this.setNewDurationTime(), 20000);
    }

    public componentWillUnmount() {
        clearInterval(this.interval);
    }

    public render() {
        return (
            <Card>
                <div className="topPart">
                    <div className="topLeftPart">
                        <p className="taskName">{this.props.name}</p>
                        <div className="taskSoftInfos">
                            <this.renderTaskInfo />
                        </div>
                    </div>
                    <div className="showResults">
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
                    <div className="cardDeleteButton">
                        <DeleteButton
                            apiEndpoint={Constants.apiPOSTDeleteTasks}
                            idToDelete={this.props.id}
                            handleRefreshAfterDelete={
                                this.props.handleRefreshTasks
                            }
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
            </Card>
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

    private displayResults = () => {
        this.props.toggleDisplayResults();
        this.setState({
            toggledResults: !this.state.toggledResults,
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
