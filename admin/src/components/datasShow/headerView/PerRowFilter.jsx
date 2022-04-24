import PropTypes from 'prop-types';
import { forwardRef, Fragment, useState } from 'react';

import {
  Tooltip,
  IconButton,
  Popover,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { ViewColumn, Check } from '@mui/icons-material';
import cardsShowStyles from '../cards-show-styles';

const PerRowFilter = forwardRef((props, ref) => {
  const { t, gridNumberFunc, gridNumber } = props;
  const classes = cardsShowStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? 'per-row-popover' : undefined;
  const dispatch = useDispatch();
  const {  usersCardView } = useSelector((state) => state);

  return (
    <Fragment ref={ref}>
      {usersCardView && (
        <>
          <Tooltip title={t('perRow')} arrow placement='bottom'>
            <IconButton
              disableFocusRipple
              disableRipple
              onClick={(e) => {
                setAnchorEl(e.currentTarget);
              }}>
              <ViewColumn fontSize='small' />
            </IconButton>
          </Tooltip>
          <Popover
            elevation={18}
            disableScrollLock
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={() => {
              setAnchorEl(null);
            }}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}>
            <List
              className={classes.IconsList}
              component='nav'
              aria-label='Rows-menu'>
              {[2, 3, 4, 6, 12].map((list, index) => {
                const text =
                  list == 2
                    ? t('Six')
                    : list == 3
                    ? t('Four')
                    : list == 4
                    ? t('Three')
                    : list == 6
                    ? t('Two')
                    : t('One');
                return (
                  <Fragment key={index}>
                    <ListItem
                      disablePadding
                      onClick={() => {
                        gridNumberFunc(list)
                        setAnchorEl(null);
                      }}>
                      <ListItemButton>
                        <ListItemIcon>
                          {list == gridNumber && <Check color='primary' />}
                        </ListItemIcon>
                        <ListItemText
                          primary={text}
                          secondary={`${t('result')}`}
                        />
                      </ListItemButton>
                    </ListItem>
                    {index !== 4 && <Divider />}
                  </Fragment>
                );
              })}
            </List>
          </Popover>
        </>
      )}
    </Fragment>
  );
});

PerRowFilter.propTypes = {
  t: PropTypes.func.isRequired,
};

export default PerRowFilter;
