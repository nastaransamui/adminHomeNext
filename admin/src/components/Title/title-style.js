import { makeStyles } from '@mui/styles';

const titleStyles = makeStyles((theme) => {
  return {
    left: {
      textAlign: 'left',
      [theme.breakpoints.up('md')]: {
        marginRight: theme.spacing(5),
      },
    },
    right: {
      textAlign: 'right',
      [theme.breakpoints.up('md')]: {
        marginRight: theme.spacing(5),
      },
    },
    center: {
      textAlign: 'center',
      marginLeft: 'auto',
      marginRight: 'auto',
      margin: '0 auto',
    },
    title: {
      fontWeight: theme.typography.fontWeightBold,
      marginBottom: theme.spacing(3),
      display: 'block',
      minWidth: 200,
      fontSize: 36,
      lineHeight: '56px',
      '& h4': {
        lineHeight: 1.2,
        [theme.breakpoints.down('md')]: {
          fontSize: 32,
          lineHeight: '48px',
        },
        [theme.breakpoints.down('xs')]: {
          fontSize: 24,
          lineHeight: '36px',
        },
      },
      [theme.breakpoints.down('xs')]: {
        textAlign: 'center',
        marginLeft: 'auto',
        marginRight: 'auto',
      },
    },
    primary: {
      fontWeight: theme.typography.fontWeightBold,
    },
    secondary: {
      fontWeight: theme.typography.fontWeightBold,
      color:
        theme.palette.type === 'light'
          ? theme.palette.secondary.main
          : theme.palette.secondary.light,
    },
  };
});

export default titleStyles;
