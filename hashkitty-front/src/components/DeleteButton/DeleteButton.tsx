import React, { Component } from 'react';

import './DeleteButton.scss';
import trash from '../../assets/images/trash.svg';
import { Constants } from '../../Constants';

type DeleteButtonState = {};

type DeleteButtonProps = {
    apiEndpoint: string;
    idToDelete: number;
    handleRefreshAfterDelete: () => void;
};

export default class DeleteButton extends Component<
    DeleteButtonProps,
    DeleteButtonState
> {
    public render() {
        return (
            <img
                className="deleteButton"
                onClick={this.deleteOnClick}
                src={trash}
                alt="Logo"
            />
        );
    }
    private deleteOnClick = () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: this.props.idToDelete }),
            ...Constants.mandatoryFetchOptions,
        };
        console.log(this.props.apiEndpoint);
        fetch(this.props.apiEndpoint, requestOptions)
            .then(response => response.json())
            .then(res => {
                console.log(res);
                //Delay is needed here to let the server update itself
                setTimeout(() => this.props.handleRefreshAfterDelete(), 100);
                //TODO fail to delete
            });
    };
}
