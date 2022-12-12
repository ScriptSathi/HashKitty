import * as path from 'path';
import { THttpServerConfig } from './types/TApi';

export class Constants {
    public static readonly baseDir =
        process.env?.HASHKITTY_WORDLIST_DIR || path.join('/opt/hashkitty');
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
    public static readonly rulesPath = path.join(Constants.baseDir, 'rules');
    public static readonly defaultBin = 'hashcat';
    public static readonly debugMode = true;
    public static readonly defaultApiConfig: THttpServerConfig = {
        port: process.env?.PORT || 1337,
    };
    public static readonly isProduction =
        (process.env?.PRODUCTION as unknown as boolean) || false;
}
