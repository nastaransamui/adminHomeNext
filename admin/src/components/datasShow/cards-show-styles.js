import { makeStyles } from '@mui/styles';
import { tooltip } from '../../../theme/common';

const cardsShowStyles = makeStyles((theme) => {
  return {
    tooltip,
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
    IconsList: {
      background: theme.palette.background.paper,
      boxShadow: 1,
      borderRadius: 2,
      padding: 0,
      minWidth: 220,
    },
    listItemHover: {
      '&:hover, &:focus': {
        background: 'unset',

        '& svg:last-of-type': {
          right: 0,
          opacity: 1,
        },
      },
    },
    listItemHoverSmallArrowLeft: {
      position: 'absolute',
      left: -10,
      opacity: 0,
    },
    listItemHoverSmallArrowRight: {
      position: 'absolute',
      left: 10,
      opacity: 0,
    },
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
  };
});

export default cardsShowStyles;
