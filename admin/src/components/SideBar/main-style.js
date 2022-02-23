import { makeStyles } from '@mui/styles';
import {
  boxShadow,
  drawerWidth,
  drawerMiniWidth,
  whiteColor,
  blackColor,
  transition,
} from '../../../theme/common';

const mainStyles = makeStyles((theme) => {
  return {
    drawerPaper: {
      border: 'none',
      position: 'fixed',
      top: '0',
      bottom: '0',
      left: '0',
      zIndex: '1032',
      transitionProperty: 'top, bottom, width',
      transitionDuration: '.2s, .2s, .35s',
      transitionTimingFunction: 'linear, linear, ease',
      // overflow: 'auto',
      ...boxShadow,
      width: drawerWidth,
      [theme.breakpoints.up('md')]: {
        width: drawerWidth,
        position: 'fixed',
        height: '100%',
      },
      [theme.breakpoints.down('sm')]: {
        width: drawerWidth,
        ...boxShadow,
        position: 'fixed',
        display: 'block',
        top: '0',
        height: '100vh',
        right: '0',
        left: 'auto',
        zIndex: '1032',
        visibility: 'visible',
        overflowY: 'visible',
        borderTop: 'none',
        textAlign: 'left',
        paddingRight: '0px',
        paddingLeft: '0',
        transform: `translate3d(${drawerWidth}px, 0, 0)`,
        ...transition,
      },
      '&:before,&:after': {
        position: 'absolute',
        zIndex: '3',
        width: '100%',
        height: '100%',
        content: '""',
        display: 'block',
        top: '0',
      },
    },
    drawerPaperMini: {
      [theme.breakpoints.up('sm')]: {
        width: drawerMiniWidth + 'px!important',
      },
    },
    drawerPaperOpenMobile: {
      width: drawerWidth + 'px!important',
    },
    blackBackground: {
      color: whiteColor,
      '&:after': {
        background: blackColor,
        opacity: '.8',
      },
    },
    background: {
      position: 'absolute',
      zIndex: '1',
      height: '100%',
      width: '100%',
      display: 'block',
      top: '0',
      left: '0',
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
      transition: 'all 300ms linear',
    },
    sidebarWrapper: {
      position: 'relative',
      height: 'calc(100vh - 75px)',
      overflow: 'auto',
      width: '260px',
      zIndex: '4',
      overflowScrolling: 'touch',
      transitionProperty: 'top, bottom, width',
      transitionDuration: '.2s, .2s, .35s',
      transitionTimingFunction: 'linear, linear, ease',
      color: 'inherit',
      paddingBottom: '30px',
    },
    sidebarWrapperWithPerfectScrollbar: {
      overflow: 'hidden !important',
    },
  };
});
export default mainStyles;
