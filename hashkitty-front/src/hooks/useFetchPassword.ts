import { useEffect, useState } from 'react';
import { TuseFetch } from '../types/THooks';

type TuseFetchPasswordReturn = {
   passwds: string[];
   isLoaded: boolean;
   error: string;
};

export default function useFetchPassword({
   method,
   url,
   data,
   headers = {},
}: TuseFetch): TuseFetchPasswordReturn {
   const [passwds, setPasswds] = useState<string[]>([]);
   const [isLoaded, setIsLoaded] = useState(false);
   const [error, setError] = useState('');

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
            if (res.passwds.length > 0) setPasswds(res.passwds);
            else setError(res.message);
            setIsLoaded(true);
         })
         .catch(() => {
            setError('Unable to fetch the results');
            setIsLoaded(true);
         });
   }, []);
   return { passwds, isLoaded, error };
}
