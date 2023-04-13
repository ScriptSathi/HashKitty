import { Path, PathValue } from 'react-hook-form';
import { TextField, type SxProps, type Theme } from '@mui/material';
import type {
   CreateTemplateForm,
   FieldProps,
   TUseState,
} from '../../types/TComponents';

type MaskQueryFieldProps<Form extends CreateTemplateForm> = {
   customState?: TUseState<string>;
   sx?: SxProps<Theme> | undefined;
} & FieldProps<Form>;

function MaskQueryField<Form extends CreateTemplateForm>({
   register,
   errors,
   setValue,
   customState,
   sx,
}: MaskQueryFieldProps<Form>) {
   const [input, setInput] = customState ?? [undefined, () => {}];
   const fieldName = 'maskQuery' as Path<Form>;
   return (
      <TextField
         {...register(fieldName, {
            pattern: {
               value: /^[\w?]*$/gi,
               message: 'Invalid pattern',
            },
            maxLength: {
               value: 30,
               message: `Too long, must be less than 30 characters`,
            },
         })}
         error={!!errors.maskQuery && !!errors.maskQuery.message}
         label="Mask query *"
         helperText={errors.maskQuery?.message as string}
         sx={sx}
         value={input}
         onChange={({ target: { value } }) => {
            setInput(value);
            setValue(fieldName, (value as PathValue<Form, Path<Form>>) ?? '');
         }}
      />
   );
}

MaskQueryField.defaultProps = {
   customState: [undefined, () => {}],
   sx: undefined,
};

export default MaskQueryField;
