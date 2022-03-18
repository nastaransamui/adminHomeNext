import { makeStyles } from '@mui/styles';
import {
  cardTitle,
  tooltip,
  successColor,
  dangerColor,
} from '../../../theme/common';
const thirdStyle = makeStyles((theme) => {
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
    cardTitle: {
      ...cardTitle,
      marginTop: '0px',
      marginBottom: '3px',
    },
    cardCategory: {
      color: theme.palette.text.color,
      fontSize: '14px',
      paddingTop: '10px',
      marginBottom: '0',
      marginTop: '0',
      margin: '0',
    },
    dangerText: {
      color: theme.palette.error.main + ' !important',
    },
    successText: {
      color: successColor[0],
    },
    upArrowCardCategory: {
      width: 14,
      height: 14,
    },
    failedText: {
      color: dangerColor[0],
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

export default thirdStyle;
