import React, { Component } from 'react';
import BackgroundBlur from '../BackgroundBlur/BackGroundBlur';
import './ImportHashlist.scss';

type ImportHashlistProps = {
    isToggled: boolean;
    toggleFn: () => void;
};

type ImportHashlistState = {};

export default class ImportHashlist extends Component<
    ImportHashlistProps,
    ImportHashlistState
> {
    public render() {
        return (
            <BackgroundBlur
                isToggled={this.props.isToggled}
                toggleFn={this.props.toggleFn}
                centerContent
            >
                <div className="cardBody">
                    <p>Hello</p>
                    <p>Hello</p>
                    <p>Hello</p>
                    <p>Hello</p>
                </div>
            </BackgroundBlur>
        );
    }
}
