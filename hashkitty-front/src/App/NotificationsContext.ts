import { createContext } from 'react';
import { TNotification } from '../types/TypesORM';

type TNotificationContext = {
   appendNotifications: (notifs: TNotification[]) => void;
   deleteNotification: (notif: number) => void;
   notifications: TNotification[];
};

const NotificationsContext = createContext<TNotificationContext>({
   appendNotifications: () => {},
   deleteNotification: () => {},
   notifications: [],
});

export default NotificationsContext;
