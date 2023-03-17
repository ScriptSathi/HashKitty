import { useState } from 'react';
import { TuseFetch } from '../types/THooks';

export default function useSendForm<Form extends object>({
   url,
   headers = {},
}: Omit<TuseFetch, 'method' | 'data'>): {
   sendForm: (data: Form) => void;
   submitSucced: boolean;
   error: string;
   isLoading: boolean;
} {
   const [submitSucced, setSubmitSucced] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState('');

   const defaultHeaders = { 'Content-Type': 'application/json' };

   function sendForm(data: Form) {
      const reqOptions: RequestInit = {
         method: 'POST',
         headers: { ...defaultHeaders, ...headers },
         body: JSON.stringify(data),
      };
      setError('');
      setIsLoading(true);
      fetch(url, reqOptions)
         .then(res => res.json())
         .then(
            res => {
               if (res.success) setSubmitSucced(true);
               else setError(res.message);
               setIsLoading(false);
            },
            () => {
               setIsLoading(false);
               setError('An unexpected error occured');
            },
         );
   }
   return { sendForm, submitSucced, error, isLoading };
}
