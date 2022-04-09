import { makeStyles } from '@mui/styles';
import { cardTitle, grayColor, tooltip } from '../../../theme/common';

const usersStyle = makeStyles((theme) => {
  return {
    tooltip,
    cardHover: {
      '&:hover': {
        '& $cardHeaderHover': {
          transform: 'translate3d(0, -50px, 0)',
        },
      },
    },
    cardHeaderHover: {
      transition: 'all 300ms cubic-bezier(0.34, 1.61, 0.7, 1)',
    },
    cardHoverUnder: {
      position: 'absolute',
      zIndex: '1',
      top: '-50px',
      width: 'calc(100% - 30px)',
      left: '17px',
      right: '17px',
      textAlign: 'center',
    },
    cardProductTitle: {
      color: theme.palette.text.color,
    },
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
