import React, { Component, CSSProperties } from 'react';

import { TTask } from '../types/TypesORM';
import { THashcatStatus } from '../types/TServer';
import CardTask from './CardTask';
import { Constants } from '../Constants';

type RunningTasksBodyProps = {
    tasks: TTask[];
};

export default class RunningTasksBody extends Component<RunningTasksBodyProps> {
    private runningSessionName = '';
    private style: CSSProperties = {
        display: 'grid',
        gridTemplateColumns: 'minmax(auto, 36%) auto',
        gap: '45px 20px',
    };

    private styleNoTasksYet: CSSProperties = {
        fontSize: '20px',
        marginTop: '2em',
        marginLeft: '2em',
    };

    public async componentDidMount() {
        const req = await (await fetch(Constants.apiGetStatus)).json();
        if (req.status !== undefined && Object.keys(req.status).length !== 0) {
            const status = req.status as THashcatStatus;
            this.runningSessionName = status.session || '';
        } else {
            this.runningSessionName = '';
        }
    }

    public render() {
        return (
            <div style={this.style}>
                {this.props.tasks.length === 0 ? (
                    <p style={this.styleNoTasksYet}>No tasks yet</p>
                ) : (
                    this.props.tasks.map(task => {
                        return (
                            <CardTask
                                key={task.id}
                                id={task.id}
                                name={task.name}
                                options={task.options}
                                hashTypeId={task.hashTypeId}
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
                            />
                        );
                    })
                )}
            </div>
        );
    }
}
