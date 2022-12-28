import * as fs from 'fs-extra';

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
}
