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
   startTask: () => void;
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
   function startTask() {
      setError('');
      fetch(url, reqOptions)
         .then(res => res.json())
         .then(
            res => {
               if (res.success) setHasStarted(true);
               else setError(res.message);
               setIsLoading(false);
            },
            () => {
               setIsLoading(false);
               setError('An unexpected error occured');
            },
         );
   }
   return { startTask, hasStarted, error, isLoading };
}
