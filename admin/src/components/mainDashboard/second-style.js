import { makeStyles } from '@mui/styles';
import { cardTitle } from '../../../theme/common';
const secondStyle = makeStyles((theme) => {
  return {
    cardIconTitle: {
      ...cardTitle,
      marginTop: '15px',
      marginBottom: '0px',
    },
  };
});

export default secondStyle;
