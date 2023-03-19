import { ReactElement, ReactNode } from 'react';
import {
   FormProvider,
   SubmitHandler,
   FieldValues,
   UseFormReturn,
} from 'react-hook-form';
import { CardContent } from '@mui/material';
import FrameHoverCard from '../ui/Cards/FrameHoveCard/FrameHoverCard';
import useScreenSize from '../../hooks/useScreenSize';
import { CreateTaskForm } from '../../types/TComponents';

interface Props<T extends FieldValues> {
   onSubmit: SubmitHandler<T>;
   children: ReactNode | ReactNode[];
   submitButton: ReactNode;
   closeTaskCreation: () => void;
   formMethods: UseFormReturn<T>;
}

export default function CreateFrame({
   onSubmit,
   submitButton,
   closeTaskCreation,
   children,
   formMethods,
}: Props<CreateTaskForm>): ReactElement {
   const { isMobile, isTablette } = useScreenSize();

   return (
      <FormProvider {...formMethods}>
         <form onSubmit={formMethods.handleSubmit(onSubmit)}>
            <FrameHoverCard
               footer={submitButton}
               title="Create a new task"
               closeFrame={closeTaskCreation}
            >
               <CardContent
                  sx={{
                     width: '100%',
                     height: '50%',
                     overflowY: 'scroll',
                  }}
                  style={{
                     marginLeft: 0,
                     height: isMobile || isTablette ? '74vh' : '45vh',
                  }}
               >
                  {children}
               </CardContent>
            </FrameHoverCard>
         </form>
      </FormProvider>
   );
}
