import { makeStyles } from '@mui/styles';
import { cardTitle, tooltip, grayColor } from '../../../theme/common';

const forthStyle = makeStyles((theme) => {
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
    underChartIcons: {
      width: '17px',
      height: '17px',
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
  };
});

export default forthStyle;
