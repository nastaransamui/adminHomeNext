import { makeStyles } from '@mui/styles';

const provinceStyle = makeStyles((theme) => {
  return {
    AppMap: {
      height: '100%',
      width: '100%',
    },
    root: {
      '& .Mui-error': {
        '&:after': {
          border: 'none',
        },
        '&:before': {
          border: 'none',
        },
      },
    },
    input: {
      '& label': {
        left: theme.direction == 'ltr' ? theme.spacing(0.5) : theme.spacing(1),
      },
    },
    cardIconTitle: {
      color: theme.palette.text.color,
      textTransform: 'capitalize',
    },
    mapDiv: {
      [theme.breakpoints.up('lg')]: { height: `280px` },
      [theme.breakpoints.only('md')]: { height: `330px` },
      [theme.breakpoints.only('sm')]: { height: `330px` },
      [theme.breakpoints.only('xs')]: { height: `330px` },
      borderRadius: '6px',
      overflow: 'hidden',
    },
  };
});

export default provinceStyle;
