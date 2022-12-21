import React, { Component } from 'react';

import Navbar from '../components/Navbar';
import newTask from '../assets/images/newTask.svg';
import '../assets/fonts/Inter-Bold.ttf';
import '../assets/styles/main.scss';
import '../assets/styles/HomePage.scss';
import { TTask } from '../types/TypesORM';
import RunningTasksBody from '../components/RunningTasksBody';
import {
    mainBox,
    LeftBox,
    runningTasksTitle,
    cardBody,
} from '../styles/HomePage';
import { Constants } from '../Constants';
import CreateTask from '../components/CreateTask';

type HomePageState = {
    newTaskToogle: boolean;
    isMouseOverNewTask: boolean;
    tasks: TTask[];
};

export default class HomePage extends Component<HomePageState> {
    public state: HomePageState = {
        newTaskToogle: false,
        isMouseOverNewTask: false,
        tasks: [],
    };

    public async componentDidMount() {
        const tasks =
            ((await (await fetch(Constants.apiGetTasks)).json())
                .success as TTask[]) || [];
        this.setState({
            tasks,
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

    private onMouseEnterNewTaskCantClick: () => void = () => {
        this.setState({
            isMouseOverNewTask: true,
        });
    };

    private onMouseLeaveNewTaskCanClick: () => void = () => {
        this.setState({
            isMouseOverNewTask: false,
        });
    };

    public render() {
        return (
            <div style={this.state.newTaskToogle ? { overflow: 'hidden' } : {}}>
                <Navbar />
                <div style={mainBox}>
                    <div style={LeftBox}>
                        <div style={runningTasksTitle}>
                            <p>Running tasks</p>
                        </div>
                        <div style={cardBody}>
                            <RunningTasksBody tasks={this.state.tasks} />
                            <div>
                                <img
                                    className="newTask"
                                    src={newTask}
                                    alt="create a new task"
                                    onClick={this.toggleNewTask}
                                />
                                <div
                                    style={
                                        this.state.newTaskToogle
                                            ? {
                                                  position: 'absolute',
                                                  backdropFilter:
                                                      'blur(5px) brightness(0.60)',
                                                  height: '100%',
                                                  width: '100%',
                                                  top: 0,
                                                  left: 0,
                                              }
                                            : {}
                                    }
                                    onClick={
                                        this.state.isMouseOverNewTask
                                            ? () => {}
                                            : this.toggleNewTask
                                    }
                                >
                                    <div
                                        onMouseEnter={
                                            this.onMouseEnterNewTaskCantClick
                                        }
                                        onMouseLeave={
                                            this.onMouseLeaveNewTaskCanClick
                                        }
                                        style={
                                            this.state.newTaskToogle
                                                ? {
                                                      position: 'absolute',
                                                      top: '50%',
                                                      left: '50%',
                                                      transform:
                                                          'translate(-50%, -70%)',
                                                      width: '45%',
                                                      height: 400,
                                                  }
                                                : {}
                                        }
                                    >
                                        {this.state.newTaskToogle ? (
                                            <CreateTask />
                                        ) : (
                                            ''
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
