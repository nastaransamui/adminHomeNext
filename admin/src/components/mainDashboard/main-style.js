import { makeStyles } from '@mui/styles';

const mainStyles = makeStyles((theme) => {
  return {
    MainDashboard: {
      flex: 4,
      padding: 10,
      overflowY: 'hidden',
      color: theme.palette.text.color,
    },
    homeWidgets: {
      display: 'flex',
      margin: 20,
      flexWrap: 'wrap',
      color: theme.palette.text.color,
    },
  };
});

export default mainStyles;
