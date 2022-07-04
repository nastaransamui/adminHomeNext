import { makeStyles } from '@mui/styles';
import { cardTitle, grayColor } from '../../../theme/common';

const userStyle = makeStyles((theme) => {
  return {
    table: {
      '& .MuiTableCell-root': {
        borderLeft: '1px solid rgba(81, 81, 81, 1)',
      },
    },
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
      marginTop: 8,
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
  };
});

export default userStyle;
