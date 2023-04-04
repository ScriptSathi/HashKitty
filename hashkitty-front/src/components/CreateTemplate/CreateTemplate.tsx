import { Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import FrameHoverCardForm from '../ui/Cards/FrameHoverCard/FrameHoverCardForm';
import { CreateTemplateForm } from '../../types/TComponents';
import useSendForm from '../../hooks/useSendForm';
import ApiEndpoints from '../../ApiEndpoints';
import { TemplateUpdate } from '../../types/TApi';
import CreateTaskOrTemplateErrorHandler from '../../utils/CreateTaskOrTemplateErrorHandler';
import { CreateTemplateErrors } from '../../types/TypesErrorHandler';
import useFetchAllList from '../../hooks/useFetchAllLists';

type CreateTemplateProps = {
   closeTaskCreation: () => void;
};

function CreateTemplate({ closeTaskCreation }: CreateTemplateProps) {
   const formMethods = useForm<CreateTemplateForm>({
      defaultValues: {
         name: '',
         attackModeId: '',
         cpuOnly: false,
         rules: [],
         maskQuery: '',
         maskFileName: '',
         potfileName: '',
         kernelOpti: false,
         wordlistName: '',
         workloadProfile: 3,
         breakpointGPUTemperature: 90,
      },
   });
   const { sendForm, isLoading: isLoadingCreation } =
      useSendForm<TemplateUpdate>({
         url: ApiEndpoints.POST.template,
      });

   const {
      register,
      setValue,
      setError,
      control,
      formState: { errors },
   } = formMethods;

   const {
      hashlists,
      templates,
      attackModes,
      potfiles,
      rules,
      wordlists,
      isLoading,
      refresh,
   } = useFetchAllList();

   const onSubmit = (form: CreateTemplateForm) => {
      const formVerifier = new CreateTaskOrTemplateErrorHandler<CreateTemplateErrors>(setError, {
         attackModes,
         hashlists,
         wordlists,
         rules,
         potfiles,
      });
      formVerifier.analyseTemplate(form);
      if (formVerifier.isValid) {
         sendForm({ data: formVerifier.finalForm });
         if (!isLoadingCreation) {
            closeTaskCreation();
         }
      }
   };

   return (
      <FrameHoverCardForm<CreateTemplateForm>
         name="template"
         formMethods={formMethods}
         onSubmit={onSubmit}
         closeTaskCreation={closeTaskCreation}
         submitButton={
            <Button className="w-full" type="submit">
               Create
            </Button>
         }
      >
         <p>aaaaaaaaaaaaaaaaaaaaaaaa</p>
      </FrameHoverCardForm>
   );
}

export default CreateTemplate;
