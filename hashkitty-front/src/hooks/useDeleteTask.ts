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
   deleteTask: () => Promise<void>;
   deleteMessage: string;
   isError: boolean;
   isLoading: boolean;
} {
   const [deleteMessage, setDeleteMessage] = useState('');
   const [isLoading, setIsLoading] = useState(false);
   const [isError, setIsError] = useState(false);

   const defaultHeaders = { 'Content-Type': 'application/json' };
   let reqOptions: RequestInit = {
      method: 'DELETE',
      headers: { ...defaultHeaders, ...headers },
   };
   if (data) {
      reqOptions = {
         ...reqOptions,
         body: JSON.stringify(data),
      };
   }
   async function deleteTask() {
      const req = await fetch(url, reqOptions);
      try {
         const res = await req.json();
         if (!res.success) setIsError(true);
         setIsLoading(false);
         setDeleteMessage(res.message);
      } catch (e) {
         setIsLoading(false);
         setIsError(true);
         setDeleteMessage('An unexpected error occured');
      }
   }
   return { deleteTask, deleteMessage, isError, isLoading };
}
