import { useEffect, useState } from 'react';
import useFetchItems from './useFetchItems';
import useFetchList from './useFetchList';
import ApiEndpoints from '../ApiEndpoints';
import { TAttackMode, THashlist, TTemplate } from '../types/TypesORM';
import { ListBase } from '../types/TApi';

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
   const { items: potfiles, refresh: refreshPotfiles } = useFetchList<ListBase>(
      {
         method: 'GET',
         url: ApiEndpoints.GET.potfiles,
      },
   );
   const { items: rules, refresh: refreshRules } = useFetchList<ListBase>({
      method: 'GET',
      url: ApiEndpoints.GET.rules,
   });
   const { items: attackModes, refresh: refreshAttacModes } =
      useFetchItems<TAttackMode>({
         method: 'GET',
         url: ApiEndpoints.GET.attackmodes,
      });
   const { items: wordlists, refresh: refreshWordlists } =
      useFetchList<ListBase>({
         method: 'GET',
         url: ApiEndpoints.GET.wordlists,
      });

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
      wordlists,
      attackModes,
      hashlists,
      templates,
      potfiles,
      rules,
      refresh,
      error,
      isLoading,
   };
}
