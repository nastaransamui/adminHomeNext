import { makeStyles } from '@mui/styles';

const currencyStyle = makeStyles((theme) => {
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
  };
});

export default currencyStyle;
