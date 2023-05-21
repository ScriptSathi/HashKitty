import { ThemeProvider as MUIThemeProvider } from '@mui/material';
import { useContext, useEffect, useMemo, useState } from 'react';
import AppRoutes from './AppRoutes';
import ColorModeContext from './ColorModeContext';
import ThemeProvider from './ThemeProvider';
import NotificationsContext, {
   NotificationsContextImplementation,
} from './NotificationsContext';
import { TNotification } from '../types/TypesORM';
import ApiEndpoints from '../ApiEndpoints';

export default function App() {
   const {
      theme: { mode: baseMode },
   } = useContext(ColorModeContext);
   const [mode, setMode] = useState<'light' | 'dark'>(baseMode);
   const [notifications, setNotification] = useState<TNotification[]>([]);
   const [shortLiveNotifications, setShortLiveNotifications] = useState<
      TNotification[]
   >([]);
   const [isEventListening, setIsEventListening] = useState(false);
   const notificationsUrl = ApiEndpoints.GET.notifications;

   const colorContext = useMemo(
      () => ({
         toggleColorMode: () =>
            setMode(prevMode => (prevMode === 'light' ? 'dark' : 'light')),
         theme: new ThemeProvider(mode),
      }),
      [mode],
   );

   const notificationsContext = useMemo(
      () =>
         new NotificationsContextImplementation(
            notificationsUrl,
            [notifications, setNotification],
            [shortLiveNotifications, setShortLiveNotifications],
         ),
      [notifications, shortLiveNotifications],
   );

   useEffect(() => {
      const events = new EventSource(notificationsUrl);
      events.onmessage = ({ data }) => {
         const notifs: TNotification[] = JSON.parse(data);
         notificationsContext.appendNotifications(notifs);
      };
      events.onopen = () => setNotification([]);
      events.onerror = () => {
         setIsEventListening(false);
         events.close();
      };
      setIsEventListening(true);
      return () => {
         setIsEventListening(false);
         events.close();
      };
   }, [isEventListening]);

   return (
      <NotificationsContext.Provider value={notificationsContext}>
         <ColorModeContext.Provider value={colorContext}>
            <MUIThemeProvider theme={colorContext.theme.muiTheme()}>
               <AppRoutes />
            </MUIThemeProvider>
         </ColorModeContext.Provider>
      </NotificationsContext.Provider>
   );
}
