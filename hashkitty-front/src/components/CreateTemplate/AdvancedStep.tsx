import type {
   FieldErrors,
   Path,
   PathValue,
   UseFormRegister,
   UseFormSetValue,
} from 'react-hook-form';

import { InputAdornment } from '@mui/material';
import TextInput from '../ui/Inputs/TextInput';
import CheckBox from '../ui/Inputs/CheckBox';
import type { CreateTemplateForm } from '../../types/TComponents';
import type { TDBData } from '../../types/TypesErrorHandler';
import InputDropdown from '../ui/Inputs/InputDropdown';
import FormatList from '../../utils/FormatUtils';

type AdvancedStepProps<Form extends CreateTemplateForm> = {
   register: UseFormRegister<Form>;
   DBData: Omit<TDBData, 'templates' | 'hashtypes'>;
   setValue: UseFormSetValue<Form>;
   errors: FieldErrors<Form>;
};

function AdvancedStep<Form extends CreateTemplateForm = CreateTemplateForm>({
   register,
   errors,
   setValue,
   DBData,
}: AdvancedStepProps<Form>) {
   return (
      <div className="flex flex-wrap mt-10 flex-col gap-y-3">
         <section className="flex flex-wrap gap-2 justify-between">
            <InputDropdown<string, Form>
               register={register}
               options={FormatList.standard(DBData.potfiles)}
               errors={errors}
               formName={'potfileName' as Path<Form>}
               label="Potfiles"
               onChange={(_, value) => {
                  setValue(
                     'potfileName' as Path<Form>,
                     (value ?? '') as PathValue<Form, Path<Form>>,
                  );
               }}
               isOptionEqualToValue={(option, value) =>
                  option === value || value === null
               }
            />
         </section>
         <section className="flex justify-between">
            <CheckBox<Form>
               className="self-end"
               title="Kernel optimization"
               name={'kernelOpti' as Path<Form>}
               register={register}
            />
            <TextInput
               tooltip=""
               sx={{ width: 160 }}
               type="number"
               {...register('breakpointGPUTemperature' as Path<Form>, {
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
                  !!errors.breakpointGPUTemperature &&
                  errors.breakpointGPUTemperature.message !== undefined
               }
               label="Breakpoint temperature"
               helperText={errors.breakpointGPUTemperature?.message as string}
               InputProps={{
                  endAdornment: (
                     <InputAdornment position="start">°C</InputAdornment>
                  ),
               }}
               onChange={e => {
                  const {
                     target: { value },
                  } = e;
                  setValue(
                     'breakpointGPUTemperature' as Path<Form>,
                     value as PathValue<Form, Path<Form>>,
                  );
               }}
            />
         </section>
         <section className="flex justify-between">
            <CheckBox<Form>
               className="self-start"
               title="CPU Only"
               register={register}
               name={'cpuOnly' as Path<Form>}
            />
            <TextInput
               tooltip=""
               type="number"
               sx={{ width: 160 }}
               {...register('workloadProfile' as Path<Form>, {
                  max: {
                     value: 4,
                     message: 'No faster mode (between 0 to 4)',
                  },
                  min: {
                     value: 0,
                     message: 'It`s already super slow ! (between 0 to 4)',
                  },
               })}
               error={
                  !!errors.workloadProfile &&
                  errors.workloadProfile.message !== undefined
               }
               label="Workload profile"
               helperText={errors.workloadProfile?.message as string}
               onChange={e => {
                  const {
                     target: { value },
                  } = e;
                  setValue(
                     'workloadProfile' as Path<Form>,
                     value as PathValue<Form, Path<Form>>,
                  );
               }}
            />
         </section>
      </div>
   );
}

export default AdvancedStep;
