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
        console.log(this.state);
    }

    public render() {
        return <></>;
    }

    private async fetchData(): Promise<void> {
        this.setState(await Utils.fetchAllFilesLists());
    }
}
