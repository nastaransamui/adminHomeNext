import { makeStyles } from '@mui/styles';
import { cardTitle } from '../../../../theme/common';

const featureStyles = makeStyles((theme) => {
  return {
    cardTitle,
    cardIconTitle: {
      ...cardTitle,
      color: theme.palette.text.color,
      textAlign: 'center',
      marginTop: '15px',
      marginBottom: '0px',
      '& small': {
        fontSize: '80%',
        fontWeight: '400',
      },
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
    caption: {
      color: theme.palette.text.color,
    },
    input: {
      '& label': {
        left: theme.direction == 'ltr' ? theme.spacing(0.5) : theme.spacing(1),
      },
    },
    youtube: {
      borderRadius: 25,
      width: '100%',
      height: '50vh',
    },
  };
});

export default featureStyles;
