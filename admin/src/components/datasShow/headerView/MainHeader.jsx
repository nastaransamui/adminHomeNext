import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import { Container, Grid } from '@mui/material';
import FilterSwitch from './FilterSwitch.jsx';

import cardsShowStyles from '../cards-show-styles.js';

import { styled } from '@mui/material/styles';
import FilterTextSearch from './FilterTextSearch.jsx';
import FilterIcons from './FilterIcons.jsx';
import CreateNew from './CreateNew.jsx';

const StyledBox = styled(Container)(({ theme }) => ({
  padding: 10,
  border: '3px solid ',
  borderColor: theme.palette.primary.main,
  borderRadius: 5,
}));

const MainHeader = forwardRef((props, ref) => {
  const classes = cardsShowStyles();

  return (
    <StyledBox ref={ref} maxWidth='xl'>
      <Grid className={classes.filterToolbar}>
        <FilterSwitch {...props} />
        <FilterTextSearch {...props} />
        <FilterIcons {...props} />
        <CreateNew {...props} />
      </Grid>
    </StyledBox>
  );
});

MainHeader.propTypes = {
  // title: PropTypes.string.isRequired,
};

export default MainHeader;
