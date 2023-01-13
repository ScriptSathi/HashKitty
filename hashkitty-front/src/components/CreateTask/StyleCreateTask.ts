import { CSSProperties } from 'react';

export const inputs: CSSProperties = {
    border: '3px solid',
    borderRadius: '10px',
    height: '25px',
    fontSize: 16,
    fontFamily: 'InterMedium',
    paddingLeft: 8,
};

export const inputName: CSSProperties = {
    width: '300px',
    marginTop: 10,
    marginBottom: 10,
    display: 'block',
};

export const cardBody: CSSProperties = {
    backgroundColor: 'white',
    position: 'absolute',
    top: '10%',
    left: '27.5%',
    width: 800,
    border: '2px solid',
    borderRadius: '50px',
};

export const contentBody: CSSProperties = {
    margin: '5% 7.5%',
    height: '80%',
    width: '90%',
};

export const title: CSSProperties = {
    fontFamily: 'InterBold',
    fontSize: 24,
};

export const formBody: CSSProperties = {
    fontFamily: 'InterMedium',
    fontSize: 20,
    display: 'grid',
    gridTemplateRows: 'auto',
    width: '100%',
    height: 0,
};

export const mandatoryBody: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1.2fr 1fr',
};

export const labels: CSSProperties = {
    marginBottom: 0,
};

export const submitInput: CSSProperties = {
    padding: '0 10px',
    height: '30px',
    position: 'absolute',
    bottom: '50px',
    right: '10%',
};

export const divCheckbox: CSSProperties = {
    marginTop: 10,
    overflowY: 'scroll',
    maxHeight: 180,
    maxWidth: '100%',
    display: 'grid',
};

export const divRadio: CSSProperties = {
    marginTop: 5,
    overflowY: 'scroll',
    maxHeight: 120,
    maxWidth: '100%',
    display: 'grid',
};

export const advancedConfigs: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'minmax(auto, 10%) auto',
    width: 160,
    marginTop: 20,
};

export const advancedConfigsImg: CSSProperties = {
    width: 10,
    height: 10,
    marginTop: 20,
    marginRight: 5,
};

export const advancedConfigsTxt: CSSProperties = {
    fontSize: 16,
    fontFamily: 'InterMedium',
};

export const inputCheckboxes: CSSProperties = { marginTop: 5, marginRight: 5 };

export const advancedConfigsDivMain: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'minmax(auto, 50%) auto',
    height: 'max-content',
    width: '100%',
};

export const advancedConfigsDivLeft: CSSProperties = {};
