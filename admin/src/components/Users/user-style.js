import { makeStyles } from '@mui/styles';
import { cardTitle, grayColor } from '../../../theme/common';

const userStyle = makeStyles((theme) => {
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
    followButton: {
      borderRadius: 36,
      fontWeight: 600,
      padding: '8px 24px',
    },
  };
});

export default userStyle;
