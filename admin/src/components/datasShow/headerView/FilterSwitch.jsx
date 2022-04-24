import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import cardsShowStyles from '../cards-show-styles';
import { Grid, Switch } from '@mui/material';
import { styled } from '@mui/material/styles';

import { useDispatch, useSelector } from 'react-redux';

import { setCookies } from 'cookies-next';

const cardViewIcon = 'M3 9h4V5H3v4zm0 5h4v-4H3v4zm5 0h4v-4H8v4zm5 0h4v-4h-4v4zM8 9h4V5H8v4zm5-4v4h4V5h-4zm5 9h4v-4h-4v4zM3 19h4v-4H3v4zm5 0h4v-4H8v4zm5 0h4v-4h-4v4zm5 0h4v-4h-4v4zm0-14v4h4V5h-4z'
const tableViewIcon = 'M21 8H3V4h18v4zm0 2H3v4h18v-4zm0 6H3v4h18v-4z'
export const Android12Switch = styled(Switch, {
  shouldForwardProp: (prop) => prop
})(({ theme, firsticon, secondicon }) => {
  return {
    padding: 8,
    '& .MuiSwitch-track': {
      borderRadius: 22 / 2,
      '&:before, &:after': {
        content: '""',
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        width: 16,
        height: 16,
      },
      '&:before': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
          theme.palette.primary.main
        )}" d="${firsticon}"/></svg>')`,
        left: 12,
      },
      '&:after': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
          theme.palette.primary.main
        )}" d="${secondicon}" /></svg>')`,
        right: 12,
      },
    },
    '& .MuiSwitch-thumb': {
      boxShadow: 'none',
      width: 16,
      height: 16,
      margin: 2,
    },
  };
});

const FilterSwitch = forwardRef((props, ref) => {
  const { t, cardViewsFunc } = props;
  const classes = cardsShowStyles();
  const dispatch = useDispatch();
  const { usersCardView } = useSelector((state) => state);
  return (
    <Grid
      ref={ref}
      component='label'
      container
      className={classes.toolbarSwitch}>
      <Grid item>{t('tableview')}</Grid>
      <Grid item>
        <Android12Switch
          color={usersCardView ? 'secondary' : 'primary'}
          firsticon={cardViewIcon}
          secondicon={tableViewIcon}
          checked={usersCardView}
          onChange={() => {
            cardViewsFunc()
          }}
          value={t('tableview')}
          inputProps={{ 'aria-label': 'checkbox' }}
        />
      </Grid>
      <Grid item>{t('cardview')}</Grid>
    </Grid>
  );
});

FilterSwitch.propTypes = {
  t: PropTypes.func.isRequired,
};

export default FilterSwitch;
