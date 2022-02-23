import { makeStyles } from '@mui/styles';
import {
  drawerWidth,
  transition,
  grayColor,
  hexToRgb,
  drawerMiniWidth,
  defaultFont,
  blackColor,
} from '../../../theme/common';

const navbarStyle = makeStyles((theme) => {
  return {
    mainPanel: {
      transitionProperty: 'top, bottom, width',
      transitionDuration: '.2s, .2s, .35s',
      transitionTimingFunction: 'linear, linear, ease',
      [theme.breakpoints.up('md')]: {
        width: `calc(100% - ${drawerWidth}px)`,
      },
      overflow: 'auto',
      position: 'relative',
      float: 'left',
      ...transition,
      maxHeight: '100%',
      width: '100%',
      overflowScrolling: 'touch',
    },
    mainPanelSidebarMini: {
      [theme.breakpoints.up('md')]: {
        width: `calc(100% - ${drawerMiniWidth}px)`,
      },
    },
    white: {
      '&,&:hover,&:focus': {
        color: grayColor[2],
        backgroundColor: theme.palette.primary.main,
        boxShadow:
          '0 4px 20px 0 rgba(' +
          hexToRgb(blackColor) +
          ',.14), 0 7px 10px -5px rgba(' +
          hexToRgb(grayColor[2]) +
          ',.4)',
      },
    },
    sidebarMinimize: {
      float: 'left',
      padding: '0 0 0 15px',
      display: 'block',
      color: grayColor[6],
    },
    sidebarHandlemainOpen: {
      padding: `0 0 0 ${drawerWidth}px !important`,
      transition: 'all .35s ease',
    },
    sidebarHandlemainClose: {
      transition: 'all .35s ease',
      padding: `0 0 0 ${drawerMiniWidth}px !important`,
    },
    appBar: {
      backgroundColor: 'transparent !important',
      width: '100%',
      paddingTop: '10px',
      zIndex: '1029',
      color: grayColor[6],
      border: '0',
      borderRadius: '3px',
      padding: '10px 0',
      transition: 'all 150ms ease 0s',
      minHeight: '50px',
      display: 'block',
    },
    sidebarMiniIcon: {
      width: '20px',
      height: '17px',
    },
    flex: {
      flex: 1,
    },
    title: {
      ...defaultFont,
      lineHeight: '30px',
      fontSize: '18px',
      borderRadius: '3px',
      textTransform: 'none',
      color: `${theme.palette.type == 'dark' ? 'white' : 'black'} !important`,
      paddingTop: '0.625rem',
      paddingBottom: '0.625rem',
      margin: '0 !important',
      letterSpacing: 'unset',
      '&:hover,&:focus': {
        background: 'transparent',
      },
    },
  };
});

export default navbarStyle;
