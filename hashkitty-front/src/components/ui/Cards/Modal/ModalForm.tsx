import { ReactElement, ReactNode } from 'react';
import {
   FormProvider,
   SubmitHandler,
   FieldValues,
   UseFormReturn,
} from 'react-hook-form';
import { CardContent, SxProps, Theme } from '@mui/material';
import useScreenSize from '../../../../hooks/useScreenSize';
import Modal from './Modal';

interface Props<Form extends FieldValues> {
   onSubmit: SubmitHandler<Form>;
   children: ReactNode | ReactNode[];
   submitButton: ReactNode;
   closeTaskCreation: () => void;
   formMethods: UseFormReturn<Form>;
   name: string;
   sx?: SxProps<Theme> | undefined;
}

function ModalForm<Form extends object>({
   onSubmit,
   submitButton,
   closeTaskCreation,
   children,
   formMethods,
   sx,
   name,
}: Props<Form>): ReactElement {
   const { isMobile, isTablette } = useScreenSize();

   return (
      <FormProvider {...formMethods}>
         <form onSubmit={formMethods.handleSubmit(onSubmit)}>
            <Modal
               footer={submitButton}
               title={`Create a new ${name}`}
               closeFrame={closeTaskCreation}
            >
               <CardContent
                  sx={sx}
                  style={{
                     marginLeft: 0,
                     height: isMobile || isTablette ? '76vh' : '430px',
                  }}
               >
                  {children}
               </CardContent>
            </Modal>
         </form>
      </FormProvider>
   );
}
ModalForm.defaultProps = {
   sx: undefined,
};

export default ModalForm;
