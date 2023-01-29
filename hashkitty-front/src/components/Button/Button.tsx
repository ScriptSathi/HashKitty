import React, { CSSProperties, Component } from 'react';
import './Button.scss';

type ButtonProps = {
    children?: React.ReactNode;
    type?: 'button' | 'reset' | 'submit';
    className?: string | undefined;
    name?: string | undefined;
    style?: CSSProperties | undefined;
    onClick?: () => void;
};

type ButtonState = {};

export default class Button extends Component<ButtonProps, ButtonState> {
    public render() {
        return (
            <div {...this.attrRoot}>
                <button {...this.attrButton}>
                    {this.props.children || 'button'}
                </button>
            </div>
        );
    }

    private get attrButton(): Partial<
        React.ButtonHTMLAttributes<HTMLButtonElement>
    > {
        return {
            type: this.props.type ? this.props.type : 'button',
            className: 'button',
            name: this.props.name ? this.props.name : undefined,
        };
    }

    private get attrRoot(): React.HTMLAttributes<HTMLDivElement> {
        return {
            className: this.props.className ? this.props.className : '',
            style: this.props.style ? this.props.style : {},
            onClick: this.props.onClick ? this.props.onClick : () => {},
        };
    }
}
