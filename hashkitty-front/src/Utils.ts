import { ChangeEvent } from 'react';
import { Constants } from './Constants';
import { THashlist, TemplateTask } from './types/TypesORM';

type fetchAllLists = {
   hashlists: THashlist[];
   rules: string[];
   potfiles: string[];
   wordlists: string[];
};

export class Utils {
   public static santizeInput(
      event:
         | ChangeEvent<HTMLInputElement>
         | (React.MouseEvent<HTMLInputElement, MouseEvent> &
              ChangeEvent<HTMLInputElement>),
   ): string | number | boolean {
      return event.target.type === 'checkbox'
         ? event.target.checked
         : event.target.value.replace(' ', '-').replace(/[^\w._-]/gi, '');
   }

   public static async fetchListWithEndpoint<List>(
      endpoint: string,
   ): Promise<List[]> {
      const req = await (
         await fetch(endpoint, Constants.mandatoryFetchOptions)
      ).json();
      return req && req.success && req.success.length > 0 ? req.success : [];
   }

   public static async fetchAllFilesLists(): Promise<fetchAllLists> {
      const hashlists = await Utils.fetchListWithEndpoint<THashlist>(
         Constants.apiGetHashlists,
      );
      const rules = await Utils.fetchListWithEndpoint<string>(
         Constants.apiGetRules,
      );
      const potfiles = await Utils.fetchListWithEndpoint<string>(
         Constants.apiGetPotfiles,
      );
      const wordlists = await Utils.fetchListWithEndpoint<string>(
         Constants.apiGetWordlists,
      );
      return { hashlists, rules, potfiles, wordlists };
   }
}
