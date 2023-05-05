import { useState } from 'react';
import { TuseFetch } from '../types/THooks';
import { TTask } from '../types/TypesORM';

type TuseStartTask = Omit<TuseFetch, 'method' | 'data'> & {
   data: TTask;
};

export default function useStartTask({
   url,
   data,
   headers = {},
}: TuseStartTask): {
   startTask: () => Promise<boolean>;
   hasStarted: boolean;
   error: string;
   isLoading: boolean;
} {
   const [hasStarted, setHasStarted] = useState(false);
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState('');

   const defaultHeaders = { 'Content-Type': 'application/json' };
   let reqOptions: RequestInit = {
      method: 'POST',
      headers: { ...defaultHeaders, ...headers },
   };
   if (data) {
      reqOptions = {
         ...reqOptions,
         body: JSON.stringify(data),
      };
   }
   async function startTask(): Promise<boolean> {
      setError('');
      try {
         const jsonRes = await fetch(url, reqOptions);
         const res = await jsonRes.json();
         if (res.success) setHasStarted(true);
         else setError(res.message);
         setIsLoading(false);
         return res.success;
      } catch {
         setIsLoading(false);
         setError('An unexpected error occured');
         return false;
      }
   }
   return { startTask, hasStarted, error, isLoading };
}
