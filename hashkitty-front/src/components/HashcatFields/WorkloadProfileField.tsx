import { Path, PathValue } from 'react-hook-form';
import type { SxProps, Theme } from '@mui/material';
import type {
   CreateTemplateForm,
   FieldProps,
   TUseState,
} from '../../types/TComponents';
import TextInput from '../ui/Inputs/TextInput';

type WorkloadProfileFieldProps<Form extends CreateTemplateForm> = {
   customState?: TUseState<string | null>;
   sx?: SxProps<Theme> | undefined;
} & FieldProps<Form>;

function WorkloadProfileField<Form extends CreateTemplateForm>({
   register,
   errors,
   setValue,
   customState,
   sx,
}: WorkloadProfileFieldProps<Form>) {
   const [input, setInput] = customState ?? [undefined, () => {}];
   const fieldName = 'workloadProfile' as Path<Form>;
   return (
      <TextInput
         tooltip=""
         type="number"
         sx={sx}
         {...register(fieldName, {
            max: {
               value: 4,
               message: 'No faster mode (between 0 to 4)',
            },
            min: {
               value: 0,
               message: 'It`s already super slow ! (between 0 to 4)',
            },
         })}
         error={!!errors.workloadProfile && !!errors.workloadProfile.message}
         label="Workload profile"
         value={input}
         helperText={errors.workloadProfile?.message as string}
         onChange={e => {
            const {
               target: { value },
            } = e;
            setInput(value);
            setValue(fieldName, value as PathValue<Form, Path<Form>>);
         }}
      />
   );
}

WorkloadProfileField.defaultProps = {
   customState: [undefined, () => {}],
   sx: undefined,
};

export default WorkloadProfileField;
