import { useState } from 'react';
import ApiEndpoints from '../../ApiEndpoints';
import Frame from '../../components/Frame/Frame';
import AccordionList, {
   AccordionListProps,
} from '../../components/ui/AccordionList/AccordionList';
import ReloadButton from '../../components/ui/Buttons/ReloadButton';
import InfoTooltip from '../../components/ui/Tooltips/InfoTooltip';
import useFetchAllList from '../../hooks/useFetchAllLists';
import useScreenSize from '../../hooks/useScreenSize';
import tooltips from '../../tooltips';
import LightTooltip from '../../components/ui/Tooltips/LightTooltip';
import BackgroundBlur from '../../components/ui/BackgroundBlur/BackGroundBlur';
import ImportList from '../../components/ImportList/ImportList';
import { ListItemAvailable, UploadFileType } from '../../types/TApi';

function Lists() {
   const { isMobile, isTablette, isDesktop } = useScreenSize();
   const [{ isClicked: importIsClicked, name: importName }, setImport] =
      useState<{ isClicked: boolean; name: UploadFileType }>({
         isClicked: false,
         name: 'hashlist',
      });
   const { hashlists, potfiles, rules, wordlists, isLoading, refresh } =
      useFetchAllList();
   const [displayRules, setDisplayRules] = useState(false);

   const handleReload = () => {
      fetch(ApiEndpoints.GET.reloadWordlits).then(() => refresh());
   };

   const closeImportWindow = (doRefresh = false) => {
      setImport({ isClicked: false, name: 'hashlist' });
      if (doRefresh) setTimeout(() => refresh(), 1000);
   };

   const mandatoryAccordionProps = {
      refreshLists: refresh,
      closeImportWindow,
      import: [{ isClicked: importIsClicked, name: importName }, setImport],
   } satisfies Pick<
      AccordionListProps<ListItemAvailable>,
      'refreshLists' | 'closeImportWindow' | 'import'
   >;
   if (!isDesktop && importIsClicked) {
      return (
         <Frame isLoading={isLoading}>
            <ImportList
               closeImportWindow={closeImportWindow}
               type={importName}
            />
         </Frame>
      );
   }
   return (
      <>
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
                     {...mandatoryAccordionProps}
                  />
               </div>
               <div className="flex flex-col w-full gap-2 px-5">
                  <AccordionList
                     {...mandatoryAccordionProps}
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
                  />
                  <AccordionList
                     {...mandatoryAccordionProps}
                     additionnalTitleBarElem={
                        <LightTooltip
                           className={
                              displayRules
                                 ? 'IconBtn__themed'
                                 : 'IconBtn__black'
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
                  />
                  <AccordionList
                     {...mandatoryAccordionProps}
                     list={potfiles}
                     name="Potfiles"
                  />
               </div>
            </div>
         </Frame>
         {importIsClicked && (
            <BackgroundBlur toggleFn={closeImportWindow}>
               <ImportList
                  closeImportWindow={closeImportWindow}
                  type={importName}
               />
            </BackgroundBlur>
         )}
      </>
   );
}

export default Lists;
