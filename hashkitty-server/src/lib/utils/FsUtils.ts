import * as fs from 'fs-extra';
import { logger } from './Logger';
import { Constants } from '../Constants';
import path = require('path');
import { UploadedFile } from 'express-fileupload';
import { UploadFileType } from '../types/TApi';

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

    public static getFileTypeData(fileType: UploadFileType): {
        [fileType in
            | 'isWordlist'
            | 'isPotfile'
            | 'isRule'
            | 'isMask'
            | 'isHashlist']: boolean;
    } & { path: string } {
        const type = {
            isWordlist: fileType === 'wordlist',
            isPotfile: fileType === 'potfile',
            isRule: fileType === 'rule',
            isMask: fileType === 'mask',
            isHashlist: fileType === 'hashlist',
        };
        let path = '';
        if (type.isWordlist) path = Constants.wordlistPath;
        if (type.isPotfile) path = Constants.potfilesPath;
        if (type.isRule) path = Constants.rulesPath;
        if (type.isMask) path = Constants.masksPath;
        if (type.isHashlist) path = Constants.hashlistsPath;
        return { ...type, ...{ path } };
    }

    public static async uploadFile(
        file: UploadedFile,
        fileName: string,
        fileType: UploadFileType
    ): Promise<void> {
        let baseDir = '';
        switch (fileType) {
            case 'hashlist':
                baseDir = Constants.hashlistsPath;
                break;
            case 'wordlist':
                baseDir = Constants.wordlistPath;
                break;
            case 'rule':
                baseDir = Constants.rulesPath;
                break;
            case 'potfile':
                baseDir = Constants.potfilesPath;
                break;
            default:
                throw new Error('Wrong data submitted');
        }
        const uploadPath = path.join(baseDir, fileName);

        return new Promise((resolve, reject) => {
            file.mv(uploadPath, (err: Error) => {
                if (err) {
                    reject(err);
                    return;
                }
            });
            resolve();
        });
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
        //TODO
        const file = await fs.readFile(path, 'utf-8');
        console.log(file.toString());
        return 1;
    }
}
