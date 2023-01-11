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
    zIndex: 2,
    top: 50,
    border: '1px solid',
    borderRadius: '12px',
    fontSize: 16,
    fontFamily: 'InterMedium',
    overflowY: 'scroll',
};

export const inputDatalists: CSSProperties = {
    fontSize: 16,
    marginTop: 10,
    width: '300px',
};

export const inputs: CSSProperties = {
    border: '3px solid',
    borderRadius: '10px',
    height: '25px',
    fontSize: 16,
    fontFamily: 'InterMedium',
    paddingLeft: 8,
};
