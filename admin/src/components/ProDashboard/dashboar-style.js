import { makeStyles } from '@mui/styles';

const dashboardStyle = makeStyles((theme) => {
  return {
    mainPageMinimize: {
      float: 'left',
      padding: '0 0 0 15px',
      display: 'block',
      color: theme.palette.text.color,
    },
    mainPageHandlemainOpen: {
      [theme.breakpoints.up('sm')]: {
        transition: 'all .35s ease',
        padding: `0 0 0 ${theme.spacing(37)} !important`,
      },
    },
    mainPageHandlemainClose: {
      [theme.breakpoints.up('sm')]: {
        transition: 'all .35s ease',
        padding: `0 0 0 ${theme.spacing(15)} !important`,
      },
    },
  };
});

export default dashboardStyle;
