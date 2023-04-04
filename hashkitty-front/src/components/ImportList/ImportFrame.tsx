import { ReactElement, ReactNode } from 'react';
import {
   FormProvider,
   SubmitHandler,
   FieldValues,
   UseFormReturn,
} from 'react-hook-form';
import { CardContent } from '@mui/material';
import FrameHoverCard from '../ui/Cards/FrameHoverCard/FrameHoverCard';
import useScreenSize from '../../hooks/useScreenSize';
import { ApiImportList, UploadFileType } from '../../types/TApi';

interface Props<T extends FieldValues> {
   onSubmit: SubmitHandler<T>;
   children: ReactNode | ReactNode[];
   submitButton: ReactNode;
   closeImportWindow: () => void;
   formMethods: UseFormReturn<T>;
   type: UploadFileType;
}

export default function ImportFrame({
   onSubmit,
   submitButton,
   closeImportWindow,
   children,
   formMethods,
   type,
}: Props<ApiImportList>): ReactElement {
   const { isMobile, isTablette } = useScreenSize();

   return (
      <FormProvider {...formMethods}>
         <form onSubmit={formMethods.handleSubmit(onSubmit)}>
            <FrameHoverCard
               footer={submitButton}
               title={`Import a ${type}`}
               closeFrame={closeImportWindow}
               height={450}
            >
               <CardContent
                  sx={{
                     width: '100%',
                     height: '50%',
                     overflowY: 'scroll',
                  }}
                  style={{
                     marginLeft: 0,
                     height: isMobile || isTablette ? '74vh' : '30vh',
                  }}
               >
                  {children}
               </CardContent>
            </FrameHoverCard>
         </form>
      </FormProvider>
   );
}
