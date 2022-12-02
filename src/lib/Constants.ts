import * as path from 'path';

export class Constants {
    public static readonly wordlistPath = path.join('/tmp/kracceis/wordlists');
    public static readonly hashlistsPath = path.join('/tmp/kracceis/hashlists');
    public static readonly potfilesPath = path.join('/tmp/kracceis/potfiles');
    public static readonly rulesPath = path.join('/tmp/kracceis/rules');
    public static readonly defaultBin = 'hashcat';
    public static readonly debugMode = true;
}
