import { createContext } from 'react';
import ThemeProvider from './ThemeProvider';

const ColorModeContext = createContext({
   toggleColorMode: () => {},
   theme: new ThemeProvider(),
});

export default ColorModeContext;
