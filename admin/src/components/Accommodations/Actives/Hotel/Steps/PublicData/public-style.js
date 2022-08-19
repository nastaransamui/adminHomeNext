import makeStyles from '@mui/styles/makeStyles';
const publicStyle = makeStyles((theme) => {
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

    inputRoot: {
      '&:before': {
        border: `none`,
      },
    },
  };
});
export default publicStyle;
