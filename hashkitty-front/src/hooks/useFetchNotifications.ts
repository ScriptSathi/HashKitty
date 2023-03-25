import { useEffect, useState } from 'react';
import { TNotification } from '../types/TypesORM';
import ApiEndpoints from '../ApiEndpoints';

export default function useFetchNotifications() {
   const [notifications, setNotifications] = useState<TNotification[]>([]);
   const [isLoading, setIsLoading] = useState(false);
   const url = ApiEndpoints.apiNotifications;
   const defaultHeaders = { 'Content-Type': 'application/json' };

   async function refreshNotifications() {
      const reqOptions: RequestInit = {
         method: 'GET',
         headers: defaultHeaders,
      };
      setIsLoading(true);
      const req = await fetch(url, reqOptions);
      try {
         const res = await req.json();
         setNotifications(res.items);
         setIsLoading(false);
      } catch (e) {
         setIsLoading(false);
      }
   }

   function deleteNotification(id: number, itemIndex: number) {
      const reqOptions: RequestInit = {
         method: 'DELETE',
         headers: defaultHeaders,
         body: JSON.stringify({ id }),
      };
      setIsLoading(true);
      notifications.splice(itemIndex, 1);
      setNotifications(notifications);
      fetch(url, reqOptions);
   }

   useEffect(() => {
      const interval = setInterval(() => {
         refreshNotifications();
      }, 1000);
      return () => clearInterval(interval);
   }, []);

   return {
      notifications,
      refreshNotifications,
      deleteNotification,
      isLoading,
   };
}
