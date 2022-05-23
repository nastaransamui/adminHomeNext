import PropTypes from 'prop-types';
import { forwardRef, Fragment } from 'react';

import {
  Tooltip,
  IconButton,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import cardsShowStyles from '../cards-show-styles';

const ShowSearchData = forwardRef((props, ref) => {
  const { t, showSearch, setShowSearch  } = props;
  const classes = cardsShowStyles();

  return (
    <Fragment ref={ref}>
      <>
        <Tooltip title={t('searchData')} arrow placement='bottom'>
          <IconButton
            disableRipple
            disableFocusRipple
            onClick={() => {
              setShowSearch(!showSearch);
            }}>
            <Search fontSize='small' />
          </IconButton>
        </Tooltip>
      </>
    </Fragment>
  );
});

ShowSearchData.propTypes = {
  t: PropTypes.func.isRequired,
  setShowSearch: PropTypes.func.isRequired,
};

export default ShowSearchData;
