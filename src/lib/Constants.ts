import * as path from 'path';
import { THttpServerConfig } from './types/TApi';

export class Constants {
    public static readonly wordlistPath = path.join('/opt/kracceis/wordlists');
    public static readonly hashlistsPath = path.join('/opt/kracceis/hashlists');
    public static readonly potfilesPath = path.join('/opt/kracceis/potfiles');
    public static readonly rulesPath = path.join('/opt/kracceis/rules');
    public static readonly defaultBin = 'hashcat';
    public static readonly debugMode = true;
    public static readonly defaultApiConfig: THttpServerConfig = { port: 1337 };
}
