import PropTypes from 'prop-types';
import { forwardRef, useState, Fragment } from 'react';
import cardsShowStyles from '../cards-show-styles';

import {
  Tooltip,
  IconButton,
  Popover,
  List,
  ListItem,
  ListItemButton,
  Divider,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import { Sort, ArrowRight, ArrowLeft, Check } from '@mui/icons-material';
import { useTheme } from '@mui/styles';

const SortBy = forwardRef((props, ref) => {
  const classes = cardsShowStyles();
  const {
    t,
    rtlActive,
    dataFields,
    sortByFunc,
    sortByValues,
    cardView,
    modelName,
  } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? 'sort-by-popover' : undefined;

  const [anchorSTl, setAnchorSTl] = useState({
    0: null,
  });
  const theme = useTheme();

  return (
    <Fragment ref={ref}>
        <>
          <Tooltip title={t('sortBy')} arrow placement='bottom'>
            <IconButton
              disableRipple
              disableFocusRipple
              onClick={(e) => {
                setAnchorEl(e.currentTarget);
              }}>
              <Sort fontSize='small' />
            </IconButton>
          </Tooltip>
          <Popover
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
              aria-label='Page-menu'>
              {dataFields.map((fields, index) => {
                const { Icon, filterable } = fields;
                if (filterable) {
                  return (
                    <Fragment key={index}>
                      <ListItem
                        disablePadding
                        className={classes.listItemHover}
                        onClick={() => {}}>
                        <ListItemButton
                          onClick={(e) => {
                            setAnchorSTl((prev) => ({
                              0: e.currentTarget,
                              filed: fields.label,
                            }));
                          }}>
                          <ListItemIcon>
                            <Tooltip title={t('filterType')}>
                              <IconButton
                                size='large'
                                disableFocusRipple
                                disableRipple>
                                {rtlActive ? (
                                  <ArrowRight
                                    className={
                                      classes.listItemHoverSmallArrowRight
                                    }
                                  />
                                ) : (
                                  <ArrowLeft
                                    className={
                                      classes.listItemHoverSmallArrowLeft
                                    }
                                  />
                                )}
                              </IconButton>
                            </Tooltip>
                            <Icon
                              style={{
                                color:
                                  theme.palette[
                                    `${
                                      index % 2 == 0 ? 'primary' : 'secondary'
                                    }`
                                  ].main,
                              }}
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              modelName == 'Provinces' && fields.label == 'name'
                                ? t('provinceName')
                                : modelName == 'Cities' &&
                                  fields.label == 'name'
                                ? t('cityName')
                                : modelName == 'global_currencies'  &&
                                  fields.label == 'name'
                                ? t('country_name')
                                : modelName == 'Currencies'  &&
                                  fields.label == 'name'
                                ? t('country_name')
                                : modelName == 'Cities' && fields.label == 'id'
                                ? t('cityId')
                                : t(`${fields.label}`)
                            }
                          />
                        </ListItemButton>
                      </ListItem>
                    </Fragment>
                  );
                }
              })}
            </List>
          </Popover>
          {anchorSTl[0] !== null && (
            <Popover
              elevation={18}
              id={id}
              open={open}
              anchorEl={anchorSTl[0]}
              onClose={(e) => {
                setAnchorSTl((prev) => ({
                  0: null,
                }));
              }}
              anchorOrigin={{
                vertical: 'center',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 52,
                horizontal: rtlActive ? -205 : 220,
              }}>
              <List
                sx={{
                  bgcolor: 'background.paper',
                  boxShadow: 1,
                  borderRadius: 2,
                  p: 0,
                  minWidth: 220,
                  maxWidth: 220,
                  overflow: 'visible',
                  '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 60,
                    right: rtlActive ? 214 : -4,
                    width: 10,
                    height: 10,
                    bgcolor: theme.palette.primary.main,
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                }}
                dense
                disablePadding
                component='nav'
                aria-label='menu'>
                {['ASC', 'DESC'].map((list, index) => {
                  return (
                    <Fragment key={index}>
                      <ListItem
                        disablePadding
                        disableGutters={true}
                        dense
                        onClick={() => {
                          sortByFunc(
                            anchorSTl[`filed`],
                            list == 'ASC' ? 1 : -1
                          );

                          setAnchorEl(null);
                          setAnchorSTl({
                            0: null,
                          });
                        }}>
                        <ListItemButton>
                          <ListItemIcon>
                            {sortByValues.field == anchorSTl[`filed`] &&
                            ((sortByValues.sorting == 1 && list == 'ASC') ||
                              (sortByValues.sorting == -1 &&
                                list == 'DESC')) ? (
                              <Check color='primary' />
                            ) : null}
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              modelName == 'Provinces' &&
                              anchorSTl[`filed`] == 'name'
                                ? t('provinceName')
                                : modelName == 'Cities' &&
                                  anchorSTl[`filed`] == 'name'
                                ? t('cityName')
                                : modelName == 'Cities' &&
                                  anchorSTl[`filed`] == 'id'
                                ? t('cityid')
                                : t(`${anchorSTl[`filed`]}`)
                            }
                            secondary={t(`${list}`)}
                          />
                        </ListItemButton>
                      </ListItem>
                      {index !== 1 && <Divider />}
                    </Fragment>
                  );
                })}
              </List>
            </Popover>
          )}
        </>
    </Fragment>
  );
});

SortBy.propTypes = {
  t: PropTypes.func.isRequired,
  rtlActive: PropTypes.bool.isRequired,
  dataFields: PropTypes.array.isRequired,
};

export default SortBy;
