import { useEffect, useState } from 'react';

export function useFetchList<ItemType>(
   method: 'GET' | 'POST',
   url: string,
   data?: unknown,
   headers = {},
) {
   const [items, setItems] = useState<ItemType[]>([]);
   const [isLoaded, setIsLoaded] = useState(false);
   const [error, setError] = useState(null);

   const defaultHeaders = { 'Content-Type': 'application/json' };
   let reqOptions: RequestInit = {
      method,
      headers: { ...defaultHeaders, ...headers },
   };
   if (data) {
      reqOptions = {
         ...reqOptions,
         body: JSON.stringify(data),
      };
   }
   useEffect(() => {
      fetch(url, reqOptions)
         .then(res => res.json())
         .then(
            res => {
               setItems(res.success);
               setIsLoaded(true);
            },
            err => {
               setIsLoaded(true);
               setError(err);
            },
         );
   }, []);
   return { items, error, isLoaded };
}
