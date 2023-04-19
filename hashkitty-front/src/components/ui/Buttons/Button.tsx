import {
   type SxProps,
   type Theme,
   Tooltip,
   Button as TWButton,
} from '@mui/material';

import { HTMLAttributes } from 'react';

type ButtonProps = {
   children: React.ReactNode;
   sx?: SxProps<Theme>;
   fontSize?: number;
   type?: 'submit' | 'button';
   size?: 'small' | 'medium' | 'large';
   tooltip?: string;
} & Omit<HTMLAttributes<HTMLButtonElement>, 'color'>;

export default function Button({
   children = undefined,
   type = 'button',
   size,
   tooltip,
   fontSize,
   sx,
   ...args
}: ButtonProps) {
   return (
      <Tooltip title={tooltip}>
         <TWButton
            variant="contained"
            type={type}
            {...args}
            sx={{
               backgroundColor: 'black',
               border: 'solid 4px black',
               fontFamily: 'inherit',
               fontWeight: 'bold',
               fontSize,
               color: 'white',
               paddingX: 1,
               paddingY: 0.8,
               '&:hover': {
                  border: 'solid 4px black',
               },
               '&:active': {
                  border: 'solid 4px #FC6F6F',
                  color: 'white',
               },
               ...sx,
            }}
            size={size}
            className={`${args.className} flex uppercase items-center justify-center active:bg-[#FC6F6F] active:text-white rounded-md hover:bg-white hover:text-black border-solid`}
         >
            {children || 'button'}
         </TWButton>
      </Tooltip>
   );
}

Button.defaultProps = {
   type: 'button',
   size: 'large',
   tooltip: '',
   fontSize: 15,
   sx: {},
};
