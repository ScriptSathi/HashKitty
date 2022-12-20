import React, { Component, CSSProperties } from 'react';

interface NewTaskState {
    isMouseIn: boolean;
}

export default class NewTask extends Component<{}, NewTaskState> {
    public state: NewTaskState = {
        isMouseIn: false,
    };

    private cardBody: CSSProperties = {
        backgroundColor: 'white',
        position: 'absolute',
        width: '100%',
        height: '100%',
        border: '2px solid',
        borderRadius: '8%',
    };

    render() {
        return (
            <div style={this.cardBody}>
                <p>I'm A Pop Up!!!</p>
            </div>
        );
    }
}
