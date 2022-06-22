import { makeStyles } from '@mui/styles';
import {
  grayColor,
  defaultFont,
  whiteColor,
  hexToRgb,
  blackColor,
} from '../../../theme/common';

const linkStyle = makeStyles((theme) => {
  return {
    itemLink: {
      paddingLeft: '10px',
      paddingRight: '10px',
      transition: 'all 300ms linear',
      margin: '10px 15px 0',
      borderRadius: '3px',
      position: 'relative',
      display: 'block',
      padding: '10px 15px',
      backgroundColor: 'transparent',
      ...defaultFont,
      width: 'auto',
      '&:hover': {
        outline: 'none',
        backgroundColor: 'rgba(' + hexToRgb(grayColor[17]) + ', 0.2)',
        boxShadow: 'none',
      },
      '&,&:hover,&:focus': {
        color: 'inherit',
      },
    },
    collapseActive: {
      outline: 'none',
      backgroundColor: 'rgba(' + hexToRgb(grayColor[17]) + ', 0.2)',
      boxShadow: 'none',
    },
    itemText: {
      color: whiteColor,
      ...defaultFont,
      margin: '0',
      lineHeight: '30px',
      fontSize: '14px',
      transform: 'translate3d(0px, 0, 0)',
      opacity: '1',
      transition: 'transform 300ms ease 0s, opacity 300ms ease 0s',
      position: 'relative',
      display: 'block',
      height: 'auto',
      whiteSpace: 'nowrap',
      padding: '0 16px !important',
    },
    itemTextMini: {
      [theme.breakpoints.up('md')]: {
        transform: 'translate3d(-25px, 0, 0)',
      },
      opacity: '0',
      [theme.breakpoints.down('sm')]: {
        opacity: 1,
      },
    },
    itemTextRTL: {
      // marginRight: '45px',
      // textAlign: 'right',
    },
    collapseItemText: {
      color: whiteColor,
      ...defaultFont,
      margin: '0',
      position: 'relative',
      transform: 'translateX(0px)',
      opacity: '1',
      whiteSpace: 'nowrap',
      display: 'block',
      transition: 'transform 300ms ease 0s, opacity 300ms ease 0s',
      fontSize: '14px',
    },
    collapseItemTextRTL: {
      textAlign: 'right',
      [theme.breakpoints.down('sm')]: {
        textAlign: 'center',
      },
    },
    collapseItemTextMiniRTL: {
      transform: 'translate3d(25px, 0, 0) !important',
    },
    collapseItemTextMini: {
      [theme.breakpoints.up('md')]: {
        transform: 'translate3d(-25px, 0, 0)',
      },
      opacity: '0',
      [theme.breakpoints.down('sm')]: {
        opacity: 1,
      },
    },
    itemIcon: {
      color: whiteColor,
      width: '30px',
      height: '24px',
      float: 'left',
      position: 'inherit',
      top: '3px',
      marginRight: '15px',
      textAlign: 'center',
      verticalAlign: 'middle',
      opacity: '0.8',
    },
    itemIconRTL: {
      float: 'right',
      marginLeft: '15px',
      marginRight: '1px',
    },
    caret: {
      marginTop: '13px',
      position: 'absolute',
      right: '18px',
      transition: 'all 150ms ease-in',
      display: 'inline-block',
      width: '0',
      height: '0',
      marginLeft: '2px',
      verticalAlign: 'middle',
      borderTop: '4px solid',
      borderRight: '4px solid transparent',
      borderLeft: '4px solid transparent',
    },
    caretRTL: {
      left: '11px',
      right: 'auto',
    },
    collapseItemMini: {
      color: whiteColor,
      ...defaultFont,
      textTransform: 'uppercase',
      width: '30px',
      marginRight: '15px',
      textAlign: 'center',
      letterSpacing: '1px',
      position: 'relative',
      float: 'left',
      display: 'inherit',
      transition: 'transform 300ms ease 0s, opacity 300ms ease 0s',
      fontSize: '14px',
    },
    collapseItemMiniRTL: {
      float: 'right',
      marginLeft: '30px',
      marginRight: '1px',
    },
    item: {
      color: whiteColor,
      position: 'relative',
      display: 'block',
      textDecoration: 'none',
      margin: '0',
      padding: '0',
    },
    collapseItem: {
      position: 'relative',
      display: 'block',
      textDecoration: 'none',
      margin: '10px 0 0 0',
      padding: '0',
    },
    caretActive: {
      transform: 'rotate(180deg)',
    },
    list: {
      marginTop: '15px',
      paddingLeft: '0',
      paddingTop: '0',
      paddingBottom: '0',
      marginBottom: '0',
      listStyle: 'none',
      color: whiteColor,
      '&:before,&:after': {
        display: 'table',
        content: '" "',
      },
      '&:after': {
        clear: 'both',
      },
    },
    collapseList: {
      marginTop: '0',
      '& $caret': {
        marginTop: '8px',
      },
    },
    collapseItemLink: {
      transition: 'all 300ms linear',
      margin: '0 15px',
      borderRadius: '3px',
      position: 'relative',
      display: 'block',
      padding: '10px',
      backgroundColor: 'transparent',
      ...defaultFont,
      width: 'auto',
      '&:hover': {
        outline: 'none',
        backgroundColor: 'rgba(' + hexToRgb(grayColor[17]) + ', 0.2)',
        boxShadow: 'none',
      },
      '&,&:hover,&:focus': {
        color: whiteColor,
      },
    },
    itemLink: {
      paddingLeft: '10px',
      paddingRight: '10px',
      transition: 'all 300ms linear',
      margin: '10px 15px 0',
      borderRadius: '3px',
      position: 'relative',
      display: 'block',
      padding: '10px 15px',
      backgroundColor: 'transparent',
      ...defaultFont,
      width: 'auto',
      '&:hover': {
        outline: 'none',
        backgroundColor: 'rgba(' + hexToRgb(grayColor[17]) + ', 0.2)',
        boxShadow: 'none',
      },
      '&,&:hover,&:focus': {
        color: 'inherit',
      },
    },
    white: {
      '& div': {
        color: theme.palette.primary.contrastText,
      },
      '& span': {
        color: theme.palette.primary.contrastText,
      },
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
  };
});

export default linkStyle;
