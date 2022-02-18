import { makeStyles } from '@mui/styles';
import { alpha } from '@mui/material/styles';
import { darken } from '@mui/material/styles';

const pattern = '/images/patern/bg-pattern.png';
const plane = '/images/patern/plane.png';

const contactStyles = makeStyles((theme) => {
  return {
    title: {},
    pageWrap: {
      textAlign: 'center',
      backgroundColor:
        theme.palette.type === 'light'
          ? theme.palette.secondary.light
          : theme.palette.background.default,
      backgroundImage: `url(${pattern})`,
      backgroundRepeat: 'repeat',
      backgroundSize: '15%',
      minHeight: '100vh',
      position: 'relative',
      width: '100%',
      alignItems: 'center',
      padding: theme.spacing(11, 5),
      [theme.breakpoints.up('md')]: {
        display: 'block',
      },
      [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(5, 0),
      },
      '& $title': {
        color: theme.palette.common.white,
      },
      '& a': {
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
    innerWrap: {
      textAlign: 'left',
      position: 'relative',
      '&:before': {
        [theme.breakpoints.up('md')]: {
          content: '""',
          boxShadow: '0 0 12px 2px rgba(0, 0, 0, 0.05)',
          width: '100%',
          height: '100%',
          background: theme.palette.primary.main,
          transform: 'scale(0.95) rotate(-10deg)',
          position: 'absolute',
          borderRadius: 40,
          top: 0,
          left: 0,
        },
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
    fullFromWrap: {
      color: theme.palette.common.white,
      padding: theme.spacing(14, 10),
      borderRadius: 40,
      [theme.breakpoints.down('xs')]: {
        paddingTop: theme.spacing(4),
      },
    },
    formBox: {
      position: 'relative',
      borderRadius: 40,
      overflow: 'vivible',
      background: `url(${plane}) no-repeat 90% bottom ${theme.palette.primary.dark}`,
      boxShadow: '0 1.5px 12px 2px rgba(0, 0, 0, 0.28)',
      [theme.breakpoints.down('xs')]: {
        boxShadow: 'none',
      },
      [theme.breakpoints.down('sm')]: {
        overflow: 'hidden',
      },
    },
    backtohome: {
      width: 80,
      height: 80,
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
    },
    greeting: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      backgroundColor: theme.palette.primary.dark,
      borderRadius: 40,
      alignItems: 'center',
      paddingTop: theme.spacing(16),
      height: '100%',
      textAlign: 'center',
      color: theme.palette.common.white,
      '& h6': {
        fontWeight: theme.typography.fontWeightRegular,
      },
    },
    formWrap: {
      background: theme.palette.background.paper,
      borderRadius: '0 40px 40px 0',
      position: 'relative',
      padding: theme.spacing(2),
      [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(5),
      },
      [theme.breakpoints.up('lg')]: {
        padding: theme.spacing(8),
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
    light: {},
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
      '&$light': {
        '& label': {
          color: theme.palette.common.white,
        },
        '& > div': {
          border: `1px solid ${alpha(theme.palette.primary.light, 0.5)}`,
          '& input': {
            color: theme.palette.common.white,
            '&:focus': {
              background: alpha(theme.palette.text.hint, 0.2),
            },
            '&:hover': {
              background: alpha(theme.palette.text.hint, 0.2),
            },
          },
        },
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
    check: {
      '& svg': {
        fill: theme.palette.secondary.main,
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
    socmedSideLogin: {
      display: 'flex',
      justifyContent: 'space-around',
      [theme.breakpoints.down('md')]: {
        justifyContent: 'center',
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
    blueBtn: {
      background: '#28aae1',
      '& i': {
        marginRight: 3,
      },
      '&:hover': {
        background: darken('#28aae1', 0.2),
      },
    },
    naviBtn: {
      background: '#3b579d',
      '& i': {
        marginRight: 3,
      },
      '&:hover': {
        background: darken('#3b579d', 0.2),
      },
    },
    redBtn: {
      background: '#dd493c',
      '& i': {
        marginRight: 3,
      },
      '&:hover': {
        background: darken('#dd493c', 0.2),
      },
    },
    deco: {
      [theme.breakpoints.down('md')]: {
        display: 'none',
      },
      '& > *': {
        zIndex: 4,
        boxShadow: '0 0px 18px 0 rgba(0, 0, 0, 0.17)',
        position: 'absolute',
        transform: 'rotate(45deg)',
      },
    },
    primaryLight: {
      borderRadius: 15,
      width: 70,
      height: 70,
      left: -20,
      top: '50%',
      border: '10px solid',
      borderColor: theme.palette.primary.light,
    },
    secondaryMain: {
      borderRadius: 10,
      width: 50,
      height: 50,
      right: -10,
      top: -20,
      border: '10px solid',
      borderColor: theme.palette.secondary.main,
    },
    secondaryLight: {
      width: 100,
      height: 100,
      right: 60,
      borderRadius: 25,
      bottom: -20,
      border: '12px solid',
      borderColor: theme.palette.secondary.light,
    },
    signArrow: {
      transform: theme.direction === 'rtl' ? 'scale(-1)' : 'none',
    },
  };
});

export default contactStyles;
