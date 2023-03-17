import { ReactElement, ReactNode } from 'react';
import {
   useForm,
   FormProvider,
   SubmitHandler,
   FieldValues,
} from 'react-hook-form';

interface Props<T extends FieldValues> {
   onSubmit: SubmitHandler<T>;
   children: ReactNode | ReactNode[];
   validateOn: 'onBlur' | 'onSubmit' | 'onChange';
}

export default function Form<Form extends FieldValues>({
   onSubmit,
   children,
}: Props<Form>): ReactElement {
   const methods = useForm<Form>();
   return (
      <FormProvider {...methods}>
         <form onSubmit={methods.handleSubmit(onSubmit)}>{children}</form>
      </FormProvider>
   );
}
