import { useState } from 'react';
import { TuseFetch } from '../types/THooks';

type TuseDeleteTask = Omit<TuseFetch, 'method' | 'data'> & {
   data: { id: number };
};

export default function useDeleteTask({
   url,
   data,
   headers = {},
}: TuseDeleteTask): {
   deleteTask: () => void;
   isDeleted: boolean;
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
   function deleteTask() {
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
   return { deleteTask, isDeleted: hasStarted, error, isLoading };
}
