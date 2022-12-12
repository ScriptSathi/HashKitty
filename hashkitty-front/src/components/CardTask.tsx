import React, { Component, CSSProperties } from 'react';
import { TTask } from '../types/TypesORM';

class CardTask extends Component<TTask, TTask> {
    // display: 'grid',
    // height: 309,
    // width: 445,
    // backgroundColor: 'yellow',
    // border: '1px solid',

    private main: CSSProperties = {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        display: 'grid',
        height: 309,
        width: 445,
        backgroundColor: 'red',
        border: '1px solid',
    };
    render() {
        return (
            <div style={this.main}>
                <div>
                    <p>{this.props.name}</p>
                    <p>{this.props.description}</p>
                </div>
                <div></div>
                <div></div>
            </div>
        );
    }
}

export default CardTask;
