import { makeStyles } from '@mui/styles';

const rolesStyle = makeStyles((theme) => {
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

export default rolesStyle;
