import { Grid, Pagination as MuiPagination, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import { useSelector } from 'react-redux';

const Pagination = forwardRef((props, ref) => {
  const {
    pageNumber,
    total,
    perPage,
    setExpanded,
    cardView,
    t,
    requestSearch,
    paginationChange,
  } = props;
  const { adminFormSubmit } = useSelector((state) => state);
  return (
    <Grid
      ref={ref}
      container
      spacing={1}
      direction='column'
      justifyContent='center'
      alignItems='center'
      sx={{ pb: 2, pt: 2 }}>
      <Grid item>
        <Typography>
          {t('Page')}: {pageNumber}
        </Typography>
      </Grid>
      {adminFormSubmit ? (
        <Grid item component='nav' style={{ height: 30, marginTop: 10 }} />
      ) : (
        <Grid item>
          <MuiPagination
            count={Math.ceil(total / perPage)}
            page={pageNumber}
            showLastButton
            showFirstButton
            boundaryCount={2}
            color='primary'
            onChange={(e, value) => {
              cardView && setExpanded({});
              requestSearch('');
              paginationChange(value);
            }}
            siblingCount={1}
          />
        </Grid>
      )}
    </Grid>
  );
});

Pagination.propTypes = {
  pageNumber: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  perPage: PropTypes.number.isRequired,
};

export default Pagination;
