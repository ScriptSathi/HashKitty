import Frame from '../../components/Frame/Frame';
import AccordionList from '../../components/ui/AccordionList/AccordionList';
import ReloadButton from '../../components/ui/Buttons/ReloadButton';
import InfoTooltip from '../../components/ui/Tooltips/InfoTooltip';
import useFetchAllList from '../../hooks/useFetchAllLists';
import useScreenSize from '../../hooks/useScreenSize';
import tooltips from '../../tooltips';

function Lists() {
   const { isMobile, isTablette } = useScreenSize();
   const { hashlists, potfiles, rules, wordlists, isLoading, refresh } =
      useFetchAllList();

   return (
      <Frame isLoading={isLoading}>
         <h2 className="flex justify-center text-3xl my-[25px]">Lists</h2>
         <div
            className={
               isMobile || isTablette
                  ? 'flex flex-col gap-2'
                  : 'grid justify-around grid-cols-2'
            }
         >
            <div className="w-full px-5">
               <AccordionList
                  expanded={isMobile || isTablette ? undefined : true}
                  list={hashlists}
                  name="Hashlists"
                  refreshLists={refresh}
               />
            </div>
            <div className="flex flex-col gap-2 px-5">
               <AccordionList
                  additionnalElem={
                     <div className="flex ml-[10px]">
                        <InfoTooltip
                           className="IconBtn__icon"
                           sx={{ marginTop: 0.5 }}
                           tooltip={tooltips.lists.wordlist}
                        />
                        <ReloadButton
                           sx={{ padding: 0.5 }}
                           isLoading={isLoading}
                           handleReload={refresh}
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
                  list={rules}
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
