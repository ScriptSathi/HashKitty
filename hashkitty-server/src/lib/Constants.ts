import * as path from 'path';
import { THttpServerConfig } from './types/TApi';

export class Constants {
    public static readonly baseDir =
        process.env?.WORDLISTS_DIR_PATH ||
        path.join(__dirname, '../../../hashkitty');
    public static readonly dbPort = parseInt(process.env?.DB_PORT || '3306');
    public static readonly dbDatabase = process.env?.DB_DATABASE || 'hashkitty';
    public static readonly dbUsername = process.env?.DB_USERNAME || 'hashkitty';
    public static readonly dbPassword = process.env?.DB_PASSWORD || 'hashkitty';
    public static readonly defaultApiConfig = {
        port: process.env?.PORT || '1337',
    } satisfies THttpServerConfig;
    public static readonly dbEnpoint = process.env?.DB_ENDPOINT || 'localhost';
    public static readonly isProduction =
        process.env?.PRODUCTION === 'true' || false;
    public static readonly wordlistPath = path.join(
        Constants.baseDir,
        'wordlists'
    );
    public static readonly hashlistsPath = path.join(
        Constants.baseDir,
        'hashlists'
    );
    public static readonly potfilesPath = path.join(
        Constants.baseDir,
        'potfiles'
    );
    public static readonly outputFilePath = path.join(
        Constants.baseDir,
        'outputs'
    );
    public static readonly rulesPath = path.join(Constants.baseDir, 'rules');
    public static readonly masksPath = path.join(Constants.baseDir, 'masks');
    public static readonly restorePath = path.join(
        Constants.baseDir,
        'restore'
    );
    public static readonly defaultBin = 'hashcat';
    public static readonly debugMode = true;
}
