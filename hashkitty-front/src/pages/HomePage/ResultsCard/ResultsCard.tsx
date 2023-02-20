import React, { Component } from 'react';

import { cardBody, contentBody, passwdsTxt } from './StyleResultsCard';
import { Constants } from '../../../Constants';
import { RequestUtils } from '../../../RequestUtils';

type ResultsCardState = {
    crackedPasswd: string[];
    onlyPasswds: boolean;
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
        crackedPasswd: [] as string[],
        onlyPasswds: true,
    };

    public async componentDidMount(): Promise<void> {
        this.submitForm();
    }

    public render() {
        return (
            <div>
                <div style={cardBody}>
                    <label className="flex noSelect margin15 fontMedium">
                        <input
                            className="inputCheckbox marginRight5 marginTop2"
                            type="checkbox"
                            checked={this.state.onlyPasswds}
                            onChange={this.handleCheckbox}
                        />
                        Show only passwords
                    </label>
                    <div style={contentBody}>
                        <this.Passwords />
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

    private handleCheckbox = () => {
        this.setState({
            onlyPasswds: !this.state.onlyPasswds,
        });
        console.log(this.state.onlyPasswds);
    };

    private Passwords = (): JSX.Element => {
        let list = this.state.crackedPasswd;
        if (this.state.onlyPasswds) {
            list = list.map(_passwd => {
                const passwd = _passwd.split(':');
                return passwd[passwd.length - 1];
            });
        }
        return (
            <>
                {list.map((passwd, i) => (
                    <p style={passwdsTxt} key={i}>
                        {passwd}
                    </p>
                ))}
            </>
        );
    };
}
