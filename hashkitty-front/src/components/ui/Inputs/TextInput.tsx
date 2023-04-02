import { TextField, TextFieldProps, Tooltip } from '@mui/material';
import { forwardRef } from 'react';

type TextInputProps = {
   tooltip: string;
} & TextFieldProps;

const TextInput: React.FC<TextInputProps> = forwardRef(
   ({ tooltip, ...props }: TextInputProps, ref) => {
      return (
         <Tooltip title={tooltip}>
            <TextField {...props} ref={ref} />
         </Tooltip>
      );
   },
);

TextInput.displayName = 'TextInput';
export default TextInput;
