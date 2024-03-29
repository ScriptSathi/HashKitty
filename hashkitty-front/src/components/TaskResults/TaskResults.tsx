import { CircularProgress } from '@mui/material';
import { useContext, useState } from 'react';
import ApiEndpoints from '../../ApiEndpoints';
import useFetchPassword from '../../hooks/useFetchPassword';
import Modal from '../ui/Cards/Modal/Modal';
import './TaskResuslts.scss';
import useScreenSize from '../../hooks/useScreenSize';
import CheckBox from '../ui/Inputs/CheckBox';
import ColorModeContext from '../../App/ColorModeContext';

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
   const { isMobile, isTablette } = useScreenSize();
   const {
      theme: { colors, isDarkTheme },
   } = useContext(ColorModeContext);
   document.body.style.userSelect = 'none';
   const [onlyPasswds, setOnlyPasswds] = useState(false);
   const { passwds, isLoaded, error } = useFetchPassword({
      method: 'POST',
      url: ApiEndpoints.POST.taskResults,
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
      <Modal className="select-none" closeFrame={closeResults} title={listName}>
         <CheckBox
            title="Show only passwords"
            checked={onlyPasswds}
            onClick={() => setOnlyPasswds(!onlyPasswds)}
         />
         <div
            className={`${
               isMobile || isTablette ? 'h-[75vh]' : 'h-[45vh]'
            } ml-0 mt-3 rounded-[2rem] w-full py-3 px-5 select-text ${
               isLoaded && error.length <= 0
                  ? 'overflow-y-scroll'
                  : 'flex items-center justify-center'
            }`}
            style={{
               marginLeft: 0,
               backgroundColor: isDarkTheme ? colors.secondary : 'black',
            }}
         >
            {isLoaded &&
               error.length <= 0 &&
               filtratePasswds().map(passwd => (
                  <p
                     className="m-0"
                     key={passwd}
                     style={{ color: isDarkTheme ? colors.font : 'white' }}
                  >
                     {passwd}
                  </p>
               ))}
            {isLoaded && error.length > 0 && (
               <p className="m-0 text-white">{error}</p>
            )}
            {!isLoaded && <CircularProgress />}
         </div>
      </Modal>
   );
}
