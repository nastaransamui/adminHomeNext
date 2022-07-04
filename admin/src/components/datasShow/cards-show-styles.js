import { makeStyles } from '@mui/styles';
import { cardTitle } from '../../../theme/common';

const cardsShowStyles = makeStyles((theme) => {
  return {
    cardTitle,
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
    cardCategory: {
      color: theme.palette.text.color,
      marginTop: '10px',
    },
    marginTop30: {
      marginTop: '30px',
      cursor: 'pointer',
    },
    icon: {
      color: '#333333',
      margin: '10px auto 0',
      width: '130px',
      height: '130px',
      border: `1px solid ${theme.palette.secondary.main}`,
      borderRadius: '50%',
      lineHeight: '174px',
      '& svg': {
        width: '55px',
        height: '55px',
      },
      '& .fab,& .fas,& .far,& .fal,& .material-icons': {
        width: '55px',
        fontSize: '55px',
      },
    },
    iconPrimary: {
      ...cardTitle,
      color: theme.palette.primary.main,
    },
    btnClasses: {
      color: theme.palette.primary.contrastText,
      minHeight: 'auto',
      minWidth: 'auto',
      border: 'none',
      borderRadius: '3px',
      position: 'relative',
      padding: '12px 30px',
      margin: '.3125rem 1px',
      fontSize: '12px',
      fontWeight: '400',
      textTransform: 'uppercase',
      letterSpacing: '0',
      willChange: 'box-shadow, transform',
      transition:
        'box-shadow 0.2s cubic-bezier(0.4, 0, 1, 1), background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      lineHeight: '1.42857143',
      textAlign: 'center',
      whiteSpace: 'nowrap',
      verticalAlign: 'middle',
      touchAction: 'manipulation',
      borderRadius: '30px',
    },
  };
});

export default cardsShowStyles;
