import { useContext } from 'react';
import Fade from '@mui/material/Fade';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';

import Alert from '@mui/material/Alert';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import NotificationsContext from '../../App/NotificationsContext';
import ColorModeContext from '../../App/ColorModeContext';

type PopperNotificationProps = {
   isOpen: boolean;
   anchorToElem: HTMLButtonElement | null;
   onClickAway: (isOpen: boolean) => void;
};

export default function PopperNotification({
   isOpen,
   anchorToElem,
   onClickAway,
}: PopperNotificationProps) {
   const {
      theme: { colors },
   } = useContext(ColorModeContext);
   const { notifications, deleteNotification } =
      useContext(NotificationsContext);

   return (
      <ClickAwayListener
         mouseEvent="onMouseDown"
         onClickAway={() => onClickAway(false)}
      >
         <Popper
            open={isOpen}
            anchorEl={anchorToElem}
            placement="bottom-start"
            transition
            sx={{
               width: '50vw',
            }}
         >
            {({ TransitionProps }) => (
               <Fade {...TransitionProps} timeout={350}>
                  <Paper elevation={0}>
                     {notifications.map(({ id, status, message }) => (
                        <Alert
                           key={id}
                           onClose={() => deleteNotification(id)}
                           severity={status}
                           sx={{
                              backgroundColor: colors.alerts[status],
                           }}
                        >
                           {message}
                        </Alert>
                     ))}
                  </Paper>
               </Fade>
            )}
         </Popper>
      </ClickAwayListener>
   );
}
