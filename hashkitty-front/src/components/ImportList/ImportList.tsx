import { TextField, CircularProgress } from '@mui/material';
import { useForm } from 'react-hook-form';
import Button from '../ui/Buttons/Button';
import ApiEndpoints from '../../ApiEndpoints';
import useSendForm from '../../hooks/useSendForm';
import { ApiImportList, UploadFileType } from '../../types/TApi';
import ImportFrame from './ImportFrame';
import ImportListErrorHandler from '../../utils/ImportListErrorHandler';
import useFetchItems from '../../hooks/useFetchItems';
import { THashType } from '../../types/TypesORM';
import DragNDrop from '../ui/DragNDrop/DragNDrop';
import InputDropdown from '../ui/Inputs/InputDropdown';

type ImportListProps = {
   closeImportWindow: (doRefresh?: boolean) => void;
   type: UploadFileType;
};

function ImportList({ closeImportWindow, type }: ImportListProps) {
   const isHashlist = type === 'hashlist';
   const { items: hashtypes, isLoading } = useFetchItems<THashType>({
      method: 'GET',
      url: ApiEndpoints.GET.hashtypes,
   });
   const { sendForm, isLoading: isLoadingCreation } =
      useSendForm<ApiImportList>({
         url: ApiEndpoints.POST.list,
      });

   const formMethods = useForm<ApiImportList>({
      defaultValues: {
         fileName: '',
         type,
         hashTypeId: isHashlist ? -1 : undefined,
      },
   });
   const {
      register,
      setValue,
      setError,
      formState: { errors },
   } = formMethods;

   const getOptionLabel: (elem: THashType) => string = ({ name, typeNumber }) =>
      `${typeNumber} - ${name}`;

   const onSubmit = (form: ApiImportList) => {
      const formVerifier = new ImportListErrorHandler(setError, {
         hashtypes,
      });
      formVerifier.analyse(form);

      if (formVerifier.isValid) {
         const formData = new FormData();
         formData.append('fileName', form.fileName);
         formData.append('type', type);
         formData.append('file', form.file, form.file.name);
         if (isHashlist)
            formData.append('hashTypeId', form.hashTypeId?.toString() || '-1');
         sendForm({ formData, setHeaders: false }, () =>
            closeImportWindow(true),
         );
      }
   };

   if (isLoading || isLoadingCreation) {
      return (
         <ImportFrame
            formMethods={formMethods}
            onSubmit={onSubmit}
            closeImportWindow={closeImportWindow}
            type={type}
            submitButton={
               <Button className="w-full" type="submit">
                  Import
               </Button>
            }
         >
            <div className="flex justify-center">
               <CircularProgress className="mt-[100px]" color="secondary" />
            </div>
         </ImportFrame>
      );
   }
   return (
      <ImportFrame
         formMethods={formMethods}
         onSubmit={onSubmit}
         closeImportWindow={closeImportWindow}
         type={type}
         submitButton={
            <Button className="w-full" type="submit">
               Import
            </Button>
         }
      >
         <div className="flex flex-wrap gap-2 justify-between">
            <section className="flex flex-col gap-2">
               <TextField
                  {...register('fileName', {
                     maxLength: {
                        value: 50,
                        message: 'Must be shorter than 50 characters',
                     },
                  })}
                  error={!!errors.fileName && !!errors.fileName.message}
                  label="File name *"
                  helperText={errors.fileName?.message}
                  sx={{ marginTop: 0.5, width: 300 }}
               />
               {isHashlist && (
                  <InputDropdown<THashType, ApiImportList>
                     register={register}
                     options={hashtypes}
                     errors={errors}
                     getOptionLabel={
                        getOptionLabel as
                           | (((elem: THashType) => string) &
                                ((option: string | THashType) => string))
                           | undefined
                     }
                     formName="hashTypeId"
                     label="Hash type *"
                     onChange={(_, value) => {
                        setValue('hashTypeId', (value as THashType)?.id || -1);
                     }}
                     isOptionEqualToValue={(option, value) =>
                        option.id === value.id || value === null
                     }
                  />
               )}
            </section>
            <section>
               <DragNDrop<ApiImportList>
                  setValue={setValue}
                  register={register}
               />
               <p
                  className="text-red-500 ml-[10px]"
                  style={{
                     fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
                  }}
               >
                  {errors?.file?.message}
               </p>
            </section>
         </div>
      </ImportFrame>
   );
}

export default ImportList;
