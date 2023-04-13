import { useState } from 'react';
import ApiEndpoints from '../../ApiEndpoints';
import Frame from '../../components/Frame/Frame';
import AccordionList from '../../components/ui/AccordionList/AccordionList';
import ReloadButton from '../../components/ui/Buttons/ReloadButton';
import InfoTooltip from '../../components/ui/Tooltips/InfoTooltip';
import useFetchAllList from '../../hooks/useFetchAllLists';
import useScreenSize from '../../hooks/useScreenSize';
import tooltips from '../../tooltips';
import LightTooltip from '../../components/ui/Tooltips/LightTooltip';

function Lists() {
   const { isMobile, isTablette } = useScreenSize();
   const { hashlists, potfiles, rules, wordlists, isLoading, refresh } =
      useFetchAllList();
   const [displayRules, setDisplayRules] = useState(false);

   const handleReload = () => {
      fetch(ApiEndpoints.GET.reloadWordlits).then(() => refresh());
   };

   return (
      <Frame isLoading={isLoading}>
         <h2 className="flex justify-center text-3xl my-[25px]">Lists</h2>
         <div
            className={
               isMobile || isTablette
                  ? 'flex flex-col gap-2'
                  : 'flex justify-center gap-x-[100px]'
            }
         >
            <div className="px-5 justify-self-end w-full">
               <AccordionList
                  expanded={isMobile || isTablette ? undefined : true}
                  list={hashlists}
                  name="Hashlists"
                  refreshLists={refresh}
               />
            </div>
            <div className="flex flex-col w-full gap-2 px-5">
               <AccordionList
                  additionnalTitleBarElem={
                     <div className="flex">
                        <InfoTooltip
                           className="cursor-default"
                           sx={{ marginTop: 0.5 }}
                           tooltip={tooltips.lists.wordlist}
                           onClick={e => {
                              e.stopPropagation();
                           }}
                        />
                        <ReloadButton
                           tooltip="Reload the registered wordlists"
                           sx={{ padding: 0.5 }}
                           isLoading={isLoading}
                           handleReload={handleReload}
                        />
                     </div>
                  }
                  list={wordlists.filter(
                     ({ item: { name } }) => name !== '* (All Wordlists)',
                  )}
                  name="Wordlists"
                  refreshLists={refresh}
               />
               <AccordionList
                  additionnalTitleBarElem={
                     <LightTooltip
                        className={
                           displayRules ? 'IconBtn__themed' : 'IconBtn__black'
                        }
                        sx={{ marginTop: 0.5 }}
                        tooltip="Show suggested rules"
                        onClick={e => {
                           e.stopPropagation();
                           setDisplayRules(!displayRules);
                        }}
                     />
                  }
                  list={rules}
                  displayAdditionnalStack={displayRules}
                  additionnalStack={tooltips.lists.rules}
                  name="Rules"
                  refreshLists={refresh}
               />
               <AccordionList
                  list={potfiles}
                  name="Potfiles"
                  refreshLists={refresh}
               />
            </div>
         </div>
      </Frame>
   );
}

export default Lists;
