import { ThemeProvider as MUIThemeProvider } from '@mui/material';
import { useContext, useEffect, useMemo, useState } from 'react';
import AppRoutes from './AppRoutes';
import ColorModeContext from './ColorModeContext';
import ThemeProvider from './ThemeProvider';
import NotificationsContext from './NotificationsContext';
import { TNotification } from '../types/TypesORM';
import ApiEndpoints from '../ApiEndpoints';

export default function App() {
   const {
      theme: { mode: baseMode },
   } = useContext(ColorModeContext);
   const [mode, setMode] = useState<'light' | 'dark'>(baseMode);
   const [notifications, setNotification] = useState<TNotification[]>([]);
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
      () => ({
         deleteNotification: (id: number) => {
            const defaultHeaders = {
               'Content-Type': 'application/json',
               Accept: 'text/event-stream',
            };
            const reqOptions: RequestInit = {
               method: 'DELETE',
               headers: defaultHeaders,
               body: JSON.stringify({ id }),
            };
            setNotification(prevNotifs =>
               prevNotifs.filter(notif => notif.id !== id),
            );
            fetch(notificationsUrl, reqOptions);
         },
         appendNotifications: (notifs: TNotification[]) =>
            setNotification(prevNotifs => [
               ...new Set([...prevNotifs, ...notifs]),
            ]),
         notifications,
      }),
      [notifications],
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
