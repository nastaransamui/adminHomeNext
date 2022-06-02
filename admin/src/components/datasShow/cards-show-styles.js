import { makeStyles } from '@mui/styles';

const cardsShowStyles = makeStyles((theme) => {
  return {
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
    select: {
      position: 'absolute',
      left: theme.direction == 'ltr' ? -6 : 25,
    },
    textfield: {
      '& fieldset': {
        '& legend': {
          textAlign: 'left',
        },
      },
      '& label': {
        left: theme.direction == 'ltr' ? theme.spacing(0.5) : theme.spacing(6),
      },

      '& label.Mui-focused': {
        left: theme.direction == 'ltr' ? -6 : theme.spacing(3),
      },
    },
    expandIconBox: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      borderBottom: `1px solid ${theme.palette.primary.main}`,
      minWidth: 140,
    },
    phone: {
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: theme.palette.primary.main,
        },
        '&:hover fieldset': {
          borderColor: theme.palette.primary.main,
        },
        '&.Mui-focused fieldset': {
          borderColor: theme.palette.primary.main,
        },
      },
      '& label.Mui-focused': {
        color: theme.palette.primary.main,
      },
      '& .MuiInputLabel-shrink': {
        color: theme.palette.text.color,
      },
      '& input': {
        color: theme.palette.text.color,
        '&:focus': {
          color: theme.palette.text.color,
        },
        '&:hover': {
          color: theme.palette.text.color,
        },
      },
    },
    phoneMenu: {
      background: theme.palette.background.paper + '!important',
      color: `${theme.palette.text.color} !important`,
      '& p': {
        color: `${theme.palette.text.color} !important`,
      },
      '& li': {
        '&:hover': {
          background: theme.palette.primary.main,
        },
      },
    },
  };
});

export default cardsShowStyles;
