import makeStyles from '@mui/styles/makeStyles';
const nameStyle = makeStyles((theme) => {
  return {
    infoText: {
      fontWeight: '300',
      margin: '10px 0 30px',
      textAlign: 'center',
    },
    pictureContainer: {
      position: 'relative',
      cursor: 'pointer',
      textAlign: 'center',
    },
    picture: {
      width: 106,
      height: 106,
      backgroundColor: theme.palette.background.default,
      border: `4px solid ${theme.palette.secondary.main}`,
      borderRadius: '50%',
      margin: '5px auto',
      overflow: 'hidden',
      transition: 'all 0.2s',
      WebkitTransition: 'all 0.2s',
      '&:hover': {
        border: `4px solid ${theme.palette.primary.main}`,
        '& $icon': {
          color: theme.palette.secondary.main,
        },
      },
      '& input': {
        cursor: 'pointer',
        display: 'block',
        height: '100%',
        left: 0,
        opacity: '0 !important',
        position: 'absolute',
        top: 0,
        width: '100%',
      },
    },
    icon: {
      color: theme.palette.primary.main,
      // paddingBottom: 1,
      marginTop: 5,
      // width: 90,
      // height: 90,
      borderRadius: '50%',
      fontSize: 90,
    },
    input: {
      color: theme.palette.text.color,
      '& label': {
        left: theme.direction == 'ltr' ? theme.spacing(0.5) : theme.spacing(1),
      },
    },
    div: {
      [theme.breakpoints.up('md')]: {
        display: 'flex',
        flexDirection: 'row',
      },
    },
  };
});

export default nameStyle;
