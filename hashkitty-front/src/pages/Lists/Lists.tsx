import React, { Component, ReactElement } from 'react';

import Frame from '../../components/Frame/Frame';
import Button from '../../components/ui/Button/Button';
import './Lists.scss';
import { Utils } from '../../Utils';
import { THashlist } from '../../types/TypesORM';
import ImportHashList from '../../components/ImportHashList/ImportHashList';
import ListItem from './ListItem/ListItem';
import ImportList from '../../components/ImportList/ImportList';

type ListsState = {
    hashlists: THashlist[];
    wordlists: string[];
    potfiles: string[];
    rules: string[];
    maskFiles: string[];
    hashlistCreationToggle: boolean;
    importListSuccessMessage: ReactElement;
    wordlistCreationToggle: boolean;
    potfileCreationToggle: boolean;
    ruleCreationToggle: boolean;
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
            wordlistCreationToggle: false,
            potfileCreationToggle: false,
            ruleCreationToggle: false,
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
                    <div>
                        <this.ListFrame
                            list={this.state.wordlists}
                            listType="Wordlists"
                            importFn={this.toggleWordlistCreation}
                        />
                        <this.ListFrame
                            list={this.state.rules}
                            listType="Potfiles"
                            importFn={this.togglPotfileCreation}
                        />
                        <this.ListFrame
                            list={this.state.rules}
                            listType="Rules"
                            importFn={this.toggleRuleCreation}
                        />
                    </div>
                </div>
                <ImportHashList
                    isToggled={this.state.hashlistCreationToggle}
                    toggleFn={this.toggleHashlistCreation}
                    handleImportHasSucced={this.importListSuccess}
                />
                <ImportList
                    isToggled={this.state.wordlistCreationToggle}
                    toggleFn={this.toggleWordlistCreation}
                    handleImportHasSucced={this.importListSuccess}
                    type={'wordlists'}
                />
                <ImportList
                    isToggled={this.state.ruleCreationToggle}
                    toggleFn={this.toggleRuleCreation}
                    handleImportHasSucced={this.importListSuccess}
                    type={'rules'}
                />
                <ImportList
                    isToggled={this.state.potfileCreationToggle}
                    toggleFn={this.togglPotfileCreation}
                    handleImportHasSucced={this.importListSuccess}
                    type={'potfiles'}
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
                <div className="List__lists flex spaceBtw">
                    <p className="title noMargin">Hashlists</p>
                    <Button onClick={this.toggleHashlistCreation}>
                        Import
                    </Button>
                </div>
                <div className="List__lists__items List__margin fontMedium">
                    <p className="Title2">Name</p>
                    <p className="Title2">Hash type</p>
                    <p className="Title2">Cracked passwords</p>
                </div>
                {this.state.hashlists.map(hashList => (
                    <div
                        className="List__lists__items List__item List__margin fontMedium"
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

    private ListFrame = ({
        list,
        listType,
        importFn,
    }: {
        list: string[];
        listType: string;
        importFn: () => void;
    }) => {
        return (
            <>
                <div className="List__lists flex spaceBtw">
                    <p className="title noMargin">{listType}</p>
                    <Button onClick={importFn}>Import</Button>
                </div>
                <div className="fontMedium List__ListFrame">
                    <p className="Title2">Name</p>
                </div>
                {list.length > 0 ? (
                    list.map(name => <ListItem name={name} />)
                ) : (
                    <p className="fontMedium Main__alignCenter">
                        No {listType.toLowerCase()} found
                    </p>
                )}
            </>
        );
    };

    private toggleHashlistCreation = () => {
        this.setState({
            hashlistCreationToggle: !this.state.hashlistCreationToggle,
        });
    };

    private toggleWordlistCreation = () => {
        this.setState({
            wordlistCreationToggle: !this.state.wordlistCreationToggle,
        });
    };

    private toggleRuleCreation = () => {
        this.setState({
            ruleCreationToggle: !this.state.ruleCreationToggle,
        });
    };

    private togglPotfileCreation = () => {
        this.setState({
            potfileCreationToggle: !this.state.potfileCreationToggle,
        });
    };

    private importListSuccess = () => {
        this.setState({
            importListSuccessMessage: <p>Successfull import</p>,
        });
        this.fetchData();
        this.toggleHashlistCreation();
    };
}
