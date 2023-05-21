import { useEffect, useState } from 'react';
import { TuseFetch } from '../types/THooks';

export default function useFetchItems<ItemType>({
   method,
   url,
   data,
   headers = {},
   loadOnInit = true,
}: TuseFetch) {
   const [items, setItems] = useState<ItemType[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState<null | unknown>(null);

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

   async function refresh(): Promise<boolean> {
      try {
         const req = await fetch(url, reqOptions);
         const res = await req.json();
         setItems(res.items || []);
         setIsLoading(false);
         return true;
      } catch (e) {
         setError(e);
         refresh();
      }
      return false;
   }

   useEffect(() => {
      if (loadOnInit) {
         refresh();
      }
   }, []);

   return { items, refresh, error, isLoading };
}
