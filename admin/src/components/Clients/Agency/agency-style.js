import { makeStyles } from '@mui/styles';
import { cardTitle, grayColor } from '../../../../theme/common';

const agencyStyle = makeStyles((theme) => {
  return {
    cardTitle,
    cardIconTitle: {
      ...cardTitle,
      color: theme.palette.text.color,
      marginTop: '15px',
      marginBottom: '0px',
      '& small': {
        fontSize: '80%',
        fontWeight: '400',
      },
    },
    cardCategory: {
      marginTop: '10px',
      color: grayColor[0] + ' !important',
      textAlign: 'center',
    },
    description: {
      color: grayColor[0],
    },
    updateProfileButton: {
      marginTop: 20,
      marginBottom: 8,
      float: 'right',
    },
    input: {
      color: theme.palette.text.color,
      '& label': {
        left: theme.direction == 'ltr' ? theme.spacing(0.5) : theme.spacing(1),
      },
    },
    inputAutocomplete: {
      color: theme.palette.text.color,
      '& label': {
        left: theme.direction == 'ltr' ? theme.spacing(0.5) : theme.spacing(3),
      },
    },
    followButton: {
      borderRadius: 36,
      fontWeight: 600,
      padding: '8px 24px',
    },
    smallAvatar: {
      width: 40,
      height: 40,
      borderRadius: 6,
      cursor: 'pointer',
    },
    deleteIcon: {
      display: 'flex',
      alignItems: 'center',
      textAlign: 'center',
    },
    root: {
      '& .MuiInput-underline:after': {
        borderBottomColor: theme.palette.primary.error,
        top: 9,
      },
      bottom: 10,
      '&:before': {
        border: 'none',
      },
      '& .MuiInput-underline:before': {
        border: 'none',
      },
      '& .MuiInput-underline:hover:before': {
        border: 'none',
      },
      // '& .Mui-error': {
      //   '&:after': {
      //     // position: 'absolute',
      //     // bottom: -1,
      //     // width: '100%',
      //   },
      //   '&:before': {
      //     // border: 'none',
      //   },
      // },
    },
  };
});

export default agencyStyle;
