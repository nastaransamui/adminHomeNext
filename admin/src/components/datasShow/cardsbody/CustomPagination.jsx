import { Grid, Pagination, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import { useDispatch } from 'react-redux';
import { setCookies } from 'cookies-next';

const CustomPagination = forwardRef((props, ref) => {
  const { pageNumber, total, perPage, setExpanded, loading, cardView, t, requestSearch } =
    props;
  const dispatch = useDispatch();
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
      {loading ? (
        <Grid item component='nav' style={{ height: 30, marginTop: 10 }} />
      ) : (
        <Grid item>
          <Pagination
            count={Math.ceil(total / perPage)}
            page={pageNumber}
            showLastButton
            showFirstButton
            boundaryCount={2}
            color='primary'
            onChange={(e, value) => {
              cardView && setExpanded({});
              requestSearch("")
              dispatch({ type: 'USERS_PAGE_NUMBER', payload: value });
              setCookies('usersPageNumber', value);
            }}
            siblingCount={1}
          />
        </Grid>
      )}
    </Grid>
  );
});

CustomPagination.propTypes = {
  pageNumber: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  perPage: PropTypes.number.isRequired,
};

export default CustomPagination;
