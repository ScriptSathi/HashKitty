import {
   TextField,
   Select,
   MenuItem,
   ListItemText,
   OutlinedInput,
   InputLabel,
   FormControl,
   CircularProgress,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import Button from '../ui/Buttons/Button';
import CreateTaskOrTemplateErrorHandler from '../../utils/CreateTaskOrTemplateErrorHandler';
import useFetchAllList from '../../hooks/useFetchAllLists';
import FormatList from '../../utils/FormatUtils';
import type { CreateTaskForm } from '../../types/TComponents';
import TemplateRadio from './TemplateRadio';
import createTaskDefaultValues from './createTaskDefaultValues';
import ApiEndpoints from '../../ApiEndpoints';
import useSendForm from '../../hooks/useSendForm';
import { TaskUpdate } from '../../types/TApi';
import BackgroundBlur from '../ui/BackgroundBlur/BackGroundBlur';
import ImportList from '../ImportList/ImportList';
import useScreenSize from '../../hooks/useScreenSize';
import InputDropdown from '../ui/Inputs/InputDropdown';
import FrameHoverCardForm from '../ui/Cards/FrameHoverCard/FrameHoverCardForm';
import { CreateTaskErrors } from '../../types/TypesErrorHandler';
import BreakPointTempField from '../HashcatFields/BreakPointTempField';
import KernelOptiCheckBox from '../HashcatFields/KernelOptiCheckBox';
import CPUOnlyCheckBox from '../HashcatFields/CPUOnlyCheckBox';
import WorkloadProfileField from '../HashcatFields/WorkloadProfileField';
import WordlistField from '../HashcatFields/WordlistField';
import CombinatorAttackField from '../HashcatFields/CombinatorAttackField';
import MaskQueryField from '../HashcatFields/MaskQueryField';
import AttackModeRadio from '../HashcatFields/AttackModeRadio';
import PotfileField from '../HashcatFields/PotfileField';
import CustomCharsetField from '../HashcatFields/CustomCharsetField';
import type { TAttackMode } from '../../types/TypesORM';

type CreateTaskProps = {
   closeTaskCreation: () => void;
};

export default function CreateTask({ closeTaskCreation }: CreateTaskProps) {
   const { isTablette, isMobile } = useScreenSize();
   const [inputWordlist, setInputWordlist] = useState<string | null>(null);
   const [inputMaskQuery, setInputMaskQuery] = useState<string>('');
   const [inputPotfile, setInputPotfile] = useState<string | null>(null);
   const [inputHashlist, setInputHashlist] = useState<string | null>(null);
   const [inputRules, setInputRules] = useState<string[]>([]);
   const [inputAttackMode, setAttackMode] = useState<TAttackMode>({
      id: -1,
      name: '',
      mode: 0,
   });
   const [inputCustomCharset1, setCustomCharset1] = useState<string>('');
   const [inputCustomCharset2, setCustomCharset2] = useState<string>('');
   const [inputCustomCharset3, setCustomCharset3] = useState<string>('');
   const [inputCustomCharset4, setCustomCharset4] = useState<string>('');
   const [inputBreakTemp, setBreakTemp] = useState<string | null>('90');
   const [inputCpuOnly, setCpuOnly] = useState<boolean>(false);
   const [inputKernelOpti, setKernelOpti] = useState<boolean>(false);
   const [inputCombinatorWordlist, setCombinatorWordlist] = useState<
      string | null
   >(null);
   const [inputWorkloadProfile, setWorkloadProfile] = useState<string | null>(
      '3',
   );
   const [isClickedImport, setIsClickedImport] = useState(false);
   const { sendForm, isLoading: isLoadingCreation } = useSendForm<TaskUpdate>({
      url: ApiEndpoints.POST.task,
   });
   const formMethods = useForm<CreateTaskForm>({
      defaultValues: createTaskDefaultValues,
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

   const closeImportWindow = () => {
      setIsClickedImport(!isClickedImport);
      setTimeout(() => refresh(), 1000);
   };

   const isStraightAttack = inputAttackMode?.mode === 0;
   const isCombinatorAttack = inputAttackMode?.mode === 1;
   const isBFAttack = inputAttackMode?.mode === 3;
   const isAssociationAttack = inputAttackMode?.mode === 9;

   const fieldsProps = {
      register,
      errors,
      setValue,
   };

   const onSubmit = (form: CreateTaskForm) => {
      const formVerifier =
         new CreateTaskOrTemplateErrorHandler<CreateTaskErrors>(setError, {
            attackModes,
            templates,
            hashlists,
            wordlists,
            rules,
            potfiles,
         });
      formVerifier.analyseTask(form, inputAttackMode.mode);
      if (formVerifier.isValid) {
         sendForm({ data: formVerifier.finalForm as TaskUpdate });
         if (!isLoadingCreation) {
            closeTaskCreation();
         }
      }
   };

   if (isLoading ?? isLoadingCreation) {
      return (
         <FrameHoverCardForm<CreateTaskForm>
            name="task"
            sx={{
               width: '100%',
               height: '50%',
               overflowY: 'scroll',
            }}
            formMethods={formMethods}
            onSubmit={onSubmit}
            closeTaskCreation={closeTaskCreation}
            submitButton={
               <Button className="w-full" type="submit">
                  Create
               </Button>
            }
         >
            <div className="flex justify-center">
               <CircularProgress className="mt-[200px]" color="secondary" />
            </div>
         </FrameHoverCardForm>
      );
   }

   if ((isTablette ?? isMobile) && isClickedImport) {
      return (
         <ImportList closeImportWindow={closeImportWindow} type="hashlist" />
      );
   }
   return (
      <>
         <FrameHoverCardForm<CreateTaskForm>
            name="task"
            sx={{
               width: '100%',
               height: '50%',
               overflowY: 'scroll',
            }}
            formMethods={formMethods}
            onSubmit={onSubmit}
            closeTaskCreation={closeTaskCreation}
            submitButton={
               <Button className="w-full" type="submit">
                  Create
               </Button>
            }
         >
            <div className="flex justify-between gap-2 flex-wrap">
               <section className="flex flex-col flex-wrap gap-2 justify-between">
                  <TextField
                     {...register('name', {
                        maxLength: {
                           value: 20,
                           message: 'Must be shorter than 20 characters',
                        },
                     })}
                     error={!!errors.name && !!errors.name.message}
                     label="Name *"
                     helperText={errors.name?.message}
                     sx={{ marginTop: 0.5 }}
                  />
                  <div>
                     <Button
                        size="small"
                        sx={{
                           marginBottom: .6,
                        }}
                        fontSize={11}
                        onClick={() => setIsClickedImport(!isClickedImport)}
                     >
                        Import a hash list
                     </Button>
                     <InputDropdown<string, CreateTaskForm>
                        register={register}
                        options={FormatList.standard(hashlists)}
                        errors={errors}
                        formName="hashlistName"
                        label="Hash lists *"
                        value={inputHashlist}
                        onChange={(_, value) => {
                           setInputHashlist(value as string);
                           setValue('hashlistName', (value as string) ?? '');
                        }}
                        isOptionEqualToValue={(option, value) =>
                           option === value || value === null
                        }
                     />
                  </div>
               </section>
               <section className="">
                  <TemplateRadio
                     list={templates}
                     register={register}
                     control={control}
                     inputWordlist={['wordlistName', setInputWordlist]}
                     inputPotfile={['potfileName', setInputPotfile]}
                     inputAttackMode={['attackModeId', setAttackMode]}
                     inputBreakTemp={['breakpointGPUTemperature', setBreakTemp]}
                     inputWorkloadProfile={[
                        'workloadProfile',
                        setWorkloadProfile,
                     ]}
                     inputKernelOpti={['kernelOpti', setKernelOpti]}
                     inputCpuOnly={['cpuOnly', setCpuOnly]}
                     inputMaskQuery={['maskQuery', setInputMaskQuery]}
                     inputRules={['rules', setInputRules]}
                     inputCombinatorWordlistName={[
                        'combinatorWordlistName',
                        setCombinatorWordlist,
                     ]}
                     inputCustomCharsets={[
                        ['customCharset1', setCustomCharset1],
                        ['customCharset2', setCustomCharset2],
                        ['customCharset3', setCustomCharset3],
                        ['customCharset4', setCustomCharset4]
                     ]}
                  />
               </section>
            </div>
            <div className="mt-[5rem]">
               <h3 className="text-lg mb-[2rem]">Advanced configurations</h3>
               <div className="flex justify-between flex-wrap gap-2">
                  <section className="flex flex-col gap-2 justify-between">
                     {!isBFAttack && (
                        <WordlistField<CreateTaskForm>
                           customState={[inputWordlist, setInputWordlist]}
                           wordlists={wordlists}
                           {...fieldsProps}
                           sx={{ width: 300 }}
                        />
                     )}
                     {isCombinatorAttack && (
                        <CombinatorAttackField<CreateTaskForm>
                           customState={[
                              inputCombinatorWordlist,
                              setCombinatorWordlist,
                           ]}
                           wordlists={wordlists}
                           {...fieldsProps}
                           sx={{ width: 300 }}
                        />
                     )}
                     {!isCombinatorAttack &&
                        !isStraightAttack &&
                        !isAssociationAttack && (
                           <MaskQueryField<CreateTaskForm>
                              customState={[inputMaskQuery, setInputMaskQuery]}
                              {...fieldsProps}
                              sx={{ width: 300 }}
                           />
                        )}
                  </section>
                  <section>
                     <AttackModeRadio<CreateTaskForm>
                        customState={[inputAttackMode, setAttackMode]}
                        attackModes={attackModes}
                        {...fieldsProps}
                     />
                  </section>
               </div>
               {isBFAttack && (
                  <div className="mt-[15px] flex justify-between flex-wrap gap-2">
                     <section className="flex flex-col gap-y-5 justify-between">
                        <CustomCharsetField<CreateTaskForm>
                           {...fieldsProps}
                           customState={[inputCustomCharset1, setCustomCharset1]}
                           charsetNumber={1}
                        />
                        <CustomCharsetField<CreateTaskForm>
                           {...fieldsProps}
                           customState={[inputCustomCharset2, setCustomCharset2]}
                           charsetNumber={2}
                        />
                     </section>
                     <section className="flex flex-col gap-y-5 justify-between">
                        <CustomCharsetField<CreateTaskForm>
                           {...fieldsProps}
                           customState={[inputCustomCharset3, setCustomCharset3]}
                           charsetNumber={3}
                        />
                        <CustomCharsetField<CreateTaskForm>
                           {...fieldsProps}
                           customState={[inputCustomCharset4, setCustomCharset4]}
                           charsetNumber={4}
                        />
                     </section>
                  </div>
               )}
               <div className="flex flex-wrap mt-10 flex-col gap-y-3">
                  <section className="flex flex-wrap gap-2 justify-between">
                     <PotfileField<CreateTaskForm>
                        customState={[inputPotfile, setInputPotfile]}
                        potfiles={potfiles}
                        {...fieldsProps}
                        sx={{ width: 300 }}
                     />
                     <FormControl sx={{ width: 300 }}>
                        <InputLabel id="rules">Rules</InputLabel>
                        <Select
                           labelId="rules"
                           id="rules"
                           {...register('rules')}
                           multiple
                           value={inputRules}
                           onChange={({ target: { value } }) =>
                              setInputRules(
                                 typeof value === 'string'
                                    ? value.split(',')
                                    : value,
                              )
                           }
                           input={<OutlinedInput label="rules" />}
                           renderValue={selected => selected.join(', ')}
                           MenuProps={{
                              PaperProps: {
                                 style: {
                                    maxHeight: 48 * 4.5 + 8,
                                    width: 250,
                                 },
                              },
                           }}
                        >
                           {rules.map(({ item: { name } }) => (
                              <MenuItem key={name} value={name}>
                                 <input
                                    className="flex fontMedium checkBox mt-1 mr-5"
                                    type="checkbox"
                                    checked={inputRules.indexOf(name) > -1}
                                    onChange={() => {}}
                                 />
                                 <ListItemText primary={name} />
                              </MenuItem>
                           ))}
                        </Select>
                     </FormControl>
                  </section>
                  <section className="flex justify-between">
                     <KernelOptiCheckBox<CreateTaskForm>
                        className="self-end"
                        customState={[inputKernelOpti, setKernelOpti]}
                        {...fieldsProps}
                     />
                     <BreakPointTempField
                        customState={[inputBreakTemp, setBreakTemp]}
                        {...fieldsProps}
                        sx={{ width: 160 }}
                     />
                  </section>
                  <section className="flex justify-between">
                     <CPUOnlyCheckBox<CreateTaskForm>
                        className="self-start"
                        customState={[inputCpuOnly, setCpuOnly]}
                        {...fieldsProps}
                     />
                     <WorkloadProfileField
                        customState={[inputWorkloadProfile, setWorkloadProfile]}
                        {...fieldsProps}
                        sx={{ width: 160 }}
                     />
                  </section>
               </div>
            </div>
         </FrameHoverCardForm>
         {isClickedImport && (
            <BackgroundBlur
               toggleFn={() => setIsClickedImport(!isClickedImport)}
            >
               <ImportList
                  closeImportWindow={closeImportWindow}
                  type="hashlist"
               />
            </BackgroundBlur>
         )}
      </>
   );
}
