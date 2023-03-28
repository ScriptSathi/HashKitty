import ApiEndpoints from "../../ApiEndpoints";
import Frame from "../../components/Frame/Frame";
import AccordionList from "../../components/ui/AccordionList/AccordionList";
import useFetchAllList from "../../hooks/useFetchAllLists";

function Lists() {
   const {
      hashlists,
      potfiles,
      rules,
      wordlists,
      isLoading,
      refresh,
   } = useFetchAllList();

   return (
      <Frame>
         <h2 className="flex justify-center text-3xl my-[25px]">
            Lists
         </h2>
         <div
            className="grid justify-around grid-cols-2"
         >
            <div>
               <div className="flex flex-wrap justify-center">
                  
               </div>
            </div>
            <div className="flex flex-col gap-2">
               <AccordionList
                  list={wordlists.filter(({ name }) => name !== '* (All Wordlists)')}
                  name='Wordlists'
                  refreshLists={refresh}
               />
               <AccordionList
                  list={rules}
                  name='Rules'
                  refreshLists={refresh}
               />
               <AccordionList
                  list={potfiles}
                  name='Potfiles'
                  refreshLists={refresh}
               />
            </div>
         </div>
      </Frame>
   );
}

export default Lists;