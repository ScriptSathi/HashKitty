import { CSSProperties } from 'react';

export const cardBodyGeneric: CSSProperties = {
    height: 309,
    width: 445,
    border: '2px solid',
    borderRadius: '8%',
};

export const topPart: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '2.5fr 1fr',
    gridColumnGap: '0px',
    gridRowGap: '0px',
    gridArea: '1 / 1 / 2 / 6',
    gap: 0,
    margin: 0,
    padding: 0,
};

export const taskName: CSSProperties = {
    // display: 'grid',
    fontFamily: 'InterBold',
    fontSize: 24,
    marginBottom: 0,
};

export const moreDetails: CSSProperties = {
    margin: 0,
    paddingTop: 10,
    textAlign: 'left',
    gridArea: '1 / 2 / 2 / 3',
};

export const topLeftPart: CSSProperties = {
    gridArea: '1 / 1 / 2 / 2',
    paddingLeft: 40,
};

export const taskSoftInfos: CSSProperties = {
    color: '#606060',
    marginTop: 0,
    fontFamily: 'InterMedium',
    fontWeight: 500,
    fontSize: '16',
    lineHeight: '19.5px',
};

export const bottomBox: CSSProperties = {
    paddingLeft: 40,
    gridArea: '2 / 1 / 3 / 6',
    display: 'grid',
    gridTemplateColumns: '2.5fr 1fr',
};

export const runButton: CSSProperties = {
    marginTop: 40,
    paddingLeft: 10,
};

export const bottomBoxText: CSSProperties = {
    fontFamily: 'InterMedium',
    fontSize: '20px',
    fontWeight: 500,
    lineHeight: '30px',
};

export const shadow: CSSProperties = {
    // marginLeft: '10%',
    // marginTop: '-3%',
    // // position: 'relative',
    // // justifyContent: 'center',
    // // alignItems: 'center',
    // // backgroundColor: 'blue',
    // boxShadow: '0px 18px 0px -5px #000000',
    // height: '10%',
    // width: '80%',
    // borderRadius: '20px',
};
