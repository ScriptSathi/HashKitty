import { FieldError, DefaultFormErrors } from '../types/TypesErrorHandler';

export default abstract class ErrorHandler<
   FormError extends DefaultFormErrors,
> {
   public results: FormError = <FormError>{};
   public hasErrors: boolean;

   constructor() {
      this.hasErrors = false;
   }

   // eslint-disable-next-line @typescript-eslint/no-unused-vars, class-methods-use-this
   public analyse(form: object, dbData: object) {
      throw new Error('Childrens must overwrite this');
   }
   // eslint-disable-next-line class-methods-use-this
   protected get defaultField(): FieldError {
      return {
         isError: false,
         message: '',
         itemId: -1,
      };
   }

   protected get requieredFields(): FieldError {
      this.hasErrors = true;
      return {
         isError: true,
         itemId: -1,
         message: 'Required',
      };
   }

   protected get requieredFile(): FieldError {
      this.hasErrors = true;
      return {
         isError: true,
         itemId: -1,
         message: 'File needed',
      };
   }

   protected get wrongData(): FieldError {
      this.hasErrors = true;
      return {
         isError: true,
         itemId: -1,
         message: 'Incorrect data',
      };
   }
}
