import { useEffect, useState } from 'react';
import { TuseFetch } from '../types/THooks';

export default function useFetchMessage({
   method,
   url,
   data,
   headers = {},
}: TuseFetch & { optionalMessageStyle: string }) {
   const [message, setMessage] = useState<string>('');
   const [color, setColor] = useState<string>('colorRed');
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
         .then(res => {
            if (res.success) {
               setColor('colorGreen');
            } else {
               setError(res.error);
            }
            setMessage(res.message);
            setIsLoaded(true);
         });
   }, []);
   return { message, isLoaded, color, error };
}
