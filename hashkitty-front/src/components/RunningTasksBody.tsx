import React, { Component, CSSProperties } from 'react';

import { TTask } from '../types/TypesORM';
import CardTask from './CardTask';

class RunningTasksBody extends Component<{ tasks: TTask[] }> {
    private style: CSSProperties = {
        display: 'grid',
        gridTemplateColumns: 'minmax(auto, 36%) auto',
        gap: '45px 20px',
    };

    render() {
        return (
            <div style={this.style}>
                {this.props.tasks.map(task => {
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
                        />
                    );
                })}
            </div>
        );
    }
}

export default RunningTasksBody;
