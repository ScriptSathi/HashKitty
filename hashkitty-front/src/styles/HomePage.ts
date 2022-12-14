import { CSSProperties } from 'react';
import '../assets/fonts/Inter-Bold.ttf';
import '../assets/fonts/Inter-Medium.ttf';

export const mainBox: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'minmax(auto, 69%) auto',
    marginTop: 100,
    paddingLeft: 60,
};
export const LeftBox: CSSProperties = {
    border: '1px solid',
    borderLeftStyle: 'none',
    borderTopStyle: 'none',
    borderBottomStyle: 'none',
};
export const RightBox: CSSProperties = {
    display: 'grid',
};
export const runningTasksTitle: CSSProperties = {
    display: 'block',
    fontFamily: 'InterBold',
    fontSize: 24,
    paddingLeft: 50,
    height: 50,
    width: '100%',
};
export const cardBody: CSSProperties = {
    display: 'grid',
    gap: 20,
    gridTemplateColumns: 'minmax(auto, 73%) auto',
};
export const newTask: CSSProperties = {
    height: 310,
    width: 285,
};
