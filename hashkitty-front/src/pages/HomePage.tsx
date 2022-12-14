import React, { Component, CSSProperties } from 'react';

import Navbar from '../components/Navbar';
import newTask from '../assets/images/newTask.svg';
import '../assets/fonts/Inter-Bold.ttf';
import '../assets/styles/main.scss';
import '../assets/styles/HomePage.scss';
import NewTask from '../components/NewTask';
import { TTask } from '../types/TypesORM';
import { THashcatStatus } from '../types/TServer';
import RunningTasksBody from '../components/RunningTasksBody';
import {
    mainBox,
    LeftBox,
    runningTasksTitle,
    cardBody,
} from '../styles/HomePage';
import { Constants } from '../Constants';

class HomePage extends Component<{
    newTaskToogle: boolean;
    tasks: TTask[];
    status: THashcatStatus;
}> {
    public state = {
        newTaskToogle: false,
        tasks: [],
        status: {},
    };

    private toggleNewTask: () => void = () => {
        this.setState({
            newTaskToogle: !this.state.newTaskToogle,
        });
    };

    public async componentDidMount() {
        const tasks =
            ((await (await fetch(Constants.apiGetTasks)).json())
                .success as TTask[]) || [];
        const status = (await (await fetch(Constants.apiGetStatus)).json())
            .status as THashcatStatus;
        this.setState({
            tasks: tasks,
            status: status,
        });
    }

    render() {
        return (
            <div className="App">
                <Navbar />
                <div style={mainBox}>
                    <div style={LeftBox}>
                        <div style={runningTasksTitle}>
                            <p>Running tasks</p>
                        </div>
                        <div style={cardBody}>
                            <RunningTasksBody
                                status={this.state.status}
                                tasks={this.state.tasks}
                            />
                            <div>
                                <img
                                    className="newTask"
                                    src={newTask}
                                    alt="create a new task"
                                    onClick={this.toggleNewTask}
                                />
                                {this.state.newTaskToogle ? (
                                    <NewTask toggle={this.toggleNewTask} />
                                ) : (
                                    ''
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default HomePage;
