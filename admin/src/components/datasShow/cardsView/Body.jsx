import { forwardRef, Fragment } from 'react';
import cardsShowStyles from '../cards-show-styles';
import CardBody from '../../Card/CardBody';

import { useHistory } from 'react-router-dom';
import moment from 'moment';
import {
  ArtTrack,
  Close,
  DeleteForeverOutlined,
  Done,
  KeyboardArrowDown,
  CheckBox,
  CheckBoxOutlineBlank,
  ToggleOff,
  ToggleOn,
} from '@mui/icons-material';

import {
  Button,
  ClickAwayListener,
  Divider,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Box,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/styles';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const Body = forwardRef((props, ref) => {
  const classes = cardsShowStyles();
  const {
    t,
    rtlActive,
    expanded,
    setExpanded,
    editUrl,
    data,
    dataFields,
    modelName,
    index,
    deleteAlert,
    activeAlert,
    diactiveAlert,
    gridNumber,
    activesId,
  } = props;
  const { stringLimit, profile } = useSelector((state) => state);

  const { i18n } = useTranslation();
  const lang = i18n.language == 'fa' ? 'fa' : 'en';
  const theme = useTheme();
  const history = useHistory();
  const setBoxStyle = (index, expanded) => {
    return {
      bgcolor: theme.palette.background.paper,
      top: gridNumber == 12 ? -30 : 0,
      borderRadius: `0px 0px 12px 12px`,
      pb: expanded[index] ? 2 : 0,
      position: expanded[index] ? 'absolute' : 'relative',
      right: 0,
      left: 0,
      zIndex: expanded[index] ? 4 : 1,
    };
  };

  const setItemButtonStyle = (index, expanded) => {
    return {
      px: 3,
      pt: 2.5,
      pb: expanded[index] ? 0 : 2.5,
      '&:hover, &:focus': {
        borderRadius: '0px 0px 12px 12px',
        '& svg': {
          opacity: expanded[index] ? 1 : 0,
        },
      },
    };
  };

  const primaryProps = {
    fontSize: 15,
    fontWeight: 'medium',
    lineHeight: '20px',
    mb: '2px',
    color: theme.palette.text.color,
  };

  const secondaryProps = {
    noWrap: true,
    fontSize: 12,
    lineHeight: '16px',
    color: theme.palette.text.color,
  };

  const dataFieldsSX = {
    py: 0,
    minHeight: 32,
    color: theme.palette.text.color,
  };

  const keyboardSx = (index, expanded) => {
    return {
      mr: -1,
      opacity: 0,
      transform: expanded[index] ? 'rotate(-180deg)' : 'rotate(0)',
      transition: '0.2s',
      color: theme.palette.text.color,
    };
  };

  const iconStyle = (index) => {
    return {
      color: theme.palette[`${index % 2 == 0 ? 'primary' : 'secondary'}`].main,
    };
  };

  const expandClicked = (index) => {
    setExpanded(() => ({
      [`${index}`]: !expanded[index],
    }));
  };

  const awayClicked = (index, expanded) => {
    if (expanded[index]) {
      setExpanded(() => ({
        [`${index}`]: !expanded[index],
      }));
    }
  };

  const gotToEdit = (_id) => {
    if (editUrl !== '') {
      if (modelName == 'Countries') {
        history.push({
          pathname: editUrl,
          search: `?country_id=${data?.id}`,
          state: data,
        });
      } else if (modelName == 'Currencies') {
        history.push({
          pathname: editUrl,
          search: `?currency_id=${data?._id}`,
          state: data,
        });
      } else if (modelName == 'Provinces') {
        history.push({
          pathname: editUrl,
          search: `?state_id=${data?.id}`,
          state: data,
        });
      } else if (modelName == 'Cities') {
        history.push({
          pathname: editUrl,
          search: `?city_id=${data?.id}`,
          state: data,
        });
        client_id;
      } else if (modelName == 'Agencies') {
        history.push({
          pathname: editUrl,
          search: `?client_id=${_id}`,
          state: data,
        });
      } else {
        history.push({
          pathname: editUrl,
          search: `?_id=${_id}`,
          state: data,
        });
      }
    }
  };

  const primaryTextData = (data, label, type) => {
    if (
      modelName !== 'Users' ||
      (data.facebook.length == 0 &&
        data.twitter.length == 0 &&
        data.google.length == 0)
    ) {
      if (typeof data[label] == 'object') {
        if (type == 'array') {
          return `${data[label][0].number}`;
        } else {
          return `${label}: ${data[label]?.length}`;
        }
      } else if (typeof data[label] !== 'boolean') {
        if (typeof data[label] !== 'number' && data[label] == '') {
          return `${t('notDefine')}`;
        } else {
          // Validate date
          if (
            moment(data[label], moment.ISO_8601, true).isValid() &&
            type !== 'number'
          ) {
            return moment(data[label]).format('MMMM Do YYYY, H:mm');
          } else {
            if (data[label]?.length < stringLimit) {
              return data[label];
            } else {
              return type == 'number'
                ? modelName == 'Agencies'
                  ? data.currencyCode + ' ' + data[label].toLocaleString()
                  : data[label]
                : type == 'string'
                ? data[label] == null
                  ? `${t('notDefine')}`
                  : rtlActive
                  ? `... ${data[label].slice(0, stringLimit)}`
                  : `${data[label].slice(0, stringLimit)} ...`
                : null;
            }
          }
        }
      } else {
        return data[label] ? (
          <Done style={{ color: theme.palette.success.main }} />
        ) : (
          <Close style={{ color: theme.palette.error.main }} />
        );
      }
    } else {
      console.log(data);
    }
  };

  const primaryTooltipData = (data, label, type) => {
    if (
      modelName !== 'Users' ||
      (data.facebook.length == 0 &&
        data.twitter.length == 0 &&
        data.google.length == 0)
    ) {
      if (typeof data[label] == 'object') {
        if (type == 'array' && modelName == 'Agencies') {
          return data[label].map((p, i) => {
            const keys = Object.keys(p);
            return (
              <Typography
                key={i}
                variant='subtitle1'
                sx={{
                  borderBottom:
                    i !== data[label].length - 1
                      ? `1px solid ${theme.palette.secondary.main}`
                      : 'none',
                }}>
                {t(`${keys[1]}`)}: {p.number}-{p.tags[0]}-{p.remark}
              </Typography>
            );
          });
        } else {
          return `${label}: ${data[label]?.length}`;
        }
      } else if (typeof data[label] !== 'boolean') {
        if (typeof data[label] !== 'number' && data[label] == '') {
          return `${t('notDefine')}`;
        } else {
          // Validate date
          if (
            moment(data[label], moment.ISO_8601, true).isValid() &&
            type !== 'number'
          ) {
            return moment(data[label]).format('MMMM Do YYYY, H:mm');
          } else {
            if (data[label]?.length < stringLimit) {
              return data[label];
            } else {
              return type == 'number'
                ? modelName == 'Agencies'
                  ? data.currencyCode + ' ' + data[label].toLocaleString()
                  : data[label]
                : type == 'string'
                ? data[label] == null
                  ? `${t('notDefine')}`
                  : data[label]
                : null;
            }
          }
        }
      } else {
        return data[label] ? (
          <Typography style={{ color: theme.palette.success.main }}>
            {t(`${label}`)}
          </Typography>
        ) : (
          <Typography style={{ color: theme.palette.error.main }}>
            {t(`${label}`)}
          </Typography>
        );
      }
    } else {
      console.log(data);
    }
  };

  const listIcons = (data, Icon, label, type, i) => {
    const showLabel =
      modelName == 'Cities' && label == 'name'
        ? t('cityName')
        : modelName == 'Cities' && label == 'id'
        ? t('cityid')
        : modelName == 'Provinces' && label == 'id'
        ? t('stateId')
        : modelName == 'Provinces' && label == 'name'
        ? t('stateName')
        : modelName == 'global_currencies' && label == 'name'
        ? t('country_name')
        : modelName == 'Currencies' && label == 'name'
        ? t('country_name')
        : t(`${label}`);
    if (type !== 'boolean') {
      return (
        <Box className={classes.expandIconBox}>
          <Icon style={iconStyle(i)} />
          <Typography variant='caption' display='block' gutterBottom>
            {t(`${showLabel}`)}
            {' :'}
          </Typography>
        </Box>
      );
    } else {
      if (data[label]) {
        return (
          <Box className={classes.expandIconBox}>
            <CheckBox style={iconStyle(i)} />
            <Typography variant='caption' display='block' gutterBottom>
              {t(`${showLabel}`)}
              {' :'}
            </Typography>
          </Box>
        );
      } else {
        return (
          <Box className={classes.expandIconBox}>
            <CheckBoxOutlineBlank style={iconStyle(i)} />
            <Typography variant='caption' display='block' gutterBottom>
              {t(`${showLabel}`)}
              {' :'}
            </Typography>
          </Box>
        );
      }
    }
  };

  return (
    <CardBody ref={ref}>
      <div className={classes.cardHoverUnder}>
        {activesId !== undefined ? (
          activesId.filter((e) => e.id == data.id).length > 0 ? (
            <Tooltip title={t('ToggleOff')} placement='bottom' arrow>
              <Button
                color='primary'
                onClick={() => {
                  diactiveAlert(data);
                }}>
                <ToggleOff style={{ color: theme.palette.success.main }} />
              </Button>
            </Tooltip>
          ) : (
            <Tooltip title={t('ToggleOn')} placement='bottom' arrow>
              <Button
                color='primary'
                onClick={() => {
                  activeAlert(data);
                }}>
                <ToggleOn style={{ color: theme.palette.error.main }} />
              </Button>
            </Tooltip>
          )
        ) : (
          editUrl !== '' && (
            <Tooltip title={t('editTooltip')} placement='bottom' arrow>
              <Button color='primary' onClick={() => gotToEdit(data._id)}>
                <ArtTrack className={classes.underChartIcons} />
              </Button>
            </Tooltip>
          )
        )}
        {modelName == 'Countries' || modelName == 'Currencies' ? (
          <Tooltip title={t('ToggleOff')} placement='bottom' arrow>
            <Button
              color='primary'
              onClick={() => {
                diactiveAlert(data);
              }}>
              <ToggleOff style={{ color: theme.palette.success.main }} />
            </Button>
          </Tooltip>
        ) : (modelName == 'Users' &&
            data._id !== profile._id &&
            editUrl !== '') ||
          modelName == 'Agencies' ? (
          <Tooltip title={t('deleteTooltip')} placement='bottom' arrow>
            <Button
              color='error'
              onClick={() => {
                deleteAlert(data);
              }}>
              <DeleteForeverOutlined />
            </Button>
          </Tooltip>
        ) : activesId !== undefined ? null : modelName !== 'Users' &&
          !data.isActive &&
          deleteAlert !== undefined ? (
          <Tooltip title={t('deleteTooltip')} placement='bottom' arrow>
            <Button
              color='error'
              onClick={() => {
                deleteAlert(data);
              }}>
              <DeleteForeverOutlined />
            </Button>
          </Tooltip>
        ) : null}
      </div>
      <span
        style={{
          display: 'flex',
          flexDirection:
            rtlActive && modelName == 'Users' ? 'row-reverse' : 'row',
          marginBottom: 20,
        }}>
        <h4 className={classes.cardProductTitle}>
          <Tooltip
            title={
              modelName == 'Users'
                ? data.userName
                : modelName == 'global_countries' || modelName == 'Countries'
                ? rtlActive
                  ? data?.translations?.fa
                  : data?.name
                : modelName == 'global_currencies' || modelName == 'Currencies'
                ? data?.currency_name
                : modelName == 'Provinces' || modelName == 'Cities'
                ? data?.name
                : modelName == 'Agencies'
                ? data?.agentName
                : data[`title_${lang}`]
            }
            placement='top'
            arrow>
            <a
              href=''
              onClick={(e) => {
                e.preventDefault();
                gotToEdit(data._id);
              }}>
              {modelName == 'Users'
                ? data.userName.length <= stringLimit
                  ? data.userName
                  : rtlActive
                  ? `... ${data.userName.slice(0, stringLimit)}`
                  : `${data.userName.slice(0, stringLimit)} ...`
                : modelName == 'global_countries' ||
                  modelName == 'Countries' ||
                  modelName == 'Provinces' ||
                  modelName == 'Cities'
                ? rtlActive
                  ? data?.translations?.fa || data?.name || t('information')
                  : data?.name
                : modelName == 'Agencies'
                ? data?.agentName
                : data[`title_${lang}`]}
            </a>
          </Tooltip>
        </h4>
      </span>
      <Divider />
      <Tooltip title={expanded[index] ? '' : t('expand')} placement='top' arrow>
        <Box sx={setBoxStyle(index, expanded)}>
          <ListItemButton
            alignItems='flex-start'
            onClick={() => expandClicked(index)}
            sx={setItemButtonStyle(index, expanded)}>
            <ListItemText
              primary={
                rtlActive
                  ? data?.translations?.fa || data?.name || t('information')
                  : modelName == 'global_currencies' ||
                    modelName == 'Currencies'
                  ? data?.currency_name
                  : data.name || t('information')
              }
              primaryTypographyProps={primaryProps}
              secondary={dataFields.map((e) => t(`${e.label}`)).join(', ')}
              secondaryTypographyProps={secondaryProps}
              sx={{ my: 0, textAlign: rtlActive ? 'right' : 'left' }}
            />
            <KeyboardArrowDown sx={keyboardSx(index, expanded)} />
          </ListItemButton>
          {expanded[index] && (
            <ClickAwayListener onClickAway={() => awayClicked(index, expanded)}>
              <span>
                {expanded[index] &&
                  dataFields.map((item, i) => {
                    const { Icon, label, type } = item;
                    return (
                      <Tooltip
                        title={primaryTooltipData(data, label, type)}
                        placement='top'
                        key={label}
                        arrow>
                        <ListItemButton
                          onClick={() => gotToEdit(data._id)}
                          sx={dataFieldsSX}>
                          <ListItemIcon sx={{ color: 'inherit' }}>
                            {/* <Icon style={iconStyle(i)} /> */}
                            {listIcons(data, Icon, label, type, i)}
                          </ListItemIcon>
                          <ListItemText
                            primaryTypographyProps={{
                              fontSize: 14,
                              fontWeight: 'medium',
                              lineHeight: 3.5,
                              noWrap: true,
                            }}
                            primary={primaryTextData(data, label, type)}
                            style={{
                              textAlign: rtlActive ? 'right' : 'left',
                              borderBottom: `1px solid ${theme.palette.primary.main}`,
                              minHeight: 50,
                            }}
                          />
                        </ListItemButton>
                      </Tooltip>
                    );
                  })}
              </span>
            </ClickAwayListener>
          )}
        </Box>
      </Tooltip>
    </CardBody>
  );
});

Body.propTypes = {
  t: PropTypes.func.isRequired,
  rtlActive: PropTypes.bool.isRequired,
  expanded: PropTypes.object.isRequired,
  setExpanded: PropTypes.func.isRequired,
  editUrl: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
  dataFields: PropTypes.array.isRequired,
  modelName: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  deleteAlert: PropTypes.func,
  activeAlert: PropTypes.func,
};

export default Body;
