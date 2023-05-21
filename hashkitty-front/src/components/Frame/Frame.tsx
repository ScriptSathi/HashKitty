import { useContext } from 'react';
import Alert from '@mui/material/Alert';
import Grow from '@mui/material/Grow';
import CircularProgress from '@mui/material/CircularProgress';

import NavBar from '../NavBar/NavBar';
import ColorModeContext from '../../App/ColorModeContext';
import NotificationsContext from '../../App/NotificationsContext';

type FrameProps = {
   children?: React.ReactNode;
   isLoading?: boolean;
};

export default function Frame({ children, isLoading }: FrameProps) {
   const {
      theme: { colors },
   } = useContext(ColorModeContext);
   const { shortLiveNotifications, deleteNotification } =
      useContext(NotificationsContext);
   document.body.style.backgroundColor = colors.main;

   return (
      <>
         <header className="relative">
            <NavBar />
            <div className="absolute flex flex-wrap justify-center px-[15vw] w-[90vw] z-10">
               {shortLiveNotifications.map(({ id, status, message }) => (
                  <Grow key={id} in>
                     <Alert
                        key={id}
                        onClose={() => deleteNotification(id)}
                        severity={status}
                        sx={{
                           backgroundColor: colors.alerts[status],
                        }}
                        className="w-full"
                     >
                        {message}
                     </Alert>
                  </Grow>
               ))}
            </div>
         </header>
         <div className="flex justify-center mb-[100px]">
            {isLoading ? (
               <CircularProgress className="mt-96" color="secondary" />
            ) : (
               <main
                  className="block px-[6vw] w-full"
                  style={{ color: colors.font }}
               >
                  {children}
               </main>
            )}
         </div>
      </>
   );
}

Frame.defaultProps = {
   isLoading: false,
   children: undefined,
};
