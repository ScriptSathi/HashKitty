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
         url: ApiEndpoints.GET.hashlists,
      });
   const { items: templates, refresh: refreshTemplates } =
      useFetchList<TTemplate>({
         method: 'GET',
         url: ApiEndpoints.GET.templates,
      });
   const { items: potfiles, refresh: refreshPotfiles } = useFetchList<string>({
      method: 'GET',
      url: ApiEndpoints.GET.potfiles,
   });
   const { items: rules, refresh: refreshRules } = useFetchList<string>({
      method: 'GET',
      url: ApiEndpoints.GET.rules,
   });
   const { items: attackModes, refresh: refreshAttacModes } =
      useFetchList<TAttackMode>({
         method: 'GET',
         url: ApiEndpoints.GET.attackmodes,
      });
   const { items: wordlists, refresh: refreshWordlists } = useFetchList<string>(
      {
         method: 'GET',
         url: ApiEndpoints.GET.wordlists,
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
      wordlists: buildItemBase(wordlists),
      attackModes,
      hashlists,
      templates,
      potfiles: buildItemBase(potfiles),
      rules: buildItemBase(rules),
      refresh,
      error,
      isLoading,
   };
}
