import React, { Component } from 'react';

import Navbar from '../Navbar/Navbar';
import './Frame.scss';
import { ReactElement } from 'react';

type FrameState = {};

type FrameProps = {
    children: React.ReactNode;
    className?: string;
    message?: ReactElement;
};

export default class Frame extends Component<FrameProps, FrameState> {
    public render() {
        return (
            <div className={this.props.className}>
                <Navbar />
                {this.props.message}
                <div className="FrameBox">{this.props.children}</div>
            </div>
        );
    }
}
