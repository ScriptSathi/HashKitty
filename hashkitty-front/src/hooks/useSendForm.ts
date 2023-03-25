import { useState } from 'react';
import { TuseFetch } from '../types/THooks';

type SendFormProps<Form> = {
   data?: Form;
   formData?: FormData;
   setHeaders?: boolean;
};
export default function useSendForm<Form extends object>({
   url,
   headers: propsHeaders = {},
}: Omit<TuseFetch, 'method' | 'data'>): {
   sendForm: (form: SendFormProps<Form>, onSuccess?: () => void) => void;
   submitSucced: boolean;
   error: string;
   isLoading: boolean;
} {
   const [submitSucced, setSubmitSucced] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState('');

   const defaultHeaders = { 'Content-Type': 'application/json' };

   function sendForm(
      {
         data = undefined,
         formData = undefined,
         setHeaders = true,
      }: SendFormProps<Form>,
      onSuccess = () => {},
   ) {
      const body = data ? JSON.stringify(data) : formData;
      const headers = setHeaders ? { ...defaultHeaders, ...propsHeaders } : {};
      const reqOptions: RequestInit = {
         method: 'POST',
         headers,
         body,
      };
      setError('');
      setIsLoading(true);
      fetch(url, reqOptions)
         .then(res => res.json())
         .then(
            res => {
               if (res.success) {
                  setSubmitSucced(true);
                  onSuccess();
               } else setError(res.message);
               setIsLoading(false);
            },
            e => {
               console.log(e);

               setIsLoading(false);
               setError('An unexpected error occured');
            },
         );
   }
   return { sendForm, submitSucced, error, isLoading };
}
