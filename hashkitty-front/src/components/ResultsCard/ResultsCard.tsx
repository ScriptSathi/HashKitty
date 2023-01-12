import React, { Component } from 'react';

import { cardBody, contentBody, passwdsTxt } from './StyleResultsCard';
import { Constants } from '../../Constants';
import { RequestUtils } from '../../RequestUtils';

type ResultsCardState = {
    crackedPasswd: string[];
};

interface ResultsCardProps {
    fileName: string;
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
            <div
                style={{
                    height: 800,
                }}
            >
                <div style={cardBody}>
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
            filename: this.props.fileName,
        };
        RequestUtils.POST<{ passwds: string[] }>(
            Constants.apiPOSTTaskResults,
            data,
            res => {
                this.setState({
                    crackedPasswd: res.passwds,
                });
            }
        );
    }
}
