import { makeStyles } from '@mui/styles';
import {
  defaultFont,
  container,
  containerFluid,
  infoColor,
  whiteColor,
  grayColor,
} from '../../../theme/common';

const footerStyle = makeStyles((theme) => {
  return {
    block: {},
    left: {
      float: 'left!important',
      display: 'block',
      marginTop: 0,
      marginRight: 60,
    },
    right: {
      marginRight: 60,
      marginTop: 0,
      fontSize: '14px',
      float: 'right!important',
      padding: '15px',
    },
    footer: {
      bottom: '0',
      borderTop: '1px solid ' + grayColor[15],
      padding: '15px 0',
      width: '100%',
      ...defaultFont,
      // zIndex: 3,
    },
    container: {
      zIndex: 3,
      ...container,
      position: 'relative',
    },
    containerFluid: {
      zIndex: 3,
      ...containerFluid,
      position: 'relative',
    },
    a: {
      color: infoColor[2],
      textDecoration: 'none',
      backgroundColor: 'transparent',
    },
    list: {
      marginBottom: '0',
      padding: '0',
      marginTop: '0',
    },
    inlineBlock: {
      display: 'inline-block',
      paddingTop: 10,
      width: 'auto',
    },
    whiteColor: {
      '&,&:hover,&:focus': {
        color: whiteColor,
      },
    },
  };
});

export default footerStyle;
