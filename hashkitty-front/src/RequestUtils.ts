import { Constants } from './Constants';

export type StandardResponse = {
   message: string;
   success?: unknown;
   error?: string;
};

export class RequestUtils {
   public static POST<
      ResponseType extends {
         [key: string]: unknown | string | number | boolean | string[];
      },
   >(
      url: string,
      data: Object,
      callback: (response: ResponseType) => void,
   ): void {
      const requestOptions = {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(data),
         ...Constants.mandatoryFetchOptions,
      };
      fetch(url, requestOptions)
         .then(response => {
            return response.json();
         })
         .then(res => {
            callback(res);
         });
   }
}
