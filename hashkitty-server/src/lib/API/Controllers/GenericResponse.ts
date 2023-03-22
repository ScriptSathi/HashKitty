import { ResponseAttr } from '../../types/TRoutes';

export default class GenericController {
   public static responseNoCorrespondingItem(item: string): ResponseAttr {
      return {
         httpCode: 400,
         message: `No corresponding ${item} found`,
         success: false,
      };
   }
   public static unexpectedError(err?: string): ResponseAttr {
      return {
         httpCode: 500,
         message: 'An unexpected error occurred',
         success: false,
         error: err ? `[ERROR]: ${err}` : undefined,
      };
   }
}
