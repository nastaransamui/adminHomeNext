import { makeStyles } from '@mui/styles';
import {
  cardTitle,
  tooltip,
  successColor,
  grayColor,
} from '../../../theme/common';
const mainStyles = makeStyles((theme) => {
  return {
    tooltip,
    MainDashboard: {
      flex: 4,
      padding: 10,
      color: theme.palette.text.color,
    },
    homeWidgets: {
      display: 'flex',
      margin: 20,
      flexWrap: 'wrap',
      color: theme.palette.text.color,
    },
    cardCategory: {
      color: theme.palette.text.color,
      fontSize: '14px',
      paddingTop: '10px',
      marginBottom: '0',
      marginTop: '0',
      margin: '0',
    },
    cardTitle: {
      ...cardTitle,
      marginTop: '0px',
      marginBottom: '3px',
    },
    dangerText: {
      color: theme.palette.error.main + ' !important',
    },
    stats: {
      color: theme.palette.text.color,
      fontSize: '12px',
      lineHeight: '22px',
      display: 'inline-flex',
      '& svg': {
        position: 'relative',
        top: '4px',
        width: '16px',
        height: '16px',
        marginRight: '3px',
      },
      '& .fab,& .fas,& .far,& .fal,& .material-icons': {
        position: 'relative',
        top: '4px',
        fontSize: '16px',
        marginRight: '3px',
      },
    },
    cardIconTitle: {
      ...cardTitle,
      marginTop: '15px',
      marginBottom: '0px',
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
    underChartIcons: {
      width: '17px',
      height: '17px',
    },
    upArrowCardCategory: {
      width: 14,
      height: 14,
    },
    successText: {
      color: successColor[0],
    },
    cardProductTitle: {
      ...cardTitle,
      marginTop: '0px',
      marginBottom: '3px',
      textAlign: 'center',
    },
    cardProductDesciprion: {
      textAlign: 'center',
      color: grayColor[0],
    },
    price: {
      color: theme.palette.text.color,
      '& h4': {
        marginBottom: '0px',
        marginTop: '0px',
      },
    },
    productStats: {
      paddingTop: '7px',
      paddingBottom: '7px',
      margin: '0',
    },
  };
});

export default mainStyles;
