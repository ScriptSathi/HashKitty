import { THashcatOption } from '../types/THashcat';

export class HashcatOptions {
    private options: THashcatOption[] = [];

    constructor(options: THashcatOption[]) {
        this.options = options;
    }
}
