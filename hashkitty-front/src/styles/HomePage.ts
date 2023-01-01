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
export const runningTasks: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'minmax(auto, 36%) auto',
    gap: '45px 20px',
    marginBottom: 50,
};
export const RightBox: CSSProperties = {
    display: 'block',
    marginLeft: 50,
};
export const tasksTitle: CSSProperties = {
    fontFamily: 'InterBold',
    fontSize: 24,
    paddingLeft: 50,
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

export const creationTaskStatusMessage: CSSProperties = {
    position: 'absolute',
    left: '50%',
    fontSize: 30,
    fontFamily: 'InterMedium',
    transform: 'translate(-50%, 0%)',
};
