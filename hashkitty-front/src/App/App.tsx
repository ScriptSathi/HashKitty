import { ThemeProvider as MUIThemeProvider } from '@mui/material';
import { useContext, useMemo, useState } from 'react';
import AppRoutes from './AppRoutes';
import ColorModeContext from './ColorModeContext';
import ThemeProvider from './ThemeProvider';

export default function App() {
   const {
      theme: { mode: baseMode },
   } = useContext(ColorModeContext);
   const [mode, setMode] = useState<'light' | 'dark'>(baseMode);

   const colorContext = useMemo(
      () => ({
         toggleColorMode: () =>
            setMode(prevMode => (prevMode === 'light' ? 'dark' : 'light')),
         theme: new ThemeProvider(mode),
      }),
      [mode],
   );

   return (
      <ColorModeContext.Provider value={colorContext}>
         <MUIThemeProvider theme={colorContext.theme.muiTheme()}>
            <AppRoutes />
         </MUIThemeProvider>
      </ColorModeContext.Provider>
   );
}
