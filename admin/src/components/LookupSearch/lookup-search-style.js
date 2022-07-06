import { makeStyles } from '@mui/styles';

const lookupSearchStyle = makeStyles((theme) => {
  return {
    select: {
      position: 'absolute',
      left: theme.direction == 'ltr' ? 1 : 25,
    },
    textfield: {
      '& fieldset': {
        '& legend': {
          textAlign: 'left',
        },
      },
      '& label': {
        left: theme.direction == 'ltr' ? theme.spacing(0.5) : theme.spacing(6),
      },

      '& label.Mui-focused': {
        left: theme.direction == 'ltr' ? -6 : theme.spacing(3),
      },
    },
    phone: {
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: theme.palette.primary.main,
        },
        '&:hover fieldset': {
          borderColor: theme.palette.primary.main,
        },
        '&.Mui-focused fieldset': {
          borderColor: theme.palette.primary.main,
        },
      },
      '& label.Mui-focused': {
        color: theme.palette.primary.main,
      },
      '& .MuiInputLabel-shrink': {
        color: theme.palette.text.color,
      },
      '& input': {
        color: theme.palette.text.color,
        '&:focus': {
          color: theme.palette.text.color,
        },
        '&:hover': {
          color: theme.palette.text.color,
        },
      },
    },
    phoneMenu: {
      background: theme.palette.background.paper + '!important',
      color: `${theme.palette.text.color} !important`,
      '& p': {
        color: `${theme.palette.text.color} !important`,
      },
      '& li': {
        '&:hover': {
          background: theme.palette.primary.main,
        },
      },
    },
  };
});

export default lookupSearchStyle;
