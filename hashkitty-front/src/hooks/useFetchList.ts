import { useEffect, useState } from 'react';
import { TuseFetch } from '../types/THooks';

export default function useFetchList<ItemType>({
   method,
   url,
   data,
   headers = {},
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

   async function refresh() {
      const req = await fetch(url, reqOptions);
      try {
         const res = await req.json();
         setItems(res.items || []);
         setIsLoading(false);
      } catch (e) {
         setIsLoading(false);
         setError(e);
      }
   }

   useEffect(() => {
      refresh();
   }, []);
   return { items, refresh, error, isLoading };
}
