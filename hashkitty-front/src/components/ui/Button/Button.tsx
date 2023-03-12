import { Button as TWButton } from '@material-tailwind/react';

import { HTMLAttributes } from 'react';

type ButtonProps = {
   children: React.ReactNode;
} & Omit<HTMLAttributes<HTMLButtonElement>, 'color'>;

export default function Button({ children = undefined, ...args }: ButtonProps) {
   return (
      <TWButton
         className={`min-w-full border-solid border-4 border-orange-600 hover:bg-orange-600 hover:text-white rounded-lg ${args.className}`}
         {...args}
      >
         {children || 'button'}
      </TWButton>
   );
}
