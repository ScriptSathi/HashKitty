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
                style={
                    this.props.isToggled
                        ? {
                              position: 'fixed',
                              backdropFilter: 'blur(5px) brightness(0.60)',
                              height: '100%',
                              width: '100%',
                              top: 0,
                              left: 0,
                              userSelect: 'text',
                              display: 'flex',
                              justifyContent: 'center',
                              paddingTop: '5%',
                          }
                        : {}
                }
                onClick={
                    this.state.isMouseOver ? () => {} : this.props.toggleFn
                }
            >
                {this.props.isToggled ? (
                    <div
                        style={{ height: 0 }}
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
