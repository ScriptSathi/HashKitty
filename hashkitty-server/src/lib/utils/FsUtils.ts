import * as fs from 'fs-extra';
import { logger } from './Logger';

export class FsUtils {
    public static listFileInDir(path: string): string[] {
        try {
            return fs.readdirSync(path);
        } catch (e) {
            if ((e as Error).message.match(/no such file or directory/g)) {
                fs.mkdirSync(path);
                FsUtils.listFileInDir(path);
            } else {
                throw e;
            }
        }
        return [];
    }

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