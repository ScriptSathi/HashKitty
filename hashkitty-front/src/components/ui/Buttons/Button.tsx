import { Button as TWButton, Tooltip } from '@material-tailwind/react';

import { HTMLAttributes } from 'react';

type ButtonProps = {
   children: React.ReactNode;
   type?: 'submit' | 'button';
   size?: 'sm' | 'md' | 'lg';
   tooltip?: string;
} & Omit<HTMLAttributes<HTMLButtonElement>, 'color'>;

export default function Button({
   children = undefined,
   type = 'button',
   size,
   tooltip,
   ...args
}: ButtonProps) {
   return (
      <Tooltip title={tooltip}>
         <TWButton
            variant="filled"
            type={type}
            size={size}
            {...args}
            className={`${args.className} flex items-center justify-center active:bg-[#FC6F6F] active:text-white bg-black rounded-md hover:bg-white hover:text-black border-solid  border-4 border-black active:border-[#FC6F6F]`}
         >
            {children || 'button'}
         </TWButton>
      </Tooltip>
   );
}

Button.defaultProps = {
   type: 'button',
   size: 'md',
   tooltip: '',
};
