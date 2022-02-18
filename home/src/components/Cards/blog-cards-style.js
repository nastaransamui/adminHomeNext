import { makeStyles } from '@mui/styles';

const blogCardsStyles = makeStyles((theme) => {
  return {
    blogCard: {
      display: 'flex',
      marginBottom: theme.spacing(6),
      alignItems: 'center',
      position: 'relative',
      [theme.breakpoints.down('xs')]: {
        marginBottom: theme.spacing(3),
      },
      '&:before': {
        borderRadius: 15,
        content: '""',
        width: 100,
        height: 100,
        transform: 'rotate(45deg)',
        background: theme.palette.secondary.main,
        opacity: 0.2,
        position: 'absolute',
        top: -10,
        left: -25,
      },
    },
    text: {
      '& a': {
        padding: 0,
        position: 'relative',
        textTransform: 'none',
        zIndex: 1,
        whiteSpace: 'inherit',
        color: theme.palette.text.primary,
        lineHeight: '36px',
        '&:hover': {
          background: 'none',
        },
      },
      '& > a': {
        fontWeight: theme.typography.fontWeightRegular,
        color: theme.palette.text.secondary,
      },
      '& h4': {
        lineHeight: 'normal',
        '&:before': {
          borderRadius: 10,
          content: '""',
          width: 50,
          height: 50,
          background:
            theme.palette.type === 'light'
              ? theme.palette.secondary.light
              : theme.palette.secondary.dark,
          position: 'absolute',
          transform: 'rotate(45deg)',
          top: -6,
          left: -25,
        },
        '& a': {
          display: 'block',
          fontSize: 24,
          fontWeight: theme.typography.fontWeightMedium,
          transition: 'all 0.3s ease',
          height: 80,
          [theme.breakpoints.down('xs')]: {
            fontSize: 16,
            lineHeight: '22px',
          },
          '&:hover': {
            color: theme.palette.primary.main,
          },
        },
      },
    },
    date: {
      textAlign: 'center',
      marginLeft:
        theme.direction == 'ltr' ? theme.spacing(3) : theme.spacing(25),
      color: theme.palette.text.hint,
      '& < *': {
        display: 'block',
        fontWeight: theme.typography.fontWeightRegular,
      },
      '& h3': {
        fontSize: 28,
        textTransform: 'uppercase',
        [theme.breakpoints.down('xs')]: {
          fontSize: 20,
        },
      },
      '& h2': {
        fontSize: 46,
        [theme.breakpoints.down('xs')]: {
          fontSize: 32,
        },
      },
      '& h4': {
        fontSize: 22,
        [theme.breakpoints.down('xs')]: {
          fontSize: 16,
        },
      },
    },
  };
});

export default blogCardsStyles;
