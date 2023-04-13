import { Path, PathValue } from 'react-hook-form';
import { TextField, type SxProps, type Theme } from '@mui/material';
import type {
   CreateTemplateForm,
   FieldProps,
   TUseState,
} from '../../types/TComponents';

type MaskQueryFieldProps<Form extends CreateTemplateForm> = {
   customState?: TUseState<string>;
   charsetNumber: 1 | 2 | 3 | 4;
   sx?: SxProps<Theme> | undefined;
} & FieldProps<Form>;

function CustomCharsetField<Form extends CreateTemplateForm>({
   register,
   errors,
   setValue,
   customState,
   charsetNumber,
   sx,
}: MaskQueryFieldProps<Form>) {
   const [input, setInput] = customState ?? [undefined, () => {}];
   const fieldName = `customCharset${charsetNumber}` as Path<Form>;
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
         error={
            !!errors[`customCharset${charsetNumber}`] &&
            !!errors[`customCharset${charsetNumber}`]?.message
         }
         label={`Custom charset ${charsetNumber}`}
         helperText={errors[`customCharset${charsetNumber}`]?.message as string}
         sx={sx}
         value={input}
         onChange={({ target: { value } }) => {
            setInput(value);
            setValue(fieldName, (value as PathValue<Form, Path<Form>>) ?? '');
         }}
      />
   );
}

CustomCharsetField.defaultProps = {
   customState: [undefined, () => {}],
   sx: undefined,
};

export default CustomCharsetField;
