import { UseFormSetError } from 'react-hook-form';
import ErrorHandler from './ErrorHandler';
import { ImportListErrors } from '../types/TypesErrorHandler';
import { TDBData } from '../types/TypesORM';
import { ApiImportList } from '../types/TApi';

export default class ImportListErrorHandler extends ErrorHandler<ImportListErrors> {
   public formData: FormData;
   private setError: UseFormSetError<ApiImportList>;
   private dbData: Pick<TDBData, 'hashtypes'>;
   constructor(
      setError: UseFormSetError<ApiImportList>,
      dbData: Pick<TDBData, 'hashtypes'>,
   ) {
      super();
      this.setError = setError;
      this.dbData = dbData;
      this.formData = new FormData();
   }

   public analyse({ file, fileName, hashTypeId }: ApiImportList): void {
      this.isValid = true;
      this.checkFile(file);
      this.checkFileName(fileName);
      if (hashTypeId) {
         this.checkHashTypeId(hashTypeId);
      }
   }

   public checkFileName(fileName: string) {
      if (fileName.length === 0) {
         this.setError('fileName', { message: this.requieredFields.message });
      } else {
         this.formData.append('fileName', fileName);
      }
   }

   public checkHashTypeId(id: number) {
      if (id < 0) {
         this.setError('hashTypeId', { message: this.requieredFields.message });
      } else {
         this.formData.append('hashTypeId', id.toString());
      }
   }

   public checkFile(file: File) {
      const isValidTextFile = file.type === 'text/plain' || file.type === '';
      if (isValidTextFile) {
         this.formData.append('file', file);
      } else {
         this.setError('file', { message: 'Must be a valid plain text file' });
      }
   }
}
