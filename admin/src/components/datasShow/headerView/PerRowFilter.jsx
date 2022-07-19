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
  const { t, gridNumberFunc, gridNumber, cardView } = props;
  const classes = cardsShowStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? 'per-row-popover' : undefined;
  const dispatch = useDispatch();
 

  return (
    <Fragment ref={ref}>
      {cardView && (
        <>
          <Tooltip title={t('perRow', { ns: 'common' })} arrow placement='bottom'>
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
                    ? t('Six', { ns: 'common' })
                    : list == 3
                    ? t('Four', { ns: 'common' })
                    : list == 4
                    ? t('Three', { ns: 'common' })
                    : list == 6
                    ? t('Two', { ns: 'common' })
                    : t('One', { ns: 'common' });
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
                          secondary={`${t('result', { ns: 'common' })}`}
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
