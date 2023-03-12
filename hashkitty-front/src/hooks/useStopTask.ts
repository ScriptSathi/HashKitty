import { useState } from 'react';
import { TuseFetch } from '../types/THooks';

type TuseStopTask = Omit<TuseFetch, 'method' | 'data'>;

export default function useStopTask({ url, headers = {} }: TuseStopTask): {
   stopTask: () => void;
   error: boolean;
   stoppedSucced: boolean;
} {
   const [stoppedSucced, setStoppedSucced] = useState(false);
   const [error, setError] = useState(true);

   const defaultHeaders = { 'Content-Type': 'application/json' };
   const reqOptions: RequestInit = {
      method: 'GET',
      headers: { ...defaultHeaders, ...headers },
   };

   function stopTask() {
      fetch(url, reqOptions)
         .then(res => res.json())
         .then(
            res => {
               if (!res.success) setError(res.message);
               setStoppedSucced(true);
            },
            () => {
               setStoppedSucced(false);
               setError(true);
            },
         );
   }
   return { stopTask, error, stoppedSucced };
}
