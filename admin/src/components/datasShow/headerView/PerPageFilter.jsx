import PropTypes from 'prop-types';
import { forwardRef, Fragment, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

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
import { FilterList, Check } from '@mui/icons-material';
import cardsShowStyles from '../cards-show-styles';

const PerPageFilter = forwardRef((props, ref) => {
  const { t, perPageFunc, perPage } = props;
  const classes = cardsShowStyles();
  const { perPageArray } = useSelector(
    (state) => state
  );

  const id = open ? 'perpage-popover' : undefined;

  const [anchor, setAnchor] = useState(null);
  const open = Boolean(anchor);

  const { usersCardView } = useSelector((state) => state);
  return (
    <Fragment ref={ref}>
      
        <>
          <Tooltip title={t('perPage', { ns: 'common' })} arrow placement='bottom'>
            <IconButton
              disableRipple
              disableFocusRipple
              onClick={(e) => {
                setAnchor(e.currentTarget);
              }}>
              <FilterList fontSize='small' />
            </IconButton>
          </Tooltip>
          <Popover
            elevation={18}
            disableScrollLock
            id={id}
            open={open}
            anchorEl={anchor}
            onClose={() => {
              setAnchor(null);
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
              dense
              component='nav'
              aria-label='Page-menu'>
              {perPageArray.map((list, index) => {
                const text =
                  list == 6
                    ? t('Six', { ns: 'common' })
                    : list == 12
                    ? t('Twelve', { ns: 'common' })
                    : list == 24
                    ? t('TwentyFour', { ns: 'common' })
                    : list == 48
                    ? t('FortyEight', { ns: 'common' })
                    : t('NinetySix', { ns: 'common' });
                return (
                  <Fragment key={index}>
                    <ListItem
                      disablePadding
                      onClick={() => {
                        //Change the number of page if current page number is higher that total page
                        perPageFunc(list)
                        setAnchor(null);
                      }}>
                      <ListItemButton>
                        <ListItemIcon>
                          {list == perPage && <Check color='primary' />}
                        </ListItemIcon>
                        <ListItemText primary={`${text}`} secondary={`${t('result', { ns: 'common' })}`}/>
                      </ListItemButton>
                    </ListItem>
                    {index !== 4 && <Divider />}
                  </Fragment>
                );
              })}
            </List>
          </Popover>
        </>
    </Fragment>
  );
});

PerPageFilter.propTypes = {
  t: PropTypes.func.isRequired,
};

export default PerPageFilter;
