import { makeStyles } from '@mui/styles';
import {
  defaultFont,
  primaryBoxShadow,
  whiteColor,
  dangerColor,
  hexToRgb,
  blackColor,
  grayColor,
  infoColor,
  infoBoxShadow,
  successBoxShadow,
  warningBoxShadow,
  warningColor,
  dangerBoxShadow,
  roseColor,
  roseBoxShadow,
  successColor,
} from '../../../theme/common';

const navbarLinksStyle = makeStyles((theme) => {
  return {
    dropdownItem: {
      ...defaultFont,
      fontSize: '13px',
      padding: '10px 20px',
      margin: '0 5px',
      borderRadius: '2px',
      position: 'relative',
      transition: 'all 150ms linear',
      display: 'block',
      clear: 'both',
      fontWeight: '400',
      height: '100%',
      color: theme.palette.text.color,
      whiteSpace: 'nowrap',
      minHeight: 'unset',
    },
    primaryHover: {
      [theme.breakpoints.up('sm')]: {
        '&:hover': {
          backgroundColor: theme.palette.secondary.main,
          ...primaryBoxShadow,
        },
      },
    },
    darkHover: {
      '&:hover': {
        boxShadow:
          '0 4px 20px 0px rgba(' +
          hexToRgb(blackColor) +
          ', 0.14), 0 7px 10px -5px rgba(' +
          hexToRgb(grayColor[16]) +
          ', 0.4)',
        backgroundColor: grayColor[16],
        color: whiteColor,
      },
    },

    infoHover: {
      '&:hover': {
        backgroundColor: infoColor[0],
        color: whiteColor,
        ...infoBoxShadow,
      },
    },
    successHover: {
      '&:hover': {
        backgroundColor: successColor[0],
        color: whiteColor,
        ...successBoxShadow,
      },
    },
    warningHover: {
      '&:hover': {
        backgroundColor: warningColor[0],
        color: whiteColor,
        ...warningBoxShadow,
      },
    },
    dangerHover: {
      '&:hover': {
        backgroundColor: dangerColor[0],
        color: whiteColor,
        ...dangerBoxShadow,
      },
    },
    roseHover: {
      '&:hover': {
        backgroundColor: roseColor[0],
        color: whiteColor,
        ...roseBoxShadow,
      },
    },
    dropdownItemRTL: {
      textAlign: 'right',
    },
    wrapper: {
      [theme.breakpoints.between('sm', 'md')]: {
        display: 'flex',
      },
    },
    wrapperRTL: {
      [theme.breakpoints.up('md')]: {
        paddingLeft: '16px',
      },
    },
    managerClasses: {
      [theme.breakpoints.up('md')]: {
        display: 'inline-block',
      },
    },
    buttonLinkRTL: {
      [theme.breakpoints.down('sm')]: {
        // alignItems: 'center',
        // justifyContent: 'flex-end',
        // width: '-webkit-fill-available',
        // margin: '10px 15px 0',
        // padding: '10px 15px',
        // display: 'block',
        // position: 'relative',
        // background: 'red',
      },
    },
    buttonLink: {
      [theme.breakpoints.down('sm')]: {
        display: 'flex',
        margin: '5px 15px 0',
        width: 'auto',
        height: 'auto',
        '& svg': {
          width: '30px',
          height: '24px',
          marginRight: '19px',
          marginLeft: '3px',
        },
        '& .fab,& .fas,& .far,& .fal,& .material-icons': {
          width: '30px',
          fontSize: '24px',
          lineHeight: '30px',
          marginRight: '19px',
          marginLeft: '3px',
        },
      },
    },
    labelRTL: {
      [theme.breakpoints.down('sm')]: {
        flexDirection: 'row-reverse',
        justifyContent: 'initial',
        display: 'flex',
      },
    },
    headerLinksSvg: {
      width: '20px !important',
      height: '20px !important',
    },
    links: {
      width: '20px',
      height: '20px',
      zIndex: '4',
      [theme.breakpoints.down('sm')]: {
        display: 'block',
        width: '30px',
        height: '30px',
        color: 'inherit',
        opacity: '0.8',
        marginRight: '16px',
        marginLeft: '-5px',
        fill: whiteColor,
      },
    },
    linkTextRTL: {
      color: 'red',
    },
    linkText: {
      zIndex: '4',
      ...defaultFont,
      fontSize: '14px',
      margin: '0!important',
      textTransform: 'none',
      color: whiteColor,
    },
    notifications: {
      zIndex: '4',
      [theme.breakpoints.up('sm')]: {
        position: 'absolute',
        top: '5px',
        border: '1px solid ' + whiteColor,
        right: '5px',
        fontSize: '9px',
        background: dangerColor[0],
        color: whiteColor,
        minWidth: '16px',
        height: '16px',
        borderRadius: '10px',
        textAlign: 'center',
        lineHeight: '14px',
        verticalAlign: 'middle',
        display: 'block',
      },
      [theme.breakpoints.down('sm')]: {
        ...defaultFont,
        fontSize: '14px',
        marginRight: '8px',
        color: whiteColor,
      },
    },
    popperClose: {
      pointerEvents: 'none',
      display: 'none !important',
    },
    popperNav: {
      [theme.breakpoints.down('sm')]: {
        position: 'static !important',
        left: 'unset !important',
        top: 'unset !important',
        transform: 'none !important',
        willChange: 'unset !important',
        '& > div': {
          boxShadow: 'none !important',
          marginLeft: '0rem',
          marginRight: '0rem',
          transition: 'none !important',
          marginTop: '0px !important',
          marginBottom: '0px !important',
          padding: '0px !important',
          backgroundColor: 'transparent !important',
          '& ul li': {
            color: whiteColor + ' !important',
            margin: '10px 15px 0!important',
            padding: '10px 15px !important',
            '&:hover': {
              backgroundColor: 'hsla(0,0%,78%,.2)',
              boxShadow: 'none',
            },
          },
        },
      },
    },
    popperResponsive: {
      zIndex: '1200',
      [theme.breakpoints.down('sm')]: {
        zIndex: '1640',
        position: 'static',
        float: 'none',
        width: 'auto',
        marginTop: '0',
        backgroundColor: 'transparent',
        border: '0',
        boxShadow: 'none',
        color: 'black',
      },
    },
    langGrow: {
      [theme.breakpoints.up('sm')]: {
        transformOrigin: '0 0 0',
        marginLeft: theme.spacing(-10),
        marginRight: theme.spacing(-9),
        marginTop: theme.spacing(3),
      },
      [theme.breakpoints.down('sm')]: {
        transformOrigin: '0 0 0',
        borderRadius: 0,
      },
    },
    dropdown: {
      borderRadius: '3px',
      border: '0',
      boxShadow: '0 2px 5px 0 rgba(' + hexToRgb(blackColor) + ', 0.26)',
      top: '100%',
      zIndex: '1000',
      minWidth: '160px',
      padding: '5px 0',
      margin: '20px -100px 0 10px',
      fontSize: '14px',
      textAlign: 'left',
      listStyle: 'none',
      backgroundColor: theme.palette.paper,
      backgroundClip: 'padding-box',
    },
    languagePack: {
      display: 'flex',
      color: theme.palette.text.color,
      width: 'auto',
      [theme.breakpoints.down('sm')]: {
        color: whiteColor,
        marginLeft: theme.direction == 'rtl' ? '0' : '15%',
      },
      flexDirection: theme.direction == 'rtl' ? 'row-reverse' : 'row',
    },
    avatarImg: {
      width: 30,
      height: 30,
      borderRadius: 50,
    },
  };
});

export default navbarLinksStyle;
