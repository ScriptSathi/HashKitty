import {
   Autocomplete,
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
import Button from '../ui/Button/Button';
import CreateTaskErrorHandler from '../../utils/CreateTaskErrorHandler';
import useFetchAllList from '../../hooks/useFetchAllLists';
import FormatList from '../../utils/FormatUtils';
import { CreateTaskForm } from '../../types/TComponents';
import Template from './Template';
import CreateFrame from './CreateFrame';
import createTaskDefaultValues from './createTaskDefaultValues';
import Radios from '../ui/Radios/Radios';
import { TAttackMode } from '../../types/TypesORM';
import CheckBox from '../ui/Inputs/CheckBox';
import ApiEndpoints from '../../ApiEndpoints';
import useSendForm from '../../hooks/useSendForm';
import { TaskUpdate } from '../../types/TApi';

type CreateTaskProps = {
   closeTaskCreation: () => void;
};

export default function CreateTask({ closeTaskCreation }: CreateTaskProps) {
   const [inputWordlist, setInputWordlist] = useState<string | null>(null);
   const [inputPotfile, setInputPotfile] = useState<string | null>(null);
   const [inputHashlist, setInputHashlist] = useState<string | null>(null);
   const [inputRules, setInputRules] = useState<string[]>([]);
   const [inputAttackMode, setAttackMode] = useState<string | null>('');
   const [inputBreakTemp, setBreakTemp] = useState<number | null>(90);
   const [inputCpuOnly, setCpuOnly] = useState<boolean>(false);
   const [inputKernelOpti, setKernelOpti] = useState<boolean>(false);
   const [inputWorkloadProfile, setWorkloadProfile] = useState<number | null>(
      3,
   );

   const { sendForm, isLoading: isLoadingCreation } = useSendForm<TaskUpdate>({
      url: ApiEndpoints.apiPOSTCreateTask,
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
   } = useFetchAllList();

   const onSubmit = (form: CreateTaskForm) => {
      const formVerifier = new CreateTaskErrorHandler(setError, {
         attackModes,
         templates,
         hashlists,
         wordlists,
         rules,
         potfiles,
      });
      formVerifier.analyse(form);

      if (!formVerifier.hasErrors) {
         sendForm(formVerifier.finalForm);
         closeTaskCreation();
      }
   };

   if (isLoading || isLoadingCreation) {
      return (
         <CreateFrame
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
         </CreateFrame>
      );
   }
   return (
      <CreateFrame
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
               <Autocomplete<string>
                  disablePortal
                  options={FormatList.standard(hashlists)}
                  sx={{ width: 300 }}
                  renderInput={params => (
                     <TextField
                        {...params}
                        label="Hash lists *"
                        error={
                           errors.hashlistName !== undefined &&
                           errors.hashlistName.message !== undefined
                        }
                        helperText={errors.hashlistName?.message}
                     />
                  )}
                  isOptionEqualToValue={(option, value) =>
                     option === value || value === null
                  }
                  value={inputHashlist}
                  {...register('hashlistName')}
                  onChange={(_, value) => {
                     setInputHashlist(value);
                     setValue('hashlistName', value || '');
                  }}
               />
            </section>
            <section className="">
               <Template
                  list={templates}
                  register={register}
                  control={control}
                  inputWordlist={['wordlistName', setInputWordlist]}
                  inputPotfile={['potfileName', setInputPotfile]}
                  inputAttackMode={['attackModeId', setAttackMode]}
                  inputBreakTemp={['breakpointGPUTemperature', setBreakTemp]}
                  inputWorkloadProfile={['workloadProfile', setWorkloadProfile]}
                  inputKernelOpti={['kernelOpti', setKernelOpti]}
                  inputCpuOnly={['cpuOnly', setCpuOnly]}
               />
            </section>
         </div>
         <div className="mt-[5rem]">
            <h3 className="text-lg mb-[2rem]">Advanced configurations</h3>
            <div className="flex justify-between flex-wrap gap-2">
               <section className="flex flex-col gap-2 justify-between">
                  <Autocomplete<string>
                     disablePortal
                     required
                     options={FormatList.standard(wordlists)}
                     sx={{ maxWidth: 300 }}
                     renderInput={params => (
                        <TextField
                           error={
                              errors.wordlistName !== undefined &&
                              errors.wordlistName.message !== undefined
                           }
                           helperText={errors.wordlistName?.message}
                           {...params}
                           label="Wordlists"
                        />
                     )}
                     isOptionEqualToValue={(option, value) =>
                        option === value || value === null
                     }
                     value={inputWordlist}
                     {...register('wordlistName')}
                     onChange={(_, value) => {
                        setInputWordlist(value);
                        setValue('wordlistName', value || '');
                     }}
                  />
                  <FormControl sx={{ maxWidth: 300 }}>
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
                        {rules.map(({ name }) => (
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
                  <Autocomplete<string>
                     disablePortal
                     required
                     options={FormatList.standard(potfiles)}
                     sx={{ width: 300 }}
                     renderInput={params => (
                        <TextField
                           {...params}
                           label="Potfiles"
                           error={
                              errors.potfileName !== undefined &&
                              errors.potfileName.message !== undefined
                           }
                           helperText={errors.potfileName?.message}
                        />
                     )}
                     isOptionEqualToValue={(option, value) =>
                        option === value || value === null
                     }
                     value={inputPotfile}
                     {...register('potfileName')}
                     onChange={(_, value) => {
                        setInputPotfile(value);
                        setValue('potfileName', value || '');
                     }}
                  />
               </section>
               <section>
                  <Radios<TAttackMode, CreateTaskForm>
                     name="Attack modes"
                     fieldName="attackModeId"
                     list={FormatList.attackMode(attackModes)}
                     register={register}
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
                  <TextField
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
                           <InputAdornment position="start">°C</InputAdornment>
                        ),
                     }}
                     onChange={e => {
                        const {
                           target: { value },
                        } = e;
                        setBreakTemp(parseInt(value, 10) || 0);
                        setValue(
                           'breakpointGPUTemperature',
                           parseInt(value, 10) || 0,
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
                  <TextField
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
                        setWorkloadProfile(parseInt(value, 10) || 0);
                        setValue('workloadProfile', parseInt(value, 10) || 0);
                     }}
                  />
               </section>
            </div>
         </div>
      </CreateFrame>
   );
}
