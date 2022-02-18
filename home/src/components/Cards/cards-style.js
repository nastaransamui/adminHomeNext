import { makeStyles } from '@mui/styles';

const cardsStyles = makeStyles((theme) => {
  return {
    /* MOVIE THUMB */
    btnWrap: {
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
    text: {},
    movieThumb: {
      margin: '0 auto',
      maxWidth: 300,
      [theme.breakpoints.down('xs')]: {
        maxWidth: 250,
      },
      '& $btnWrap': {
        display: 'block',
        borderRadius: theme.rounded.big,
        background: theme.palette.background.paper,
        padding: '0 !important',
        color: theme.palette.text.primary,
        textAlign: 'center',
      },
      '& figure': {
        overflow: 'hidden',
        margin: 0,
        display: 'flex',
        position: 'relative',
        borderRadius: theme.rounded.big,
        boxShadow: theme.shadows[4],
        '& img': {
          transition: 'all 0.3s',
          minHeight: '100%',
          width: '100%',
        },
        '& figcaption': {
          position: 'absolute',
          textTransform: 'uppercase',
          borderRadius: 40,
          top: 16,
          left: 16,
          background: theme.palette.common.black,
          textAlign: 'center',
          color: theme.palette.common.white,
          padding: theme.spacing(0.75, 1.5),
          zIndex: 10,
        },
        '& i': {
          position: 'absolute',
          fontSize: 52,
          top: 'calc(50% - 30px)',
          left: 'calc(50% - 30px)',
          border: '5px solid #FFF',
          zIndex: 10,
          borderRadius: '50%',
          width: 60,
          height: 60,
          lineHeight: '54px',
          paddingLeft: theme.direction === 'rtl' ? 0 : 4,
          paddingRight: theme.direction === 'rtl' ? 4 : 0,
          opacity: 0,
          transform: 'scale(0.5)',
          transition: 'all 0.3s ease-out',
          color: theme.palette.common.white,
        },
        '&:after': {
          transition: 'all 0.3s ease',
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0,
          backgroundImage: `linear-gradient(-44deg, ${theme.palette.secondary.main} 6%, ${theme.palette.primary.main} 100%)`,
        },
        '&:hover': {
          '& i': {
            opacity: 1,
            transform: 'scale(1)',
          },
          '&:after': {
            opacity: 0.6,
          },
        },
      },
      '& $text': {
        display: 'block',
        width: '100%',
        fontSize: 16,
        padding: theme.spacing(),
        fontWeight: theme.typography.fontWeightBold,
        textTransform: 'none',
      },
    },
  };
});

export default cardsStyles;
