import { Button as TWButton } from '@material-tailwind/react';

import { HTMLAttributes } from 'react';

type ButtonProps = {
   children: React.ReactNode;
   type?: 'submit' | 'button';
   size?: 'sm' | 'md' | 'lg';
} & Omit<HTMLAttributes<HTMLButtonElement>, 'color'>;

export default function Button({
   children = undefined,
   type = 'button',
   size,
   ...args
}: ButtonProps) {
   return (
      <TWButton
         variant="filled"
         type={type}
         size={size}
         {...args}
         className={`${args.className} active:bg-[#FC6F6F] active:text-white bg-black rounded-md hover:bg-white hover:text-black border-solid  border-4 border-black active:border-[#FC6F6F]`}
      >
         {children || 'button'}
      </TWButton>
   );
}

Button.defaultProps = {
   type: 'button',
   size: 'md',
};
