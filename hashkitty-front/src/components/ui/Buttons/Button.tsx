import {
   type SxProps,
   type Theme,
   Tooltip,
   Button as TWButton,
} from '@mui/material';

import { HTMLAttributes, useContext } from 'react';
import ColorModeContext from '../../../App/ColorModeContext';

type ButtonProps = {
   children: React.ReactNode;
   sx?: SxProps<Theme>;
   fontSize?: number;
   type?: 'submit' | 'button';
   sizeBorder?: 'small' | 'medium' | 'large';
   size?: 'small' | 'medium' | 'large';
   tooltip?: string;
} & Omit<HTMLAttributes<HTMLButtonElement>, 'color'>;

export default function Button({
   children = undefined,
   type = 'button',
   size,
   sizeBorder,
   tooltip,
   fontSize,
   sx,
   ...args
}: ButtonProps) {
   const {
      theme: { colors },
   } = useContext(ColorModeContext);
   return (
      <Tooltip title={tooltip}>
         <TWButton
            variant="contained"
            type={type}
            {...args}
            sx={{
               backgroundColor: colors.opposite,
               border: `solid ${sizeBorder === 'large' ? '4' : '3'}px ${
                  colors.opposite
               }`,
               fontFamily: 'inherit',
               fontWeight: 'bold',
               boxShadow: 'unset',
               fontSize,
               color: colors.fontOpposite,
               paddingX: 1,
               paddingY: 1,
               '&:hover': {
                  border: `solid ${sizeBorder === 'large' ? '4' : '3'}px ${
                     colors.opposite
                  }`,
                  color: colors.font,
                  backgroundColor: colors.main,
               },
               '&:active': {
                  backgroundColor: colors.intermediate1,
                  border: `solid ${sizeBorder === 'large' ? '4' : '3'}px ${
                     colors.intermediate1
                  }`,
                  color: '#FFFFFF',
               },
               ...sx,
            }}
            size={size}
            className={`${args.className} flex uppercase items-center justify-center rounded-md`}
         >
            {children || 'button'}
         </TWButton>
      </Tooltip>
   );
}

Button.defaultProps = {
   type: 'button',
   size: 'large',
   sizeBorder: 'large',
   tooltip: '',
   fontSize: 15,
   sx: {},
};
