import { makeStyles } from '@mui/styles';
import {
  infoColor,
  primaryColor,
  successColor,
  dangerColor,
  warningColor,
  whiteColor,
  blackColor,
  grayColor,
  hexToRgb,
} from '../../../theme/common';

const timelineStyle = makeStyles((theme) => {
  return {
    timeline: {
      [theme.breakpoints.down('md')]: {
        '&:before': {
          left: '5% !important',
        },
      },
      listStyle: 'none',
      padding: '20px 0 20px',
      position: 'relative',
      marginTop: '30px',
      '&:before': {
        top: '50px',
        bottom: '0',
        position: 'absolute',
        content: '" "',
        width: '3px',
        backgroundColor: theme.palette.secondary.main,
        left: '50%',
        marginLeft: '-1px',
      },
      '&:after': {
        position: 'absolute',
        width: 10,
        height: 10,
        left: `calc(50% - 13px)`,
        bottom: -13,
        borderLeft: `13px solid transparent`,
        borderRight: `13px solid transparent`,
        borderTop: `13px solid ${theme.palette.secondary.main}`,
        clear: 'both',
        content: '" "',
      },
    },
    timelineSimple: {
      marginTop: '30px',
      padding: '0 0 20px',
      '&:before': {
        left: '5%',
      },
    },
    item: {
      marginBottom: '20px',
      position: 'relative',
      '&:before,&:after': {
        content: '" "',
        display: 'table',
      },
      '&:after': {
        clear: 'both',
      },
    },
    timelineBadge: {
      [theme.breakpoints.down('md')]: {
        left: '5% !important',
      },
      color: theme.palette.background.paper,
      width: '50px',
      height: '50px',
      lineHeight: '51px',
      fontSize: '1.4em',
      textAlign: 'center',
      position: 'absolute',
      top: '16px',
      left: '50%',
      marginLeft: '-24px',
      zIndex: '100',
      borderTopRightRadius: '50%',
      borderTopLeftRadius: '50%',
      borderBottomRightRadius: '50%',
      borderBottomLeftRadius: '50%',
    },
    timelineSimpleBadge: {
      left: '5%',
    },
    info: {
      backgroundColor: theme.palette.info.main,
      boxShadow:
        '0 4px 20px 0px rgba(' +
        hexToRgb(theme.palette.background.paper) +
        ', 0.14), 0 7px 10px -5px rgba(' +
        hexToRgb(theme.palette.info.main) +
        ', 0.4)',
    },
    success: {
      backgroundColor: theme.palette.success.main,
      boxShadow:
        '0 4px 20px 0px rgba(' +
        hexToRgb(theme.palette.background.paper) +
        ', 0.14), 0 7px 10px -5px rgba(' +
        hexToRgb(successColor[0]) +
        ', 0.4)',
    },
    secondary: {
      backgroundColor: theme.palette.secondary.main,
      boxShadow:
        '0 4px 20px 0px rgba(' +
        hexToRgb(theme.palette.background.paper) +
        ', 0.14), 0 7px 10px -5px rgba(' +
        hexToRgb(theme.palette.secondary.main) +
        ', 0.4)',
    },
    danger: {
      backgroundColor: theme.palette.error.main,
      boxShadow:
        '0 4px 20px 0px rgba(' +
        hexToRgb(theme.palette.background.paper) +
        ', 0.14), 0 7px 10px -5px rgba(' +
        hexToRgb(theme.palette.error.main) +
        ', 0.4)',
    },
    warning: {
      backgroundColor: theme.palette.secondary.main,
      boxShadow:
        '0 4px 20px 0px rgba(' +
        hexToRgb(theme.palette.background.paper) +
        ', 0.14), 0 7px 10px -5px rgba(' +
        hexToRgb(theme.palette.secondary.main) +
        ', 0.4)',
    },
    primary: {
      backgroundColor: theme.palette.primary.main,
      boxShadow:
        '0 4px 20px 0px rgba(' +
        hexToRgb(theme.palette.background.paper) +
        ', 0.14), 0 7px 10px -5px rgba(' +
        hexToRgb(theme.palette.primary.main) +
        ', 0.4)',
    },
    badgeIcon: {
      width: '24px',
      height: '51px',
      cursor: 'pointer',
    },
    timelinePanel: {
      [theme.breakpoints.down('md')]: {
        float: 'right !important',
        width: '86% !important',
        '&:before': {
          borderLeftWidth: '0 !important',
          borderRightWidth: '15px !important',
          left: '-15px !important',
          right: 'auto !important',
        },
        '&:after': {
          borderLeftWidth: '0 !important',
          borderRightWidth: '14px !important',
          left: '-14px !important',
          right: 'auto !important',
        },
      },
      width: '45%',
      float: 'left',
      padding: '20px',
      marginBottom: '20px',
      position: 'relative',
      boxShadow: '0 1px 4px 0 rgba(' + hexToRgb(blackColor) + ', 0.14)',
      borderRadius: '6px',
      color: theme.palette.text.color,
      background: theme.palette.background.paper,
      '&:before': {
        position: 'absolute',
        top: '26px',
        right: '-15px',
        display: 'inline-block',
        borderTop: '15px solid transparent',
        borderLeft: '15px solid ' + theme.palette.background.paper,
        borderRight: '0 solid ' + theme.palette.background.paper,
        borderBottom: '15px solid transparent',
        content: '" "',
      },
      '&:after': {
        position: 'absolute',
        top: '27px',
        right: '-14px',
        display: 'inline-block',
        borderTop: '14px solid transparent',
        borderLeft: '14px solid ' + theme.palette.background.paper,
        borderRight: '0 solid ' + theme.palette.background.paper,
        borderBottom: '14px solid transparent',
        content: '" "',
      },
    },
    timelineSimplePanel: {
      width: '86%',
    },
    timelinePanelInverted: {
      [theme.breakpoints.up('sm')]: {
        float: 'right',
        backgroundColor: theme.palette.background.paper,
        '&:before': {
          borderLeftWidth: '0',
          borderRightWidth: '15px',
          left: '-15px',
          right: 'auto',
        },
        '&:after': {
          borderLeftWidth: '0',
          borderRightWidth: '14px',
          left: '-14px',
          right: 'auto',
        },
      },
    },
    timelineHeading: {
      marginBottom: '15px',
      textAlign: theme.direction == 'rtl' ? 'right' : 'left',
    },
    timelineHeadingInvert: {
      marginBottom: '15px',
      textAlign: theme.direction == 'rtl' ? 'left' : 'right',
    },
    timelineBody: {
      fontSize: '14px',
      lineHeight: '21px',
    },
    timelineFooter: {
      zIndex: '1000',
      position: 'relative',
      float: 'left',
    },
    footerTitle: {
      color: theme.palette.text.disabled,
      fontWeight: '400',
      margin: '10px 0px 0px',
    },
    footerLine: {
      marginTop: '10px',
      marginBottom: '5px',
    },
  };
});

export default timelineStyle;
