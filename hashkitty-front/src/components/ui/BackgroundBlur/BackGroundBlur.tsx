import React, { Component } from 'react';

import './BackGroundBlur.scss';

interface BackgroundBlurProps {
    children: React.ReactNode;
    isToggled: boolean;
    centerContent: boolean;
    toggleFn: () => void | Promise<void>;
}

interface BackgroundBlurState {
    isMouseOver: boolean;
}

export default class BackgroundBlur extends Component<
    BackgroundBlurProps,
    BackgroundBlurState
> {
    public state: BackgroundBlurState = {
        isMouseOver: false,
    };

    public render() {
        document.body.className = 'noMargin';
        return (
            <div
                className={this.props.isToggled ? 'backgroundBlur' : ''}
                onClick={
                    this.state.isMouseOver ? () => {} : this.props.toggleFn
                }
            >
                {this.props.isToggled ? (
                    <div
                        onMouseEnter={this.onMouseEnterCantClick}
                        onMouseLeave={this.onMouseLeaveCanClick}
                    >
                        {this.props.children}
                    </div>
                ) : (
                    ''
                )}
            </div>
        );
    }

    private onMouseEnterCantClick: () => void = () => {
        this.setState({
            isMouseOver: true,
        });
    };

    private onMouseLeaveCanClick: () => void = () => {
        this.setState({
            isMouseOver: false,
        });
    };
}
