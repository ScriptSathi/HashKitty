import React, { Component, CSSProperties } from 'react';

interface NewTaskProps {
    toggle: () => void;
}

class NewTask extends Component<NewTaskProps> {
    private handleClick = () => {
        this.props.toggle();
    };

    private cardBody: CSSProperties = {
        backgroundColor: 'orange',
        position: 'absolute',
        top: '20%',
        left: '20%',
        right: '20%',
        width: '60%',
        height: 440,
    };

    render() {
        return (
            <div style={this.cardBody}>
                <span onClick={this.handleClick}>X</span>
                <p>I'm A Pop Up!!!</p>
            </div>
        );
    }
}

export default NewTask;
