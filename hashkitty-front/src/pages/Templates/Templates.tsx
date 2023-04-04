import { useState } from 'react';
import ApiEndpoints from '../../ApiEndpoints';
import Frame from '../../components/Frame/Frame';
import useFetchItems from '../../hooks/useFetchItems';
import { TTemplate } from '../../types/TypesORM';
import CreateCard from '../../components/ui/Cards/CreateCard/CreateCard';
import BackgroundBlur from '../../components/ui/BackgroundBlur/BackGroundBlur';
import CreateTemplate from '../../components/CreateTemplate/CreateTemplate';

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
   const closeTaskCreation = () => {
      setIsClickedCreation(false);
      // Sleep to wait until the backend proccess the creation
      setTimeout(() => refresh(), 1000);
   };
   return (
      <Frame isLoading={isLoading}>
         <h2 className="flex justify-center text-3xl my-[25px]">Templates</h2>
         <CreateCard
            name="template"
            clickedCreation={[isClickedCreation, setIsClickedCreation]}
         />
         {isClickedCreation && (
            <BackgroundBlur toggleFn={closeTaskCreation}>
               <CreateTemplate closeTaskCreation={closeTaskCreation} />
            </BackgroundBlur>
         )}
      </Frame>
   );
}

export default Templates;
