import { CSSProperties } from 'react';

export const frame: CSSProperties = {
    position: 'relative',
    display: 'grid',
};

export const inputText: CSSProperties = {
    fontSize: 18,
    border: 'none',
    paddingLeft: 8,
    height: 30,
};

export const listFrame: CSSProperties = {
    position: 'absolute',
    display: 'grid',
    maxHeight: '200px',
    top: 50,
    border: '1px solid',
    borderRadius: '12px',
    fontSize: 16,
    fontFamily: 'InterMedium',
    overflowY: 'scroll',
};
