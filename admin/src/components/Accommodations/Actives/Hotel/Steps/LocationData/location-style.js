import makeStyles from '@mui/styles/makeStyles';
const locationStyle = makeStyles((theme) => {
  return {
    div: {
      [theme.breakpoints.up('md')]: {
        display: 'flex',
        flexDirection: 'row',
      },
    },
    input: {
      color: theme.palette.text.color,
      '& label': {
        left: theme.direction == 'ltr' ? theme.spacing(0.5) : theme.spacing(1),
      },
    },
    cardIconTitle: {
      color: theme.palette.text.color,
      textTransform: 'capitalize',
    },
    mapDiv: {
      [theme.breakpoints.up('lg')]: { height: `400px` },
      [theme.breakpoints.only('md')]: { height: `330px` },
      [theme.breakpoints.only('sm')]: { height: `330px` },
      [theme.breakpoints.only('xs')]: { height: `330px` },
      borderRadius: '6px',
      overflow: 'hidden',
    },
  };
});
export default locationStyle;
