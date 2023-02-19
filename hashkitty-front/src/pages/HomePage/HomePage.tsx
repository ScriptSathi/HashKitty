import React, { Component, ReactElement } from 'react';

import newTask from '../../assets/images/newTask.svg';
import '../../assets/fonts/Inter-Bold.ttf';
import '../../assets/styles/main.scss';
import './HomePage.scss';
import { TTask } from '../../types/TypesORM';
import TasksBody from './TasksBody';
import { Constants } from '../../Constants';
import CreateTask from './CreateTask/CreateTask';
import Frame from '../../components/Frame/Frame';

type HomePageState = {
    taskCreationMessage: ReactElement;
    newTaskToogle: boolean;
    taskCreationAdded: boolean;
    isMouseOvershowResultsCard: boolean;
    taskCreationError: boolean;
    taskResultsToggle: boolean;
    isMouseOverNewTask: boolean;
    hashlistCreationToggle: boolean;
    tasks: TTask[];
    endedTasks: TTask[];
};

type HomePageProps = {};

export default class HomePage extends Component<HomePageProps, HomePageState> {
    public state: HomePageState = {
        taskCreationAdded: false,
        taskCreationMessage: <></>,
        isMouseOvershowResultsCard: false,
        hashlistCreationToggle: false,
        taskResultsToggle: false,
        taskCreationError: false,
        newTaskToogle: false,
        isMouseOverNewTask: false,
        tasks: [],
        endedTasks: [],
    };

    public componentDidMount() {
        this.loadTasks();
    }

    public render() {
        return (
            <Frame
                className={
                    this.state.newTaskToogle || this.state.taskResultsToggle
                        ? 'lockScreen'
                        : ''
                }
                message={this.state.taskCreationMessage}
            >
                <div className="SplitTasks">
                    <div className="HomepageLeftBox">
                        <div className="Title">
                            <p className="noMarginTop">Running tasks</p>
                        </div>
                        <div className="HomePagecardBody">
                            <div className="runningTasks">
                                <TasksBody
                                    tasks={this.state.tasks}
                                    handleRefreshTasks={this.loadTasks.bind(
                                        this
                                    )}
                                />
                            </div>
                            <div>
                                <img
                                    className="newTask"
                                    src={newTask}
                                    alt="create a new task"
                                    onClick={this.toggleNewTask}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="HomePageRightBox">
                        <div className="Title">
                            <p className="noMarginTop">Ended tasks</p>
                        </div>
                        <div className="tasksBody">
                            <TasksBody
                                handleRefreshTasks={this.handleRefreshTasks}
                                tasks={this.state.endedTasks}
                                toggleDisplayResults={this.toggleTaskResults}
                            />
                        </div>
                    </div>
                </div>
                <div id="blur">
                    <CreateTask
                        handleTaskCreation={this.handleTaskCreation}
                        toggleNewTask={this.toggleNewTask}
                        isToggled={this.state.newTaskToogle}
                    />
                </div>
            </Frame>
        );
    }

    private handleRefreshTasks = (): Promise<void> => {
        return this.loadTasks();
    };

    private async loadTasks(): Promise<void> {
        const allTasks =
            ((
                await (
                    await fetch(
                        Constants.apiGetTasks,
                        Constants.mandatoryFetchOptions
                    )
                ).json()
            ).success as TTask[]) || [];
        const [tasks, endedTasks] = allTasks.reduce(
            ([tasks, endedTasks]: TTask[][], element: TTask) =>
                element.isfinished
                    ? [tasks, [...endedTasks, ...[element]]]
                    : [[...tasks, ...[element]], endedTasks],
            [[], []]
        );
        this.setState({
            tasks,
            endedTasks,
        });
    }

    private toggleNewTask: () => void = () => {
        this.setState({
            newTaskToogle: !this.state.newTaskToogle,
        });
        this.hiddenOverflowOnToggle();
    };

    private toggleTaskResults: () => void = () => {
        this.setState({
            taskResultsToggle: !this.state.taskResultsToggle,
        });
        this.hiddenOverflowOnToggle();
    };

    private handleTaskCreation = (message: string, isError = false) => {
        this.setState({
            taskCreationMessage: (
                <p
                    className={`fontMedium creationTaskStatusMessage ${
                        isError ? 'colorRed' : 'colorGreen'
                    }`}
                >
                    {message}
                </p>
            ),
        });
        this.loadTasks();
        setTimeout(() => {
            this.setState({
                taskCreationMessage: <></>,
            });
        }, 5000);
    };

    private hiddenOverflowOnToggle() {
        this.state.newTaskToogle || this.state.taskResultsToggle
            ? (document.body.style.overflow = 'visible')
            : (document.body.style.overflow = 'hidden');
    }
}
