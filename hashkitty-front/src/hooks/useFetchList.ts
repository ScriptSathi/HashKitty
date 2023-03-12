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
               setIsLoading(false);
            },
            err => {
               setIsLoading(false);
               setError(err);
            },
         );
   }, []);
   return { items, error, isLoading };
}
