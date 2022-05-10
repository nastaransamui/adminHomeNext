import { makeStyles } from '@mui/styles';
import {
  warningCardHeader,
  successCardHeader,
  dangerCardHeader,
  infoCardHeader,
  primaryCardHeader,
  roseCardHeader,
  darkCardHeader,
  grayColor,
} from '../../../theme/common';

const cardIconStyle = makeStyles((theme) => {
  return {
    cardIcon: {
      '&$warningCardHeader,&$successCardHeader,&$dangerCardHeader,&$infoCardHeader,&$primaryCardHeader,&$roseCardHeader,&$darkCardHeader':
        {
          borderRadius: 6,
          backgroundColor: grayColor[0],
          padding: '15px',
          marginTop: '-20px',
          marginRight: '15px',
          float: 'left',
        },
    },
    //Sample to use theme instead of colors
    warningCardHeader: warningCardHeader(theme.palette.warning),
    successCardHeader,
    dangerCardHeader,
    infoCardHeader,
    primaryCardHeader,
    roseCardHeader: roseCardHeader(theme.palette.primary),
    darkCardHeader,
  };
});
export default cardIconStyle;
