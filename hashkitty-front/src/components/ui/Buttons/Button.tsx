import { type SxProps, type Theme, Tooltip, Button as TWButton } from '@mui/material';

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
            variant='contained'
            type={type}
            {...args}
            sx={{
               backgroundColor: 'black',
               border: 'solid 4px black',
               fontSize: fontSize,
               color: 'white',
               '&:hover': {
                  border: 'solid 4px black',
               },
               '&:active': {
                  border: 'solid 4px #FC6F6F',
               },
               ...sx
            }}
            size={size}
            className={`${args.className} flex items-center justify-center active:bg-[#FC6F6F] active:text-white rounded-md hover:bg-white hover:text-black border-solid`}
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
