import { CSSProperties } from 'react';

export const mainStyle: CSSProperties = {
   height: 60,
   padding: 5,
   fontSize: 24,
   display: 'grid',
   gridTemplateColumns: 'minmax(auto, 55%) auto',
};
export const leftBlock: CSSProperties = {
   display: 'grid',
   gap: 0,
   gridTemplateColumns: 'minmax(auto, 7%) 10%',
   gridAutoFlow: 'column',
};

export const logoStyle: CSSProperties = {
   width: 50,
};

export const hashKitty: CSSProperties = {
   height: 50,
   display: 'inline-block',
};

export const hashKittyText: CSSProperties = {
   paddingTop: 17,
   margin: 0,
};

export const rightBlock: CSSProperties = {
   display: 'grid',
   gridAutoFlow: 'column',
   margin: 0,
   paddingTop: 17,
   gap: 20,
};
