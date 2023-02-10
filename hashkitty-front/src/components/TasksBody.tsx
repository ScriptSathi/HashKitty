import React, { Component, CSSProperties } from 'react';

import { TTask } from '../types/TypesORM';
import { THashcatRunningStatus } from '../types/TServer';
import RunnableTaskCard from './RunnableTaskCard/RunnableTaskCard';
import { Constants } from '../Constants';
import EndedTaskCard from './EndedTaskCard/EndedTaskCard';

type RunningTasksBodyProps = {
    tasks: TTask[];
    handleRefreshTasks: () => Promise<void>;
    toggleDisplayResults?: () => void;
};

export default class RunningTasksBody extends Component<RunningTasksBodyProps> {
    private runningSessionName = '';

    private styleNoTasksYet: CSSProperties = {
        fontSize: '20px',
        marginTop: '2em',
        marginLeft: '2em',
        fontFamily: 'InterMedium',
    };

    public async componentDidMount() {
        const req = await (
            await fetch(Constants.apiGetStatus, Constants.mandatoryFetchOptions)
        ).json();
        if (req.status !== undefined && Object.keys(req.status).length !== 0) {
            const status = req.status as THashcatRunningStatus;
            this.runningSessionName = status.session || '';
        } else {
            this.runningSessionName = '';
        }
    }

    public render() {
        return (
            <>
                {this.props.tasks.length === 0 ? (
                    <p style={this.styleNoTasksYet}>No tasks yet</p>
                ) : (
                    this.props.tasks.map(task => {
                        return task.isfinished ? (
                            <EndedTaskCard
                                key={task.id}
                                id={task.id}
                                name={task.name}
                                options={task.options}
                                hashlistId={task.hashlistId}
                                createdAt={task.createdAt}
                                lastestModification={task.lastestModification}
                                description={task.description || ''}
                                templateTaskId={task.templateTaskId}
                                endeddAt={task.endeddAt}
                                isfinished={task.isfinished}
                                handleRefreshTasks={
                                    this.props.handleRefreshTasks
                                }
                                isRunning={
                                    this.runningSessionName ===
                                    `${task.name}-${task.id}`
                                }
                                toggleDisplayResults={
                                    this.props.toggleDisplayResults
                                        ? this.props.toggleDisplayResults
                                        : () => {}
                                }
                            />
                        ) : (
                            <RunnableTaskCard
                                key={task.id}
                                id={task.id}
                                name={task.name}
                                options={task.options}
                                hashlistId={task.hashlistId}
                                createdAt={task.createdAt}
                                lastestModification={task.lastestModification}
                                description={task.description || ''}
                                templateTaskId={task.templateTaskId}
                                endeddAt={task.endeddAt}
                                isfinished={task.isfinished}
                                isRunning={
                                    this.runningSessionName ===
                                    `${task.name}-${task.id}`
                                }
                                handleRefreshTasks={
                                    this.props.handleRefreshTasks
                                }
                            />
                        );
                    })
                )}
            </>
        );
    }
}
