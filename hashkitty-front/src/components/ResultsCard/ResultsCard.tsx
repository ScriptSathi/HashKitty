import React, { Component } from 'react';

import {
    cardBody,
    contentBody,
    hashListName,
    passwdsTxt,
} from './StyleResultsCard';
import { Constants } from '../../Constants';
import { RequestUtils } from '../../RequestUtils';

type ResultsCardState = {
    crackedPasswd: string[];
};

interface ResultsCardProps {
    hashlistName: string;
    hashlistId: number;
}

export default class ResultsCard extends Component<
    ResultsCardProps,
    ResultsCardState
> {
    public state = {
        crackedPasswd: [],
    };

    public async componentDidMount(): Promise<void> {
        this.submitForm();
    }

    public render() {
        return (
            <div>
                <div style={cardBody}>
                    {/* <h3 style={hashListName}>{this.props.hashlistName}</h3> */}
                    <div style={contentBody}>
                        {this.state.crackedPasswd.map(passwd => (
                            <p style={passwdsTxt}>{passwd}</p>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    private submitForm(): void {
        const data = {
            filename: `${this.props.hashlistName}-${this.props.hashlistId}`,
        };
        RequestUtils.POST<{ passwds: string[] }>(
            Constants.apiPOSTTaskResults,
            data,
            res => {
                console.log(res);
                this.setState({
                    crackedPasswd: res.passwds,
                });
            }
        );
    }
}
