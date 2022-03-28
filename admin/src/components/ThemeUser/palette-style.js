import { makeStyles } from '@mui/styles';
import { alpha, darken } from '@mui/material';

const useStyles = makeStyles((theme) => {
  return {
    active: {},
    tab: {
      '& svg': {
        marginRight: theme.spacing(),
      },
    },
    btn: {
      position: 'fixed',
      display: 'flex',
      flexDirection: 'column',
      right: 10,
      top: '90%',
      zIndex: 999,
      borderRadius: 8,
      boxShadow: theme.shadows[4],
      padding: theme.spacing(0.5),
      border: `1px solid ${theme.palette.primary.main}`,
      background: alpha(theme.palette.background.paper, 0.6),
      backdropFilter: 'saturate(180%) blur(20px)',
      [theme.breakpoints.down('xs')]: {
        top: '45%',
      },
      '&$active': {
        right: 624,
        border: 'none',
      },
      '& svg': {
        width: 32,
        height: 32,
        fill: theme.palette.text.secondary,
        [theme.breakpoints.down('xs')]: {
          width: 22,
          height: 22,
        },
      },
      '& button': {
        [theme.breakpoints.down('xs')]: {
          padding: 8,
        },
      },
    },
    draweBg: {
      background: alpha(theme.palette.background.paper, 0.6),
      backdropFilter: 'saturate(180%) blur(20px)',
      [theme.breakpoints.down('sm')]: {
        width: '100% !important',
      },
    },
    paper: {
      padding: theme.spacing(2),
      borderRadius: '10px',
    },
    optWrap: {
      width: 600,
      [theme.breakpoints.down('sm')]: {
        width: '100%',
      },
      overflow: 'hidden',
      '& > div': {
        overflow: 'auto',
        height: '100%',
        paddingTop: theme.spacing(10),
      },
      '& header': {
        [theme.breakpoints.down('xs')]: {
          flexDirection: 'row',
        },
      },
      [theme.breakpoints.down('xs')]: {
        width: '100%',
      },
    },
    mobileBack: {
      float: 'left',
      marginRight: '5%',
    },
    appbar: {
      [theme.breakpoints.down('sm')]: {
        display: 'flex',
        flexDirection: theme.direction == 'ltr' ? 'row' : 'row-reverse',
        justifyContent: theme.direction == 'ltr' ? 'flex-end' : 'flex-start',
      },
    },
    wrapper: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
    },
    themeSwitched: {
      marginBottom: theme.spacing(3),
      '& h6': {
        marginBottom: theme.spacing(),
      },
      '& label': {
        lineHeight: '40px',
      },
    },
    thumbSwitch: {
      backgroundColor: theme.palette.secondary.main,
    },
    trackSwitch: {
      backgroundColor: theme.palette.secondary.main,
    },
    swatch: {
      position: 'relative !important',
      textAlign: 'center',
      padding: theme.spacing(3) + '!important',
      marginBottom: theme.spacing(2) + '!important',
      borderRadius: '10px !important',
      '&$active': {
        boxShadow: `0 0 0 2px ${theme.palette.primary.main}`,
      },
    },
    swatchWrapper: {
      [theme.breakpoints.down('sm')]: {
        display: 'grid',
        gridTemplateColumns: '105px 105px 105px',
      },
    },
    primary: {
      width: 60,
      height: 60,
      display: 'block',
      borderRadius: '50%',
    },
    secondary: {
      width: 30,
      height: 30,
      display: 'block',
      position: 'absolute',
      borderRadius: '50%',
      left: '60%',
      top: '60%',
    },
    themeColor: {
      '& h6': {
        marginBottom: theme.spacing(),
      },
      [theme.breakpoints.down('sm')]: {
        display: 'flex',
        justifyContent: 'center',
        '& h6': { textAlign: 'center' },
      },
    },
    marginBottom: {
      [theme.breakpoints.down('xs')]: {
        marginBottom: theme.spacing(3),
      },
    },
    twitter: {
      '& svg': {
        fill: '#28aae1',
        '&:hover': {
          fill: darken('#28aae1', 0.2),
        },
      },
    },
    facebook: {
      '& svg': {
        fill: '#3b579d',
        '&:hover': {
          fill: darken('#3b579d', 0.2),
        },
      },
    },
    google: {
      '& svg': {
        fill: '#dd493c',
        '&:hover': {
          fill: darken('#dd493c', 0.2),
        },
      },
    },
  };
});
export default useStyles;
