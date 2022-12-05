import * as path from 'path';
import { THttpServerConfig } from './types/TApi';

export class Constants {
    public static readonly baseDir = path.join('/opt/kracceis');
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
    public static readonly defaultApiConfig: THttpServerConfig = { port: 1337 };
}
