import { CircularProgress } from '@mui/material';

import NavBar from '../NavBar/NavBar';

type FrameProps = {
   children: React.ReactNode;
   isLoading?: boolean;
   className?: string | undefined;
};
declare module '@mui/material/styles' {
   interface Theme {
      primary: {
         main: string;
      };
      secondary: {
         main: string;
      };
   }
   interface ThemeOptions {
      primary: {
         main: string;
      };
      secondary: {
         main: string;
      };
   }
}

export default function Frame({ children, isLoading, className }: FrameProps) {
   return (
      <div className={className}>
         <header>
            <NavBar />
         </header>
         <div className="flex justify-center">
            {isLoading ? (
               <CircularProgress className="mt-96" color="secondary" />
            ) : (
               <main className="block max-w-screen-2xl w-full">{children}</main>
            )}
         </div>
      </div>
   );
}

Frame.defaultProps = {
   isLoading: false,
   className: undefined,
};
