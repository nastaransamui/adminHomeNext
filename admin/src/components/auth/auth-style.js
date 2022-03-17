import { makeStyles } from '@mui/styles';
import { alpha } from '@mui/material/styles';
import { darken } from '@mui/material/styles';

const authStyles = makeStyles((theme) => {
  return {
    title: {},
    pageWrap: {
      textAlign: 'center',
      background: theme.palette.primary.dark,
      minHeight: '100%',
      position: 'relative',
      minHeight: '100%',
      width: '100%',
      alignItems: 'center',
      padding: theme.spacing(10, 5),
      [theme.breakpoints.up('md')]: {
        display: 'flex',
      },
      [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(5, 0),
      },
      '& $title': {
        color: theme.palette.common.white,
      },
      '& a': {
        [theme.breakpoints.up('sm')]: {
          position: 'absolute',
        },
        color:
          theme.palette.type === 'dark'
            ? theme.palette.secondary.light
            : theme.palette.secondary.main,
        textTransform: 'none',
        fontSize: 16,
        textDecoration: 'none',
        fontWeight: theme.typography.fontWeightRegular,
        [theme.breakpoints.down('xs')]: {
          fontSize: 14,
        },
      },
    },
    innerWrap: {
      textAlign: 'left',
    },
    fullFormWrap: {
      color: theme.palette.common.white,
      paddingTop: theme.spacing(8),
      [theme.breakpoints.down('xs')]: {
        paddingTop: theme.spacing(4),
      },
    },
    labelFocued: {
      '& label': {
        background: 'green',
        left: 480,
      },
    },
    input: {
      width: '100%',
      '& label': {
        left: theme.direction == 'ltr' ? theme.spacing(0.5) : theme.spacing(3),
      },
      '& label.Mui-focused': {
        right: theme.direction == 'ltr' ? theme.spacing(0.5) : theme.spacing(3),
        left: theme.direction == 'ltr' ? theme.spacing(0.5) : theme.spacing(3),
      },
      '& .MuiInputLabel-shrink': {
        left: theme.direction == 'ltr' ? theme.spacing(0.5) : theme.spacing(3),
      },
      '& > div': {
        border: `1px solid ${alpha(theme.palette.text.primary, 0.25)}`,
        background: 'none',
        overflow: 'hidden',
        '& input': {
          paddingLeft: theme.spacing(2),
          '&:focus': {
            background: alpha(theme.palette.background.paper, 0.7),
          },
          '&:hover': {
            background: alpha(theme.palette.background.paper, 0.7),
          },
        },
      },
    },
    buttonLink: {
      color: theme.palette.secondary.main,
      [theme.breakpoints.down('sm')]: {
        fontSize: 10,
      },
    },
    formHelper: {
      display: 'flex',
      marginTop: theme.spacing(),
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      [theme.breakpoints.down('xs')]: {
        flexDirection: 'column',
        alignItems: 'center',
      },
    },
    flex: {},
    btnArea: {
      justifyContent: 'space-between',
      [theme.breakpoints.up('sm')]: {
        marginTop: theme.spacing(5),
        display: 'flex',
      },
      [theme.breakpoints.down('sm')]: {
        '& button': {
          marginTop: theme.spacing(4),
          width: '100%',
        },
      },
      [theme.breakpoints.down('xs')]: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(5),
      },
      '& button': {
        marginTop: theme.spacing(2),
        minHeight: 48,
        minWidth: 180,
      },
      '& span': {
        '& a': {
          textDecoration: 'none !important',
          color: theme.palette.secondary.main,
        },
      },
      '&$flex': {
        display: 'flex',
        justifyContent: 'space-between',
        [theme.breakpoints.down('sm')]: {
          display: 'block',
        },
      },
    },

    backtohome: {
      width: 80,
      height: 80,
      top: 50,
      left: 50,
      position: 'absolute',
      marginTop: 20,
      marginLeft: 20,
      zIndex: 20,
      [theme.breakpoints.down('sm')]: {
        left: 'calc(50% - 40px)',
        top: 40,
        margin: 0,
      },
      [theme.breakpoints.up('md')]: {
        marginTop: 20,
        marginLeft: 20,
      },
      [theme.breakpoints.down('sm')]: {
        display: 'none',
      },
      '& i': {
        fontSize: 32,
        color: alpha(theme.palette.common.white, 0.54),
      },
      '& > i:first-child': {
        opacity: 1,
        transition: 'opacity 0.3s ease',
      },
      '& > i:nth-child(2)': {
        position: 'absolute',
        right: 0,
        opacity: 0,
        transition: 'all 0.3s ease',
      },
      '&:hover': {
        '& > i:first-child': {
          opacity: 0,
        },
        '& > i:nth-child(2)': {
          right: 30,
          opacity: 1,
        },
      },
    },
    authFrame: {
      display: 'block',
      position: 'relative',
      // marginTop: theme.spacing(-10),
    },
    check: {
      '& svg': {
        fill: theme.palette.secondary.main,
      },
    },
    decoration: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
      overflow: 'hidden',
      clip: 'rect(0, auto, auto, 0)',
      '& svg': {
        position: 'fixed',
        top: -280,
      },
    },
    leftDeco: {
      left: theme.direction === 'rtl' ? 'auto' : -320,
      right: theme.direction === 'rtl' ? '-50%' : 'auto',
      width: 1200,
      height: 1500,
      transformOrigin: 'top left',
      fill: theme.palette.primary.main,
      [theme.breakpoints.up('md')]: {
        transform: 'scale(0.8)',
      },
    },
    rightDeco: {
      left: theme.direction === 'rtl' ? -150 : 'auto',
      right: theme.direction === 'rtl' ? 'auto' : 0,
      height: 1500,
      transformOrigin: 'top right',
      fill: theme.palette.secondary.dark,
      [theme.breakpoints.up('md')]: {
        transform: 'scale(0.8)',
      },
    },
    greeting: {
      display: 'flex',
      paddingTop: theme.spacing(16),
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      height: '100%',
      textAlign: 'center',
      color: theme.palette.common.white,
      '& h6': {
        fontWeight: theme.typography.fontWeightRegular,
      },
    },
    logoHeader: {},
    logo: {
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing(3),
      '&$logoHeader': {
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        zIndex: 10,
      },
      '& img': {
        width: 64,
      },
      '& p, span': {
        display: 'block',
        paddingBottom: 4,
        color: theme.palette.common.white,
      },
    },
    head: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      '& a': {
        marginTop: theme.spacing(),
      },
      [theme.breakpoints.down('sm')]: {
        marginTop: theme.spacing(2),
        justifyContent: 'center',
        '& a': {
          display: 'none',
        },
      },
    },
    signArrow: {
      transform: theme.direction === 'rtl' ? 'scale(-1)' : 'none',
    },
    formWrap: {
      background: theme.palette.background.paper,
      position: 'relative',
      padding: theme.spacing(2),
      [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(5),
      },
      [theme.breakpoints.up('lg')]: {
        padding: theme.spacing(8),
      },
    },
    separator: {
      margin: `${theme.spacing(5)} auto`,
      maxWidth: 300,
      minWidth: 200,
      textAlign: 'center',
      position: 'relative',
      '& p': {
        [theme.breakpoints.down('xs')]: {
          fontSize: 12,
        },
      },
      '&:before, &:after': {
        content: '""',
        borderTop: `1px solid ${theme.palette.text.hint}`,
        top: '50%',
        position: 'absolute',
        width: '20%',
      },
      '&:before': {
        left: 0,
      },
      '&:after': {
        right: 0,
      },
    },

    socmedSideLogin: {
      display: 'flex',
      justifyContent: 'space-around',
      marginTop: 30,
      [theme.breakpoints.down('md')]: {
        justifyContent: 'center',
        flexDirection: 'column',
      },
      [theme.breakpoints.down('xs')]: {
        justifyContent: 'center',
        display: 'block',
      },
    },
    flag: {
      width: 20,
      height: 20,
    },
    menuItemText: {
      margin: 'auto',
      width: '50%',
      padding: 10,
    },
    selectLang: {
      display: 'flex',
    },
  };
});

export default authStyles;
