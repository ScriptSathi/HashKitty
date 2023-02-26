import React, { Component } from 'react';

import Frame from '../../components/Frame/Frame';
import Button from '../../components/ui/Button/Button';
import './Lists.scss';
import { Utils } from '../../Utils';
import { THashlist } from '../../types/TypesORM';
import ImportList from '../../components/ImportList/ImportList';

type ListsState = {
    hashlists: THashlist[];
    wordlists: string[];
    potfiles: string[];
    rules: string[];
    maskFiles: string[];
    hashlistCreationToggle: boolean;
};

type ListsProps = {};

export default class Lists extends Component<ListsProps, ListsState> {
    constructor(props: ListsProps) {
        super(props);
        this.state = {
            hashlistCreationToggle: false,
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
                <div className="List__main">
                    <div>
                        <this.HashlistsFrame />
                    </div>
                    <div>
                        <Button onClick={this.toggleHashlistCreation}>
                            Import
                        </Button>
                    </div>
                </div>
                <ImportList
                    isToggled={this.state.hashlistCreationToggle}
                    toggleFn={this.toggleHashlistCreation}
                    handleImportHasSucced={this.importHashlistSuccess}
                />
            </Frame>
        );
    }

    private async fetchData(): Promise<void> {
        this.setState(await Utils.fetchAllFilesLists());
    }

    private HashlistsFrame = (): JSX.Element => {
        return (
            <>
                <div className="List__hashlistFrame fontMedium">
                    <p>Name</p>
                    <p>Hash type</p>
                    <p>Cracked passwords amount</p>
                </div>
                {this.state.hashlists.map(hashList => (
                    <div
                        className="List__hashlistFrame List__item fontMedium"
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
            </>
        );
    };

    private toggleHashlistCreation = () => {
        this.setState({
            hashlistCreationToggle: !this.state.hashlistCreationToggle,
        });
    };
}
