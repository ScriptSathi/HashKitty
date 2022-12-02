import { Constants } from '../Constants';
import { FileManager } from '../FileManager';
import { TStandardEndpoint } from '../types/TApi';
import { hashcatParams } from './hashcatParams';

interface IHashcat {
    generateCmd(): string;
}

export class Hashcat implements IHashcat {
    private standardEndpoint: TStandardEndpoint | undefined;
    private bin: string;
    private hashFileManager: FileManager;

    constructor(standard?: TStandardEndpoint) {
        this.bin = Constants.defaultBin;
        this.hashFileManager = new FileManager(Constants.hashlistsPath);
        this.standardEndpoint = standard;
    }

    public generateCmd(): string {
        let cmd = `${this.bin} `;
        this.prepareCmd();
        if (this.standardEndpoint) {
            this.standardEndpoint.flags.map(param => {
                cmd += `${hashcatParams[param.name]}=${param.arg} `;
            });
            cmd += `${this.hashFileManager.filePath} ${this.standardEndpoint.wordlist}`;
        }
        return cmd;
    }

    private prepareCmd(): void {
        this.standardEndpoint &&
            this.hashFileManager.createHashFile(
                this.standardEndpoint.hashList.name,
                this.standardEndpoint.hashList.hashs
            );
    }
}
