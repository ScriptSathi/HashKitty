import { useEffect, useState } from 'react';
import useFetchList from './useFetchList';
import ApiEndpoints from '../ApiEndpoints';
import { TAttackMode, THashlist, TTemplate } from '../types/TypesORM';
import { ItemBase } from '../types/TComponents';

export default function useFetchAllList() {
   const [isLoading, setIsLoading] = useState(false);
   const [error, setErorr] = useState<unknown | null>(null);
   const { items: hashlists, refresh: refreshHashlists } =
      useFetchList<THashlist>({
         method: 'GET',
         url: ApiEndpoints.apiGetHashlists,
      });
   const { items: templates, refresh: refreshTemplates } =
      useFetchList<TTemplate>({
         method: 'GET',
         url: ApiEndpoints.apiGetTemplate,
      });
   const { items: potfiles, refresh: refreshPotfiles } = useFetchList<string>({
      method: 'GET',
      url: ApiEndpoints.apiGetPotfiles,
   });
   const { items: rules, refresh: refreshRules } = useFetchList<string>({
      method: 'GET',
      url: ApiEndpoints.apiGetRules,
   });
   const { items: attackModes, refresh: refreshAttacModes } =
      useFetchList<TAttackMode>({
         method: 'GET',
         url: ApiEndpoints.apiGetAttackModes,
      });
   const { items: wordlists, refresh: refreshWordlists } = useFetchList<string>(
      {
         method: 'GET',
         url: ApiEndpoints.apiGetWordlists,
      },
   );

   function buildItemBase(list: string[]): ItemBase[] {
      return list.map((elem, i) => {
         return {
            name: elem,
            id: i,
         };
      });
   }

   async function refresh() {
      setIsLoading(true);
      try {
         await refreshHashlists();
         await refreshTemplates();
         await refreshPotfiles();
         await refreshRules();
         await refreshAttacModes();
         await refreshWordlists();
      } catch (e) {
         setErorr(e);
      }
      setIsLoading(false);
   }
   useEffect(() => {
      refresh();
   }, []);
   return {
      attackModes,
      wordlists: buildItemBase(wordlists),
      hashlists,
      templates,
      potfiles: buildItemBase(potfiles),
      rules: buildItemBase(rules),
      refresh,
      error,
      isLoading,
   };
}
