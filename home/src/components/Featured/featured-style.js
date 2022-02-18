import { makeStyles } from '@mui/styles';

const featureStyles = makeStyles((theme) => {
  return {
    root: {
      position: 'relative',
      [theme.breakpoints.down('xs')]: {
        textAlign: 'center',
      },
    },
    decoration: {
      position: 'absolute',
      width: 1280,
      height: 960,
      top: 200,
      '& svg': {
        width: 1280,
        height: '100%',
        fill:
          theme.palette.type === 'dark'
            ? theme.palette.primary.dark
            : theme.palette.primary.light,
        opacity: 0.4,
        [theme.breakpoints.up('lg')]: {
          transform: 'scale(1.7,1)',
        },
        [theme.breakpoints.up('xl')]: {
          display: 'none',
        },
        [theme.breakpoints.down('xs')]: {
          transform: 'scale(0.5)',
          transformOrigin: 'center left',
        },
      },
    },
    // Dialog
    videoPopup: {
      width: 690,
      maxWidth: 'none',
    },
    closeBtn: {
      position: 'absolute',
      top: 4,
      right: 4,
    },
  };
});

export default featureStyles;
