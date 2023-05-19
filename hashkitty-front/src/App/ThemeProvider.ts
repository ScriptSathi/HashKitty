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
   public colors: ThemeColorsAvailable;

   constructor(mode?: 'light' | 'dark') {
      this.mode = mode || ThemeProvider.getUserSystemTheme();
      this.colors = new ThemeColors()[this.mode];
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
            mode: this.mode,
            primary: {
               main: this.colors.main,
            },
            secondary: {
               main: this.colors.intermediate1,
            },
         },
         components: {
            MuiSwitch: {
               styleOverrides: {
                  track: {
                     backgroundColor: this.colors.opposite,
                  },
                  root: {
                     '& .MuiSwitch-colorSecondary': {
                        color: this.colors.opposite,
                     },
                  },
               },
            },
            MuiAutocomplete: {
               styleOverrides: {
                  option: {
                     '&:hover': {
                        color: this.colors.font,
                        backgroundColor: `${this.colors.intermediate1} !important`,
                     },
                  },
               },
            },
            MuiPaper: {
               styleOverrides: {
                  root: {
                     boxShadow:
                        `0px 3px 1px -2px ${this.colors.boxShadow},` +
                        `0px 2px 2px 0px ${this.colors.boxShadow},` +
                        `0px 1px 5px 0px ${this.colors.boxShadow}`,
                  },
               },
            },
            MuiTextField: {
               styleOverrides: {
                  root: {
                     '& .MuiInputLabel-root': {
                        color: this.colors.font,
                        '&.Mui-focused': {
                           color: this.colors.font,
                        },
                     },
                     '& .MuiOutlinedInput-notchedOutline': {
                        border: `1px solid ${this.colors.fontAlternative}`,
                     },
                     '& .MuiOutlinedInput-root': {
                        backgroundColor: `${this.colors.secondary} !important`,
                        color: this.colors.font,
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                           border: `1px solid ${this.colors.fontAlternative}`,
                        },
                        '&.Mui-focused': {
                           color: this.colors.font,
                           '&:hover .MuiOutlinedInput-notchedOutline': {
                              border: `2px solid ${this.colors.font}`,
                           },
                           '& > fieldset': {
                              borderColor: this.colors.font,
                              '&:hover': {
                                 border: `1px solid ${this.colors.fontAlternative}`,
                              },
                           },
                        },
                     },
                  },
               },
            },
         },
      } as ThemeOptions);
   }
}
