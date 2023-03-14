import { CircularProgress } from '@mui/material';
import { useState } from 'react';
import ApiEndpoints from '../../ApiEndpoints';
import useFetchPassword from '../../hooks/useFetchPassword';
import FrameHoverCard from '../ui/Cards/FrameHoveCard/FrameHoverCard';
import './TaskResuslts.scss';

type TaskResultsProps = {
   listName: string;
   listId: number;
   closeResults: () => void;
};

export default function TaskResults({
   listName,
   listId,
   closeResults,
}: TaskResultsProps) {
   document.body.style.userSelect = 'none';
   const [onlyPasswds, setOnlyPasswds] = useState(false);
   const { passwds, isLoaded, error } = useFetchPassword({
      method: 'POST',
      url: ApiEndpoints.apiPOSTTaskResults,
      data: {
         filename: `${listName}-${listId}`,
      },
   });

   function filtratePasswds() {
      if (onlyPasswds) {
         return passwds.map(passwd => {
            const p = passwd.split(':');
            return p[p.length - 1];
         });
      }
      return passwds;
   }
   return (
      <FrameHoverCard
         className="select-none"
         closeFrame={closeResults}
         title={listName}
      >
         <div className="flex items-center select-none">
            <input
               className="flex fontMedium checkBox mt-1 mr-5"
               type="checkbox"
               checked={onlyPasswds}
               onChange={() => setOnlyPasswds(!onlyPasswds)}
            />
            <p className="m-0">Show only passwords</p>
         </div>
         <div
            className={`ml-0 mt-3 bg-black rounded-[2rem] w-full h-full py-3 px-5a select-text ${
               isLoaded && error.length <= 0
                  ? 'overflow-y-scroll'
                  : 'flex items-center justify-center'
            }`}
            style={{ marginLeft: 0 }}
         >
            {isLoaded &&
               error.length <= 0 &&
               filtratePasswds().map(passwd => (
                  <p className="m-0 text-white" key={passwd}>
                     {passwd}
                  </p>
               ))}
            {isLoaded && error.length > 0 && (
               <p className="m-0 text-white">{error}</p>
            )}
            {!isLoaded && <CircularProgress />}
         </div>
      </FrameHoverCard>
   );
}
