import { Path, PathValue } from 'react-hook-form';
import { InputAdornment, type SxProps, type Theme } from '@mui/material';
import type {
   CreateTemplateForm,
   FieldProps,
   TUseState,
} from '../../types/TComponents';
import TextInput from '../ui/Inputs/TextInput';

type BreakPointTempFieldProps<Form extends CreateTemplateForm> = {
   customState?: TUseState<string | null>;
   sx?: SxProps<Theme> | undefined;
} & FieldProps<Form>;

function BreakPointTempField<Form extends CreateTemplateForm>({
   register,
   errors,
   setValue,
   customState,
   sx,
}: BreakPointTempFieldProps<Form>) {
   const [inputBreakTemp, setBreakTemp] = customState ?? [undefined, () => {}];
   const fieldName = 'breakpointGPUTemperature' as Path<Form>;
   return (
      <TextInput
         tooltip=""
         sx={sx}
         type="number"
         {...register(fieldName, {
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
            !!errors.breakpointGPUTemperature.message
         }
         value={inputBreakTemp}
         label="Breakpoint temperature"
         helperText={errors.breakpointGPUTemperature?.message as string}
         InputProps={{
            endAdornment: <InputAdornment position="start">°C</InputAdornment>,
         }}
         onChange={e => {
            const {
               target: { value },
            } = e;
            setBreakTemp(value);
            setValue(fieldName, value as PathValue<Form, Path<Form>>);
         }}
      />
   );
}

BreakPointTempField.defaultProps = {
   customState: [undefined, () => {}],
   sx: undefined,
};

export default BreakPointTempField;
