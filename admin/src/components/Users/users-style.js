import { makeStyles } from '@mui/styles';
import { cardTitle, grayColor } from '../../../theme/common';

const usersStyle = makeStyles((theme) => {
  return {
    filterToolbar: {
      display: 'flex',
      [theme.breakpoints.down('md')]: {
        flexDirection: 'column',
      },
    },
    toolbarSwitch: {
      alignItems: 'center',
      [theme.breakpoints.down('md')]: {
        justifyContent: 'center',
      },
    },
    toolbarText: {
      justifyContent: 'center',
    },
    Icon: {
      justifyContent: 'flex-end',
      [theme.breakpoints.down('md')]: {
        justifyContent: 'center',
      },
    },
  };
});

export default usersStyle;
