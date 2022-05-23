import PropTypes from 'prop-types';
import { forwardRef } from 'react';

import { Grid, IconButton, TextField } from '@mui/material';
import {  useSelector } from 'react-redux';

import cardsShowStyles from '../cards-show-styles.js';

import { FindInPage, Clear } from '@mui/icons-material';

const FilterTextSearch = forwardRef((props, ref) => {
  const classes = cardsShowStyles();
  const { t,searchText, requestSearch } = props;
  const { usersCardView } = useSelector((state) => state);

  return (
    <Grid container className={classes.toolbarText}>
      {
          <TextField
          autoComplete='off'
            variant='standard'
            value={searchText}
            onChange={(event) => requestSearch(event.target.value)}
            placeholder={`${t('search')}`}
            fullWidth
            sx={{
              m: (theme) => theme.spacing(1, 0.5, 1.5),
              '& .MuiSvgIcon-root': {
                mr: 0.5,
              },
              '& .MuiInput-underline:before': {
                borderBottom: 1,
                borderColor: 'divider',
              },
            }}
            InputProps={{
              startAdornment: <FindInPage fontSize='small' />,
              endAdornment: (
                <IconButton
                  title={`${t('clear')}`}
                  aria-label='Clear'
                  size='small'
                  style={{
                    visibility: searchText ? 'visible' : 'hidden',
                  }}
                  onClick={() => {
                    requestSearch('');
                  }}>
                  <Clear fontSize='small' />
                </IconButton>
              ),
            }}
          />
      }
    </Grid>
  );
});

FilterTextSearch.propTypes = {
  t: PropTypes.func.isRequired,
  requestSearch: PropTypes.func.isRequired,
  searchText: PropTypes.string.isRequired
};

export default FilterTextSearch;
