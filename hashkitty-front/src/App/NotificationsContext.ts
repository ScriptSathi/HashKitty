import { createContext } from 'react';
import { TNotification } from '../types/TypesORM';

interface INotificationContext {
   appendNotifications(notifs: TNotification[]): void;
   deleteNotification(notif: number): void;
   appendShortliveNotifications(notifs: TNotification[]): void;
   removeFromListShortliveNotifications(notif: number): void;
   notifications: TNotification[];
   shortLiveNotifications: TNotification[];
}

export class NotificationsContextImplementation
   implements INotificationContext
{
   public notifications: TNotification[];
   public shortLiveNotifications: TNotification[] = [];
   private setNotifications: React.Dispatch<
      React.SetStateAction<TNotification[]>
   >;
   private setShortLiveNotifications: React.Dispatch<
      React.SetStateAction<TNotification[]>
   >;
   private notifUrl: string;
   constructor(
      notifUrl: string,
      [notifications, setNotifications]: [
         TNotification[],
         React.Dispatch<React.SetStateAction<TNotification[]>>,
      ],
      [shortLiveNotifications, setShortLiveNotifications]: [
         TNotification[],
         React.Dispatch<React.SetStateAction<TNotification[]>>,
      ],
   ) {
      this.setNotifications = setNotifications;
      this.setShortLiveNotifications = setShortLiveNotifications;
      this.notifications = notifications;
      this.shortLiveNotifications = shortLiveNotifications;
      this.notifUrl = notifUrl;
   }
   public appendNotifications(notifs: TNotification[]): void {
      this.appendShortliveNotifications(notifs);
      this.setNotifications(prevNotifs => [
         ...new Set([...prevNotifs, ...notifs]),
      ]);
   }

   public deleteNotification = (notifId: number) => {
      const defaultHeaders = {
         'Content-Type': 'application/json',
         Accept: 'text/event-stream',
      };
      const reqOptions: RequestInit = {
         method: 'DELETE',
         headers: defaultHeaders,
         body: JSON.stringify({ id: notifId }),
      };
      this.setNotifications(prevNotifs =>
         prevNotifs.filter(notif => notif.id !== notifId),
      );
      fetch(this.notifUrl, reqOptions);
      this.shortLiveNotifications.map(notif => {
         if (notif.id === notifId)
            this.removeFromListShortliveNotifications(notifId);
         return notif;
      });
   };

   public appendShortliveNotifications(allNotifs: TNotification[]): void {
      const maximumShortLiveNotifAllow = 3;
      const indexToCutFrom = allNotifs.length - 1 - maximumShortLiveNotifAllow;
      const notifs =
         allNotifs.length > 3
            ? allNotifs.slice(indexToCutFrom, allNotifs.length - 1)
            : allNotifs;

      setTimeout(() => {
         notifs.map(notif => {
            this.removeFromListShortliveNotifications(notif.id);
            return notif;
         });
      }, 5000);
      this.setShortLiveNotifications(prevNotifs => [
         ...new Set([...prevNotifs, ...notifs]),
      ]);
   }

   public removeFromListShortliveNotifications(notifId: number): void {
      this.setShortLiveNotifications(previousNotifs =>
         previousNotifs.filter(notif => notif.id !== notifId),
      );
   }
}

const NotificationsContext = createContext<NotificationsContextImplementation>(
   new NotificationsContextImplementation('', [[], () => {}], [[], () => {}]),
);

export default NotificationsContext;
