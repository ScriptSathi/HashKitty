import React, { Component, ReactElement } from 'react';

import Frame from '../../components/Frame/Frame';
import Button from '../../components/ui/Button/Button';
import './Lists.scss';
import { Utils } from '../../Utils';
import { THashlist } from '../../types/TypesORM';
import ImportList from '../../components/ImportList/ImportList';
import ImportHashList from '../../components/ImportHashList/ImportHashList';

type ListsState = {
    hashlists: THashlist[];
    wordlists: string[];
    potfiles: string[];
    rules: string[];
    maskFiles: string[];
    hashlistCreationToggle: boolean;
    importListSuccessMessage: ReactElement;
};

type ListsProps = {};

export default class Lists extends Component<ListsProps, ListsState> {
    constructor(props: ListsProps) {
        super(props);
        this.state = {
            hashlistCreationToggle: false,
            importListSuccessMessage: <></>,
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
            <Frame message={this.state.importListSuccessMessage}>
                <div className="List__main">
                    <div>
                        <this.HashlistsFrame />
                    </div>
                </div>
                <ImportHashList
                    isToggled={this.state.hashlistCreationToggle}
                    toggleFn={this.toggleHashlistCreation}
                    handleImportHasSucced={this.importListSuccess}
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
                <div className="List__hashlist flex spaceBtw">
                    <p className="title noMargin">Hashlists</p>
                    <Button onClick={this.toggleHashlistCreation}>
                        Import
                    </Button>
                </div>
                <div className="List__hashlist__items fontMedium">
                    <p className="Title2">Name</p>
                    <p className="Title2">Hash type</p>
                    <p className="Title2">Cracked passwords</p>
                </div>
                {this.state.hashlists.map(hashList => (
                    <div
                        className="List__hashlist__items List__item fontMedium"
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

    private importListSuccess = (message: string, isError = false) => {
        this.fetchData();
        this.setState({
            importListSuccessMessage: (
                <p
                    className={`fontMedium creationTaskStatusMessage ${
                        isError ? 'colorRed' : 'colorGreen'
                    }`}
                >
                    {message}
                </p>
            ),
        });
        setTimeout(() => {
            this.setState({
                importListSuccessMessage: <></>,
            });
        }, 5000);
    };
}
