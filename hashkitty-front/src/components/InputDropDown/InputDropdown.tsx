/* eslint-disable prettier/prettier */
import React, { CSSProperties, ChangeEvent, Component } from 'react';

import { frame, inputText, listFrame, inputDatalists, inputs } from './StyleInputDropdown';
import { itemBase } from '../../types/TComponents';
import { THashType } from '../../types/TypesORM';
import './InputDropdown.scss';

interface InputDropdownProps {
    list: itemBase[];
    formName: string;
    placeholder?: string;
    hashTypeFormat?: boolean;
    handleInputChange: (event: ChangeEvent<HTMLInputElement> | React.MouseEvent<
        HTMLInputElement,
        MouseEvent
    > &
        ChangeEvent<HTMLInputElement>) => void;
}

interface InputDropdownState {
    openDropdown: boolean;
    inputData: string;
    sortedDropdownList: itemBase[];
}

export default class InputDropdown extends Component<
    InputDropdownProps,
    InputDropdownState
> {
    private formName: string;
    private retryCount: number;

    constructor(props: InputDropdownProps) {
        super(props);
        this.formName = props.formName;
        this.retryCount = 0;
        this.state = {
            openDropdown: false,
            inputData: '',
            sortedDropdownList: [],
        };
    }

    public componentDidMount(): void {
        this.setState({
            sortedDropdownList: this.sortDropdownList(''),
        });
        if (this.props.list.length === 0 && this.retryCount < 3) {
            this.retryCount++;
            setTimeout(() => {
                this.componentDidMount();
            }, 1000);
        }
    }

    public render() {
        return (
            <div style={frame}>
                <input
                    type="text"
                    onClick={event =>
                        this.toggleDropdown(
                            event as React.MouseEvent<
                                HTMLInputElement,
                                MouseEvent
                            > &
                                ChangeEvent<HTMLInputElement>
                        )
                    }
                    onChange={event => this.handleInputChange(event)}
                    placeholder={this.props.placeholder || 'Name of the list'}
                    style={{ ...inputs, ...inputDatalists }}
                    value={this.state.inputData}
                    name={this.formName}
                    autoComplete="off"
                ></input>
                <div></div>
                <this.renderMatchingList />
            </div>
        );
    }

    private handleInputChange = (
        event:
            | ChangeEvent<HTMLInputElement>
            | (React.MouseEvent<HTMLInputElement, MouseEvent> &
                  ChangeEvent<HTMLInputElement>)
    ) => {
        const inputData = event.target.value.replace(' ', '-').replace(/[^\w._-]/gi, '');
        event.preventDefault();
        event.stopPropagation();
        this.setState({
            openDropdown: true,
        });
        this.props.handleInputChange(event);
        const sort = this.sortDropdownList(inputData);
        this.setState({
            inputData,
            sortedDropdownList: sort,
        });
    };

    private sortDropdownList(input: string): itemBase[] {
        return this.props.hashTypeFormat ? (this.props.list as THashType[]).filter(item => {
            return input.length > 0 ? `${item.typeNumber}-${item.name}`.includes(input) : item;
        }) : this.props.list.filter(item => {
            return input.length > 0 ? item.name.includes(input) : item;
        });
    }

    private toggleDropdown = (event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        this.setState({
            openDropdown: !this.state.openDropdown,
        });
    };

    private renderMatchingList = () => {
        const visibility: CSSProperties = this.state.openDropdown
            ? {}
            : {
                  visibility: 'hidden',
              };
        return this.state.sortedDropdownList.length > 0 ? (
            <div style={{ ...listFrame, ...visibility }}>
                {this.props.hashTypeFormat ? <this.listHashtypeFormat /> : <this.listStandard />}
            </div>
        ) : (
            <div style={{ ...listFrame, ...visibility }}>
                <input
                    readOnly
                    style={inputText}
                    value="No element found"
                ></input>
            </div>
        );
    };

    private listStandard = () => {
        return (
            <>
                {this.state.sortedDropdownList.map(elem => {
                    return (
                        <input
                            className="dropdownInputs"
                            onClick={event => {
                                this.handleInputChange(
                                    event as React.MouseEvent<
                                        HTMLInputElement,
                                        MouseEvent
                                    > &
                                        ChangeEvent<HTMLInputElement>
                                );
                                this.toggleDropdown(
                                    event as React.MouseEvent<
                                        HTMLInputElement,
                                        MouseEvent
                                    > &
                                        ChangeEvent<HTMLInputElement>
                                );
                            }}
                            key={elem.id}
                            value={elem.name}
                            name={this.formName}
                            style={inputText}
                            readOnly
                        ></input>
                    );
                })}
            </>
        )
    };

    private listHashtypeFormat = () => {
        return (
            <>
                {(this.state.sortedDropdownList as THashType[]).map(elem => {
                    return (
                        <input
                            className="dropdownInputs"
                            onClick={event => {
                                this.handleInputChange(
                                    event as React.MouseEvent<
                                        HTMLInputElement,
                                        MouseEvent
                                    > &
                                        ChangeEvent<HTMLInputElement>
                                );
                                this.toggleDropdown(
                                    event as React.MouseEvent<
                                        HTMLInputElement,
                                        MouseEvent
                                    > &
                                        ChangeEvent<HTMLInputElement>
                                );
                            }}
                            key={elem.id}
                            value={`${elem.typeNumber}-${elem.name}`}
                            name={this.formName}
                            style={inputText}
                            readOnly
                        ></input>
                    );
                })}
            </>
        )
    };
}
