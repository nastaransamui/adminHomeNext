import { defaultFont } from '../../../theme/common';
import { makeStyles } from '@mui/styles';

const brandStyles = makeStyles((theme) => {
  return {
    logo: {
      padding: '15px 0px',
      margin: '0',
      display: 'block',
      position: 'relative',
      zIndex: '4',
      '&:after': {
        content: '""',
        position: 'absolute',
        bottom: '0',
        height: '1px',
        right: '15px',
        width: 'calc(100% - 30px)',
        backgroundColor: 'hsla(0,0%,100%,.3)',
      },
    },
    whiteAfter: {
      '&:after': {
        backgroundColor: 'hsla(0,0%,71%,.3) !important',
      },
    },
    logoMini: {
      transition: 'all 300ms linear',
      opacity: 1,
      float: 'left',
      textAlign: 'center',
      width: '30px',
      display: 'inline-block',
      maxHeight: '30px',
      marginLeft: '22px',
      marginRight: '18px',
      marginTop: '7px',
      color: 'inherit',
    },
    logoMiniRTL: {
      float: 'right',
      marginRight: '30px',
      marginLeft: '26px',
    },
    logoNormal: {
      ...defaultFont,
      transition: 'all 300ms linear',
      display: 'block',
      opacity: '1',
      transform: 'translate3d(0px, 0, 0)',
      textTransform: 'uppercase',
      padding: '5px 0px',
      fontSize: '18px',
      whiteSpace: 'nowrap',
      fontWeight: '400',
      lineHeight: '30px',
      overflow: 'hidden',
      '&,&:hover,&:focus': {
        color: 'inherit',
      },
    },
    logoNormalRTL: {
      textAlign: 'right',
      [theme.breakpoints.down('sm')]: {
        textAlign: 'left',
      },
    },
    logoNormalSidebarMini: {
      opacity: '0',
      [theme.breakpoints.up('md')]: {
        transform: 'translate3d(-25px, 0, 0)',
      },
      [theme.breakpoints.down('sm')]: {
        opacity: 1,
      },
    },
    logoNormalSidebarMiniRTL: {
      transform: 'translate3d(25px, 0, 0)',
    },
    img: {
      width: '35px',
      verticalAlign: 'middle',
      border: '0',
    },
  };
});

export default brandStyles;
