import { CSSProperties } from 'react';
import '../assets/fonts/Inter-Bold.ttf';
import '../assets/fonts/Inter-Medium.ttf';

export const mainBox: CSSProperties = {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    display: 'grid',
    gridTemplateColumns: 'minmax(auto, 69%) auto',
    marginTop: 100,
    paddingLeft: 60,
};
export const LeftBox: CSSProperties = {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    border: '1px solid',
    borderLeftStyle: 'none',
    borderTopStyle: 'none',
    borderBottomStyle: 'none',
};
export const RightBox: CSSProperties = {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    display: 'grid',
};
export const runningTasksTitle: CSSProperties = {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    display: 'block',
    fontFamily: 'InterBold',
    fontSize: 24,
    paddingLeft: 50,
    height: 50,
    width: '100%',
};
export const cardBody: CSSProperties = {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    display: 'grid',
    gap: 20,
    gridTemplateColumns: 'minmax(auto, 73%) auto',
};
export const newTask: CSSProperties = {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    height: 310,
    width: 285,
};
