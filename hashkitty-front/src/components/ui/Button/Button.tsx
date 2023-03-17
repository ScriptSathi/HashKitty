import { Button as TWButton } from '@material-tailwind/react';

import { HTMLAttributes } from 'react';

type ButtonProps = {
   children: React.ReactNode;
   type?: 'submit' | 'button';
} & Omit<HTMLAttributes<HTMLButtonElement>, 'color'>;

export default function Button({
   children = undefined,
   type = 'button',
   ...args
}: ButtonProps) {
   return (
      <TWButton
         variant="filled"
         type={type}
         {...args}
         className={`${args.className} active:bg-[#FC6F6F] active:text-white bg-black rounded-md hover:bg-white hover:text-black border-solid  border-4 border-black active:border-[#FC6F6F]`}
      >
         {children || 'button'}
      </TWButton>
   );
}

Button.defaultProps = {
   type: 'button',
};
