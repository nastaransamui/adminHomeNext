import { makeStyles } from '@mui/styles';
import { cardTitle } from '../../../theme/common';
const firstStyle = makeStyles((theme) => {
  return {
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
  };
});

export default firstStyle;
