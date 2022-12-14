import React, { Component, CSSProperties } from 'react';

import { TTask } from '../types/TypesORM';
import { THashcatStatus } from '../types/TServer';
import CardTask from './CardTask';

export default class RunningTasksBody extends Component<{
    tasks: TTask[];
    status: THashcatStatus | {};
}> {
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

    render() {
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
                                status={this.props.status}
                            />
                        );
                    })
                )}
            </div>
        );
    }
}
