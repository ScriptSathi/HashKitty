import { TextField, TextFieldProps, Tooltip } from '@mui/material';
import { forwardRef, useContext } from 'react';
import ColorModeContext from '../../../App/ColorModeContext';

type TextInputProps = {
   tooltip: string;
} & TextFieldProps;

const TextInput: React.FC<TextInputProps> = forwardRef(
   ({ tooltip, ...props }: TextInputProps, ref) => {
      const {
         theme: { colors },
      } = useContext(ColorModeContext);
      return (
         <Tooltip title={tooltip}>
            <TextField
               sx={{ color: colors.font, backgroundColor: colors.font }}
               {...props}
               ref={ref}
            />
         </Tooltip>
      );
   },
);

TextInput.displayName = 'TextInput';
export default TextInput;
