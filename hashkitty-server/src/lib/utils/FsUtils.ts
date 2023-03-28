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

   public async countLineInFile(path: string): Promise<number> {
      //TODO
      const file = await fs.readFile(path, 'utf-8');
      console.log(file.toString());
      return 1;
   }

   public async uploadFile(
      file: UploadedFile,
      fileName: string,
      fileType: UploadFileType
   ): Promise<void> {
      const baseDir = this.getFilePathFromType(fileType);
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

   public deleteFile(fileName: string, fileType: UploadFileType): void {
      const baseDir = this.getFilePathFromType(fileType);
      const deletePath = path.join(baseDir, fileName);
      fs.rm(deletePath)
         .then(() =>
            logger.debug(
               `File ${fileName} from path ${baseDir} deleted successfully`
            )
         )
         .catch(err =>
            logger.error(
               `An error occured when deleting ${fileName} from path ${baseDir} - ERROR ${err}`
            )
         );
   }

   public async fileExist(
      fileName: string,
      fileType: UploadFileType
   ): Promise<boolean> {
      const baseDir = this.getFilePathFromType(fileType);
      const existsPath = path.join(baseDir, fileName);
      try {
         await fs.access(existsPath);
         return true;
      } catch {
         return false;
      }
   }

   private getFilePathFromType(fileType: UploadFileType): string {
      switch (fileType) {
         case 'hashlist':
            return Constants.hashlistsPath;
         case 'wordlist':
            return Constants.wordlistPath;
         case 'rule':
            return Constants.rulesPath;
         case 'potfile':
            return Constants.potfilesPath;
         default:
            throw new Error('Wrong data submitted');
      }
   }
}
