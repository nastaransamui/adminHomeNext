import { makeStyles } from '@mui/styles';
const sectionMargin = (margin) => margin * 20;
const useStyles = makeStyles((theme) => {
  return {
    mainWrap: {
      position: 'relative',
      width: '100%',
      overflow: 'hidden',
      background:
        theme.palette.type === 'dark'
          ? theme.palette.background.default
          : theme.palette.background.paper,
    },

    containerWrap: {
      marginTop: -40,
      '& > section': {
        position: 'relative',
      },
    },
    spaceTop: {
      marginTop: sectionMargin(4),
      [theme.breakpoints.down('sm')]: {
        marginTop: sectionMargin(3),
      },
      [theme.breakpoints.down('xs')]: {
        marginTop: sectionMargin(2),
      },
    },
  };
});

export default useStyles;
