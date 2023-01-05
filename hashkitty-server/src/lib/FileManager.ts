import * as fs from 'fs-extra';

import { logger } from './utils/Logger';

export class FileManager {
    public directoryWhereToSavedFile: string;
    public filePath = '';

    constructor(pathToSavedFile: string) {
        this.directoryWhereToSavedFile = pathToSavedFile;
    }

    public async createHashFile(
        filename: string,
        data: string[]
    ): Promise<void> {
        if (!fs.existsSync(this.directoryWhereToSavedFile)) {
            await fs.ensureDir(this.directoryWhereToSavedFile);
        }
        this.filePath = `${this.directoryWhereToSavedFile}/${filename}`;
        await fs.writeFile(this.filePath, data.join('\n'));
        logger.debug(`Writing hash file at location ${this.filePath}`);
    }

    public async countLineInFile(path: string): Promise<number> {
        const file = await fs.readFile(path, 'utf-8');
        console.log(file.toString());
        return 1;
    }
}
