import { Theme, ThemeOptions, createTheme } from '@mui/material';
import ThemeColors, { ThemeColorsAvailable } from './ThemeColors';

export default class ThemeProvider {
   public static getUserSystemTheme(): 'light' | 'dark' {
      const isDarkTheme = window.matchMedia(
         '(prefers-color-scheme: dark)',
      ).matches;
      if (isDarkTheme) {
         return 'dark';
      }
      return 'light';
   }

   public mode: 'light' | 'dark';
   public theme: ThemeColorsAvailable;

   constructor(mode?: 'light' | 'dark') {
      this.mode = mode || ThemeProvider.getUserSystemTheme();
      this.theme = new ThemeColors()[this.mode];
   }

   public get isDarkTheme() {
      return this.mode === 'dark';
   }

   public get isLightTheme() {
      return this.mode === 'light';
   }

   public muiTheme(): Theme {
      return createTheme({
         palette: {
            primary: {
               main: this.theme.main,
            },
            secondary: {
               main: this.theme.intermediate1,
            },
         },
         components: {
            MuiSwitch: {
               styleOverrides: {
                  track: {
                     backgroundColor: 'black',
                  },
                  root: {
                     '& .MuiSwitch-colorSecondary': {
                        color: 'black',
                     },
                  },
               },
            },
            MuiAutocomplete: {
               styleOverrides: {
                  option: {
                     '&:hover': {
                        color: 'white',
                        backgroundColor: `${this.theme.intermediate1} !important`,
                     },
                  },
               },
            },
         },
      } as ThemeOptions);
   }
}
