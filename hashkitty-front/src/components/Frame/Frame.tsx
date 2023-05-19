import { Alert, CircularProgress } from '@mui/material';

import { useContext } from 'react';
import NavBar from '../NavBar/NavBar';
import useFetchNotifications from '../../hooks/useFetchNotifications';
import ColorModeContext from '../../App/ColorModeContext';

type FrameProps = {
   children?: React.ReactNode;
   isLoading?: boolean;
   className?: string | undefined;
};

export default function Frame({ children, isLoading, className }: FrameProps) {
   const {
      theme: { colors },
   } = useContext(ColorModeContext);
   const { notifications, deleteNotification } = useFetchNotifications();

   return (
      <div
         className={`h-[100vh] ${className}`}
         style={{ backgroundColor: colors.main }}
      >
         <header>
            <NavBar />
            <div className="flex flex-wrap justify-center px-[15vw]">
               {notifications.map((notif, i) => (
                  <Alert
                     key={notif.id}
                     onClose={() => deleteNotification(notif.id, i)}
                     severity={notif.status}
                     className=" w-full"
                  >
                     {notif.message}
                  </Alert>
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
      </div>
   );
}

Frame.defaultProps = {
   isLoading: false,
   className: undefined,
   children: undefined,
};
