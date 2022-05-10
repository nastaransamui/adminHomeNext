import { makeStyles } from '@mui/styles';

const countryStyle = makeStyles((theme) => {
  return {
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
      [theme.breakpoints.up('lg')]: { height: `400px` },
      [theme.breakpoints.only('md')]: { height: `330px` },
      borderRadius: '6px',
      overflow: 'hidden',
    },
  };
});

export default countryStyle;
