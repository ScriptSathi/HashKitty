import React, { Component } from 'react';

import Frame from '../../components/Frame/Frame';
import Button from '../../components/ui/Button/Button';
import './Lists.scss';
import { Utils } from '../../Utils';
import { THashlist } from '../../types/TypesORM';

type ListsState = {
    hashlists: THashlist[];
    wordlists: string[];
    potfiles: string[];
    rules: string[];
    maskFiles: string[];
};

type ListsProps = {};

export default class Lists extends Component<ListsProps, ListsState> {
    constructor(props: ListsProps) {
        super(props);
        this.state = {
            hashlists: [],
            wordlists: [],
            potfiles: [],
            rules: [],
            maskFiles: [],
        };
    }

    public async componentDidMount(): Promise<void> {
        await this.fetchData();
    }

    public render() {
        return (
            <Frame>
                <div className="gridList">
                    <div>
                        <this.HashlistsFrame />
                    </div>
                    <div>
                        <Button>Import</Button>
                    </div>
                </div>
            </Frame>
        );
    }

    private async fetchData(): Promise<void> {
        this.setState(await Utils.fetchAllFilesLists());
    }

    private HashlistsFrame = (): JSX.Element => {
        return (
            <div>
                <div className="flex spaceBtw fontMedium">
                    <p>Name</p>
                    <p>Hash type</p>
                    <p>Cracked passwords amount</p>
                </div>
                {this.state.hashlists.map(hashList => (
                    <div
                        className="itemList flex spaceBtw fontMedium"
                        key={hashList.id}
                    >
                        <p>{hashList.name}</p>
                        <p>{hashList.hashTypeId.name}</p>
                        <p>
                            {hashList.numberOfCrackedPasswords === null
                                ? 'Not cracked yet'
                                : hashList.numberOfCrackedPasswords}
                        </p>
                    </div>
                ))}
            </div>
        );
    };
}
