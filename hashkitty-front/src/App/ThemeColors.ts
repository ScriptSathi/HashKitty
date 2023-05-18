export type ThemeColorsAvailable = {
   main: string;
   opposite: string;
   font: string;
   fontAlternative: string;
   intermediate1: string;
   intermediate2: string;
};

export default class ThemeColors {
   public light: ThemeColorsAvailable = {
      main: '#FFFFF',
      opposite: '#00000',
      font: '',
      fontAlternative: '',
      intermediate1: '#FC6F6F',
      intermediate2: '',
   };

   public dark: ThemeColorsAvailable = {
      main: '#00000',
      opposite: '#FFFFF',
      font: '',
      fontAlternative: '',
      intermediate1: '#FC6F6F',
      intermediate2: '',
   };
}
