export type ThemeColorsAvailable = {
   main: string;
   secondary: string;
   opposite: string;
   font: string;
   fontOpposite: string;
   fontAlternative: string;
   intermediate1: string;
   intermediate2: string;
   boxShadow: string;
   alerts: {
      error: string;
      warning: string;
      info: string;
      success: string;
   };
};

export default class ThemeColors {
   public light: ThemeColorsAvailable = {
      main: '#FFFFFF',
      secondary: '#FFFFFF',
      opposite: '#000000',
      font: '#000000',
      fontOpposite: '#FFFFFF',
      fontAlternative: 'grey',
      intermediate1: '#FC6F6F',
      intermediate2: '',
      boxShadow: 'rgba(0,0,0,0.15)',
      alerts: {
         error: '',
         warning: '',
         info: '',
         success: '',
      },
   };

   public dark: ThemeColorsAvailable = {
      main: '#020a1a',
      secondary: '#0C182F',
      opposite: '#FFFFFF',
      font: '#FFFFFF',
      fontOpposite: '#020a1a',
      fontAlternative: '#a6afc1',
      intermediate1: '#FC6F6F',
      intermediate2: '#3d4c69',
      boxShadow: 'rgba(166,175,193,0.2)',
      alerts: {
         error: 'rgb(108, 25, 25)',
         warning: 'rgb(108, 83, 25)',
         info: 'rgb(17, 74, 98)',
         success: 'rgb(37, 96, 45)',
      },
   };
}
