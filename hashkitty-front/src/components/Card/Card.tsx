import React, { Component } from 'react';
import './Card.scss';

type CardState = {};

type CardProps = {
    children: React.ReactNode;
    smallCard?: boolean;
};

export default class RunnableTaskCard extends Component<CardProps, CardState> {
    public render() {
        return (
            <div
                className={`cardBodyGeneric ${
                    this.props.smallCard ? 'smallCard' : 'bigCard'
                }`}
            >
                {this.props.children}
            </div>
        );
    }
}
