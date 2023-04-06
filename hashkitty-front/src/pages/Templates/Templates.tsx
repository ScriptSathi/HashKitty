import { useState } from 'react';
import ApiEndpoints from '../../ApiEndpoints';
import Frame from '../../components/Frame/Frame';
import useFetchItems from '../../hooks/useFetchItems';
import { TTemplate } from '../../types/TypesORM';
import CreateCard from '../../components/ui/Cards/CreateCard/CreateCard';
import BackgroundBlur from '../../components/ui/BackgroundBlur/BackGroundBlur';
import CreateTemplate from '../../components/CreateTemplate/CreateTemplate';
import useScreenSize from '../../hooks/useScreenSize';

function Templates() {
   const {
      items: templates,
      refresh,
      isLoading,
   } = useFetchItems<TTemplate>({
      method: 'GET',
      url: ApiEndpoints.GET.templates,
   });
   const [isClickedCreation, setIsClickedCreation] = useState(false);
   const { isTablette, isMobile } = useScreenSize();
   const closeTaskCreation = () => {
      setIsClickedCreation(false);
      // Sleep to wait until the backend proccess the creation
      setTimeout(() => refresh(), 1000);
   };

   if ((isTablette || isMobile) && isClickedCreation) {
      return (
         <Frame isLoading={isLoading}>
            {isClickedCreation && (
               <CreateTemplate closeTaskCreation={closeTaskCreation} />
            )}
         </Frame>
      );
   }

   return (
      <Frame isLoading={isLoading}>
         <div className="px-[50px]">
            <h2 className="flex justify-center text-3xl my-[25px]">
               Templates
            </h2>
            <section
               className={`flex ${
                  isMobile || isTablette ? 'justify-center' : ''
               }`}
            >
               <CreateCard
                  name="template"
                  clickedCreation={[isClickedCreation, setIsClickedCreation]}
               />
            </section>
         </div>
         {isClickedCreation && (
            <BackgroundBlur toggleFn={closeTaskCreation}>
               <CreateTemplate closeTaskCreation={closeTaskCreation} />
            </BackgroundBlur>
         )}
      </Frame>
   );
}

export default Templates;
