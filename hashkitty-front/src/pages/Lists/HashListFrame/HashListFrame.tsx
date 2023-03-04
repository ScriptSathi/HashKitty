import { useState } from 'react';

import Button from '../../../components/ui/Button/Button';
import { useFetchList } from '../../../hooks/useFetchList';
import { THashlist } from '../../../types/TypesORM';
import { Constants } from '../../../Constants';

import './HashListFrame.scss';
import ImportHashList from '../../../components/ImportHashList/ImportHashList';

export default function HashListFrame(): JSX.Element {
   const { items, error, isLoaded } = useFetchList<THashlist>(
      'GET',
      Constants.apiGetHashlists,
   );
   const [isToggled, setIsToggled] = useState(false);
   const [response, setResponse] = useState({
      message: '',
      color: 'colorRed',
   });
   const importWindow = <ImportHashList handleImportHasSucced={setResponse} />;
   return (
      <>
         <div className="HashListFrame__lists flex spaceBtw">
            <p className="title noMargin">Hashlists</p>
            <p className={`title noMargin ${response.color}`}>
               {response.message}
            </p>
            <Button onClick={() => setIsToggled(!isToggled)}>Import</Button>
         </div>
         <div className="HashListFrame__lists__items HashListFrame__margin fontMedium">
            <p className="Title2">Name</p>
            <p className="Title2">Hash type</p>
            <p className="Title2">Cracked passwords</p>
         </div>
         {items.map(hashList => (
            <div
               className="HashListFrame__lists__items HashListFrame__item HashListFrame__margin fontMedium"
               key={hashList.id}
            >
               <p>{hashList.name}</p>
               <p>{hashList.hashTypeId.name}</p>
               <p>
                  {hashList.numberOfCrackedPasswords === null
                     ? 'Not cracked yet'
                     : hashList.numberOfCrackedPasswords}
               </p>
            </div>
         ))}
         {isToggled && importWindow}
      </>
   );
}
