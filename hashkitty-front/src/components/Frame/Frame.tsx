import React, { Component } from 'react';

import Navbar from '../Navbar/Navbar';
import './Frame.scss';

type FrameState = {};

type FrameProps = {
    children: React.ReactNode;
    className?: string;
};

export default class Frame extends Component<FrameProps, FrameState> {
    public render() {
        return (
            <div className={this.props.className}>
                <Navbar />
                <div className="FrameBox">{this.props.children}</div>
            </div>
        );
    }
}
