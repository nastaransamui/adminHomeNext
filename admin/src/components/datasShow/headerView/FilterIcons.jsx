import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import cardsShowStyles from '../cards-show-styles';
import { Grid } from '@mui/material';
import PerPageFilter from './PerPageFilter';
import PerRowFilter from './PerRowFilter';
import SortBy from './SortBy';
import CsvExport from './CsvExport';
import ShowSearchData from './ShowSearchData';

const FilterIcons = forwardRef((props, ref) => {
  const classes = cardsShowStyles();
  const { modelName } = props;
  return (
    <Grid ref={ref} container className={classes.Icon}>
      {modelName == 'Users' ||
      modelName == 'global_countries' ||
      modelName == 'Countries' ||
      modelName == 'Provinces' ||
      modelName == 'Cities' ? (
        <CsvExport {...props} />
      ) : null}
      <ShowSearchData {...props} />
      <PerPageFilter {...props} />
      <PerRowFilter {...props} />
      <SortBy {...props} />
    </Grid>
  );
});

FilterIcons.propTypes = {
  // title: PropTypes.string.isRequired,
};

export default FilterIcons;
