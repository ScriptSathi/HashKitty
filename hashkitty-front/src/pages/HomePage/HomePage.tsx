import React, { Component } from 'react';

import newTask from '../../assets/images/newTask.svg';
import '../../assets/fonts/Inter-Bold.ttf';
import '../../assets/styles/main.scss';
import './HomePage.scss';
import { TTask } from '../../types/TypesORM';
import TasksBody from '../../components/TasksBody';
import { Constants } from '../../Constants';
import CreateTask from '../../components/CreateTask/CreateTask';
import Frame from '../../components/Frame/Frame';

type HomePageState = {
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
                        handleTaskCreationAdded={this.handleTaskCreationAdded}
                        handleTaskCreationError={this.handleTaskCreationError}
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
        this.state.newTaskToogle
            ? (document.body.style.overflow = 'visible')
            : (document.body.style.overflow = 'hidden');
    };

    private toggleTaskResults: () => void = () => {
        this.setState({
            taskResultsToggle: !this.state.taskResultsToggle,
        });
        this.state.taskResultsToggle
            ? (document.body.style.overflow = 'visible')
            : (document.body.style.overflow = 'hidden');
    };

    private handleTaskCreationAdded = () => {
        this.setState({
            taskCreationAdded: true,
        });
        this.loadTasks();
        setTimeout(() => {
            this.setState({
                taskCreationAdded: false,
            });
        }, 5000);
    };

    private handleTaskCreationError = () => {
        this.setState({
            taskCreationError: true,
        });
        setTimeout(() => {
            this.setState({
                taskCreationError: false,
            });
        }, 5000);
    };

    private renderCreationTaskStatus = () => {
        let message = '';
        let style = 'creationTaskStatusMessage';

        if (this.state.taskCreationAdded) {
            style += ' colorGreen';
            message = 'New task added successfully';
        } else if (this.state.taskCreationError) {
            style += ' colorRed';
            message =
                'An error occured while creating the task. Check the server logs for more informations';
        }
        return <p className={style}>{message}</p>;
    };
}
