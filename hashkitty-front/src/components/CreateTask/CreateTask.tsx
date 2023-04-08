import {
   TextField,
   Select,
   MenuItem,
   ListItemText,
   OutlinedInput,
   InputLabel,
   FormControl,
   InputAdornment,
   CircularProgress,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import Button from '../ui/Buttons/Button';
import CreateTaskOrTemplateErrorHandler from '../../utils/CreateTaskOrTemplateErrorHandler';
import useFetchAllList from '../../hooks/useFetchAllLists';
import FormatList from '../../utils/FormatUtils';
import { CreateTaskForm } from '../../types/TComponents';
import TemplateRadio from './TemplateRadio';
import createTaskDefaultValues from './createTaskDefaultValues';
import Radios from '../ui/Radios/Radios';
import { TAttackMode } from '../../types/TypesORM';
import CheckBox from '../ui/Inputs/CheckBox';
import ApiEndpoints from '../../ApiEndpoints';
import useSendForm from '../../hooks/useSendForm';
import { TaskUpdate } from '../../types/TApi';
import BackgroundBlur from '../ui/BackgroundBlur/BackGroundBlur';
import ImportList from '../ImportList/ImportList';
import useScreenSize from '../../hooks/useScreenSize';
import InputDropdown from '../ui/Inputs/InputDropdown';
import TextInput from '../ui/Inputs/TextInput';
import FrameHoverCardForm from '../ui/Cards/FrameHoverCard/FrameHoverCardForm';
import { CreateTaskErrors } from '../../types/TypesErrorHandler';

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
   const [inputAttackMode, setAttackMode] = useState<string | null>('');
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

   const isCombinatorAttack =
      attackModes.find(e => e.id.toString() === inputAttackMode)?.mode === 1;

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
      formVerifier.analyseTask(form);
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
                     error={
                        errors.name !== undefined &&
                        errors.name.message !== undefined
                     }
                     label="Name *"
                     helperText={errors.name?.message}
                     sx={{ marginTop: 0.5 }}
                  />
                  <div>
                     <Button
                        size="sm"
                        className="mb-3 text-xs text-center h-[30px] py-1"
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
                  />
               </section>
            </div>
            <div className="mt-[5rem]">
               <h3 className="text-lg mb-[2rem]">Advanced configurations</h3>
               <div className="flex justify-between flex-wrap gap-2">
                  <section className="flex flex-col gap-2 justify-between">
                     <InputDropdown<string, CreateTaskForm>
                        register={register}
                        options={FormatList.standard(wordlists)}
                        errors={errors}
                        formName="wordlistName"
                        label="Wordlists"
                        value={inputWordlist}
                        onChange={(_, value) => {
                           setInputWordlist(value as string);
                           setValue('wordlistName', (value as string) ?? '');
                        }}
                        isOptionEqualToValue={(option, value) =>
                           option === value || value === null
                        }
                     />
                     {isCombinatorAttack && (
                        <InputDropdown<string, CreateTaskForm>
                           register={register}
                           options={FormatList.standard(wordlists)}
                           errors={errors}
                           formName="combinatorWordlistName"
                           label="Right wordlist *"
                           value={inputCombinatorWordlist}
                           onChange={(_, value) => {
                              setCombinatorWordlist(value as string);
                              setValue(
                                 'combinatorWordlistName',
                                 (value as string) ?? '',
                              );
                           }}
                           isOptionEqualToValue={(option, value) =>
                              option === value || value === null || value === ''
                           }
                        />
                     )}
                     <TextField
                        {...register('maskQuery', {
                           pattern: {
                              value: /^[\w?]*$/gi,
                              message: 'Invalid pattern',
                           },
                        })}
                        error={
                           errors.maskQuery !== undefined &&
                           errors.maskQuery.message !== undefined
                        }
                        label="Mask query"
                        helperText={errors.maskQuery?.message}
                        sx={{ marginTop: 0.5 }}
                        value={inputMaskQuery}
                        onChange={({ target: { value } }) => {
                           setInputMaskQuery(value);
                           setValue('maskQuery', value ?? '');
                        }}
                     />
                  </section>
                  <section>
                     <Radios<TAttackMode, CreateTaskForm>
                        name="Attack modes"
                        fieldName="attackModeId"
                        list={FormatList.attackMode(attackModes)}
                        register={register}
                        errors={errors}
                        checkValidation={elem =>
                           elem.id.toString() === inputAttackMode
                        }
                        onChangeElem={({ elem }) =>
                           setAttackMode(elem.id.toString())
                        }
                     />
                  </section>
               </div>
               <div className="flex flex-wrap mt-10 flex-col gap-y-3">
                  <section className="flex flex-wrap gap-2 justify-between">
                     <InputDropdown<string, CreateTaskForm>
                        register={register}
                        options={FormatList.standard(potfiles)}
                        errors={errors}
                        formName="potfileName"
                        label="Potfiles"
                        value={inputPotfile}
                        onChange={(_, value) => {
                           setInputPotfile(value as string);
                           setValue('potfileName', (value as string) ?? '');
                        }}
                        isOptionEqualToValue={(option, value) =>
                           option === value || value === null
                        }
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
                     <CheckBox<CreateTaskForm>
                        className="self-end"
                        title="Kernel optimization"
                        name="kernelOpti"
                        register={register}
                        checked={inputKernelOpti}
                        onClick={() => {
                           setValue('kernelOpti', !inputKernelOpti);
                           setKernelOpti(!inputKernelOpti);
                        }}
                     />
                     <TextInput
                        tooltip=""
                        sx={{ width: 160 }}
                        type="number"
                        {...register('breakpointGPUTemperature', {
                           max: {
                              value: 100,
                              message: 'Must be less than 100°C',
                           },
                           min: {
                              value: 20,
                              message: 'Cold but gold !',
                           },
                        })}
                        error={
                           errors.breakpointGPUTemperature !== undefined &&
                           errors.breakpointGPUTemperature.message !== undefined
                        }
                        value={inputBreakTemp}
                        label="Breakpoint temperature"
                        helperText={errors.breakpointGPUTemperature?.message}
                        InputProps={{
                           endAdornment: (
                              <InputAdornment position="start">
                                 °C
                              </InputAdornment>
                           ),
                        }}
                        onChange={e => {
                           const {
                              target: { value },
                           } = e;
                           setBreakTemp(value);
                           setValue(
                              'breakpointGPUTemperature',
                              value as string,
                           );
                        }}
                     />
                  </section>
                  <section className="flex justify-between">
                     <CheckBox<CreateTaskForm>
                        className="self-start"
                        title="CPU Only"
                        register={register}
                        name="cpuOnly"
                        checked={inputCpuOnly}
                        onClick={() => {
                           setValue('cpuOnly', !inputCpuOnly);
                           setCpuOnly(!inputCpuOnly);
                        }}
                     />
                     <TextInput
                        tooltip=""
                        type="number"
                        sx={{ width: 160 }}
                        {...register('workloadProfile', {
                           max: {
                              value: 4,
                              message: 'No faster mode (between 0 to 4)',
                           },
                           min: {
                              value: 0,
                              message:
                                 'It`s already super slow ! (between 0 to 4)',
                           },
                        })}
                        error={
                           errors.workloadProfile !== undefined &&
                           errors.workloadProfile.message !== undefined
                        }
                        label="Workload profile"
                        value={inputWorkloadProfile}
                        helperText={errors.workloadProfile?.message}
                        onChange={e => {
                           const {
                              target: { value },
                           } = e;
                           setWorkloadProfile(value);
                           setValue('workloadProfile', value as string);
                        }}
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
