import { IHashcat } from '../types/THashcat';
import { HashcatOptions } from './HashcatOptions';

export class Hashcat implements IHashcat {
    private options: HashcatOptions;

    constructor(options: HashcatOptions) {
        this.options = options;
    }

    public generateCmd(): string {
        return '';
    }

    public generateBenchmarkCmd(): string {
        return '';
    }
}
