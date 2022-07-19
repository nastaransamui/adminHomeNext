import { makeStyles } from '@mui/styles';

const wizardStyle = makeStyles((theme) => {
  return {
    wizardContainer: {},
    card: {
      display: 'inline-block',
      position: 'relative',
      width: '100%',
      margin: '25px 0',
      boxShadow: theme.shadows[12],
      borderRadius: '6px',
      color: theme.palette.text.color,
      transition: 'all 300ms linear',
      minHeight: '410px',
    },
    wizardHeader: {
      textAlign: 'center',
      padding: '25px 0 35px',
    },
    title: { margin: '0' },
    subtitle: { margin: '5px 0 0' },
    wizardNavigation: {
      position: 'relative',
    },
    nav: {
      marginTop: 20,
      backgroundColor: theme.palette.background.default,
      paddingLeft: 0,
      marginBottom: 0,
      listStyle: 'none',
      '&:after,&:before': {
        display: 'table',
        content: '" "',
      },
      '&:after': {
        boxSizing: 'border-box',
      },
    },
    steps: {
      marginLeft: '0',
      textAlign: 'center',
      position: 'relative',
      display: 'inline-block',
    },
    stepsAnchor: {
      cursor: 'pointer',
      position: 'relative',
      display: 'block',
      padding: '10px 15px',
      textDecoration: 'none',
      transition: 'all .3s',
      border: '0 !important',
      borderRadius: '30px',
      lineHeight: '18px',
      textTransform: 'uppercase',
      fontSize: '12px',
      fontWeight: '500',
      minWidth: '100px',
      textAlign: 'center',
      color: theme.palette.text.color,
    },
    movingTab: {
      position: 'absolute',
      textAlign: 'center',
      padding: '12px',
      fontSize: '12px',
      textTransform: 'uppercase',
      WebkitFontSmoothing: 'subpixel-antialiased',
      top: '-4px',
      left: '0px',
      borderRadius: '4px',
      color: theme.palette.text.color,
      cursor: 'pointer',
      fontWeight: '500',
      backgroundColor: theme.palette.primary.main,
      boxShadow: theme.shadows[12],
    },
    content: {
      marginTop: '20px',
      minHeight: '340px',
      padding: '20px 15px',
    },
    stepContent: {
      display: 'none',
    },
    stepContentActive: {
      display: 'block',
    },
    footer: {
      padding: '0 15px',
    },
    left: {
      float: theme.direction == 'ltr' ? 'left!important' : 'right!important',
    },
    right: {
      float: theme.direction == 'ltr' ? 'right!important' : 'left!important',
    },
    clearfix: {
      '&:after,&:before': {
        display: 'table',
        content: '" "',
      },
      clear: 'both',
    },
  };
});

export default wizardStyle;
