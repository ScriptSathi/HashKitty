import { ResponseAttr } from '../../types/TRoutes';

export default class GenericController {
   public static responseNoCorrespondingTask(): ResponseAttr {
      return {
         httpCode: 400,
         message: 'No corresponding tasks found',
         success: false,
      };
   }
}
