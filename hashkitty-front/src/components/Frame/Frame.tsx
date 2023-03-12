import { CircularProgress } from '@mui/material';

import NavBar from '../NavBar/NavBar';

type PageBodyProps = {
   children: React.ReactNode;
   isLoading?: boolean;
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

export default function PageBody({ children, isLoading }: PageBodyProps) {
   return (
      <>
         <header>
            <NavBar />
         </header>
         <div className="flex justify-center">
            {isLoading ? (
               <CircularProgress className="mt-96" />
            ) : (
               <main className="block max-w-screen-2xl w-full">{children}</main>
            )}
         </div>
      </>
   );
}

PageBody.defaultProps = {
   isLoading: false,
};
