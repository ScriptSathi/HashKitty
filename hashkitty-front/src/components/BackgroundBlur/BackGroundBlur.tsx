import React, { Component } from 'react';

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
        return (
            <div
                style={
                    this.props.isToggled
                        ? {
                              position: 'absolute',
                              backdropFilter: 'blur(5px) brightness(0.60)',
                              height: '100%',
                              width: '100%',
                              top: 0,
                              left: 0,
                              userSelect: 'text',
                          }
                        : {}
                }
                onClick={
                    this.state.isMouseOver ? () => {} : this.props.toggleFn
                }
            >
                {this.props.isToggled ? (
                    <div
                        style={
                            this.props.centerContent
                                ? {
                                      position: 'absolute',
                                      top: '50%',
                                      left: '50%',
                                      marginRight: '-50%',
                                      transform: 'translate(-50%, -50%)',
                                  }
                                : {}
                        }
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
