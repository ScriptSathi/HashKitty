import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { CircularProgress } from '@mui/material';
import FrameHoverCardForm from '../ui/Cards/FrameHoverCard/FrameHoverCardForm';
import {
   AttackModeAvailable,
   CreateTemplateForm,
} from '../../types/TComponents';
import useSendForm from '../../hooks/useSendForm';
import ApiEndpoints from '../../ApiEndpoints';
import { TemplateUpdate } from '../../types/TApi';
import CreateTaskOrTemplateErrorHandler from '../../utils/CreateTaskOrTemplateErrorHandler';
import { CreateTemplateErrors } from '../../types/TypesErrorHandler';
import useFetchAllList from '../../hooks/useFetchAllLists';
import Button from '../ui/Buttons/Button';
import InitialStep from './InitialStep';
import useMultistepForm from '../../hooks/useMultiStepForm';
import AttackModeStep from './AttackModeStep';
import AdvancedStep from './AdvancedStep';

type CreateTemplateProps = {
   closeTaskCreation: () => void;
};

function CreateTemplate({ closeTaskCreation }: CreateTemplateProps) {
   const { hashlists, attackModes, potfiles, rules, wordlists, isLoading } =
      useFetchAllList();

   const [inputAttackMode, setInputAttackMode] = useState<{
      id: number;
      name: string;
      mode: AttackModeAvailable;
   }>({
      id: 1,
      name: 'Unknow',
      mode: 0,
   });
   const formMethods = useForm<CreateTemplateForm>({
      defaultValues: {
         name: '',
         attackModeId: '1',
         cpuOnly: false,
         rules: [],
         maskQuery: '',
         maskFileName: '',
         potfileName: '',
         kernelOpti: false,
         wordlistName: '',
         combinatorWordlistName: '',
         workloadProfile: '3',
         breakpointGPUTemperature: '90',
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
      formState: { errors },
   } = formMethods;

   const multistepFormProps = {
      register,
      setValue,
      errors,
      DBData: {
         hashlists,
         attackModes,
         potfiles,
         rules,
         wordlists,
      },
   };
   const { currentStepIndex, step, isFirstStep, isLastStep, next, back } =
      useMultistepForm([
         <InitialStep
            key={0}
            {...multistepFormProps}
            attackModes={attackModes}
            inputAttackMode={[inputAttackMode, setInputAttackMode]}
         />,
         <AttackModeStep
            key={1}
            {...multistepFormProps}
            attackMode={inputAttackMode.mode}
         />,
         <AdvancedStep key={2} {...multistepFormProps} />,
      ]);

   const onSubmit = (form: CreateTemplateForm) => {
      const formVerifier =
         new CreateTaskOrTemplateErrorHandler<CreateTemplateErrors>(setError, {
            attackModes,
            hashlists,
            wordlists,
            rules,
            potfiles,
         });

      const isSecondStep = currentStepIndex === 1;
      if (isFirstStep) formVerifier.analyseFirstStepTemplate(form);
      else if (isSecondStep)
         formVerifier.analyseSecondStepTemplate(form, inputAttackMode.mode);
      else formVerifier.analyseTemplate(form, inputAttackMode.mode);

      if (formVerifier.isValid && !isLastStep) next();
      else if (formVerifier.isValid && isLastStep) {
         sendForm({ data: formVerifier.finalForm });
         if (!isLoadingCreation) {
            closeTaskCreation();
         }
      }
   };

   if (isLoading || isLoadingCreation) {
      return (
         <FrameHoverCardForm<CreateTemplateForm>
            name="template"
            sx={{
               width: '100%',
               height: '50%',
               overflowY: 'scroll',
            }}
            formMethods={formMethods}
            onSubmit={onSubmit}
            closeTaskCreation={closeTaskCreation}
            submitButton={
               <Button className="w-full text-lg" type="submit">
                  <CircularProgress size={28} color="secondary" />
               </Button>
            }
         >
            <div className="flex justify-center">
               <CircularProgress className="mt-[200px]" color="secondary" />
            </div>
         </FrameHoverCardForm>
      );
   }

   return (
      <FrameHoverCardForm<CreateTemplateForm>
         name="template"
         formMethods={formMethods}
         onSubmit={onSubmit}
         closeTaskCreation={closeTaskCreation}
         submitButton={
            <section className="flex w-full gap-x-[10rem]">
               {!isFirstStep && (
                  <Button
                     className="w-full text-base"
                     type="button"
                     onClick={back}
                  >
                     Back
                  </Button>
               )}
               <Button className="w-full text-base" type="submit">
                  {isLastStep ? 'Create' : 'Next'}
               </Button>
            </section>
         }
      >
         {step}
      </FrameHoverCardForm>
   );
}

export default CreateTemplate;
