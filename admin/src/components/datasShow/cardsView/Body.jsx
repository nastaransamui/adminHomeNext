import { forwardRef, Fragment } from 'react';
import cardsShowStyles from '../cards-show-styles';
import CardBody from '../../Card/CardBody';

import { useHistory } from 'react-router-dom';
import moment from 'moment';
import ArtTrack from '@mui/icons-material/ArtTrack';
import Close from '@mui/icons-material/Close';
import DeleteForeverOutlined from '@mui/icons-material/DeleteForeverOutlined';
import Done from '@mui/icons-material/Done';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import CheckBox from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlank from '@mui/icons-material/CheckBoxOutlineBlank';
import ToggleOff from '@mui/icons-material/ToggleOff';
import ToggleOn from '@mui/icons-material/ToggleOn';
import SvgIcon from '@mui/material/SvgIcon';
import Button from '@mui/material/Button';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Divider from '@mui/material/Divider';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/styles';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Rating from '@mui/material/Rating';

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
    icon,
    deleteButtonDisabled,
    updateButtonDisabled,
    state,
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

  const labelSx = {
    lineHeight: 1.8,
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
      } else if (modelName == 'Agencies') {
        history.push({
          pathname: editUrl,
          search: `?client_id=${_id}`,
          state: data,
        });
      } else if (modelName == 'Roles') {
        history.push({
          pathname: editUrl,
          search: `?role_id=${_id}`,
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
          if (modelName !== 'Roles') {
            if (modelName == 'Countries') {
              return `${data[label].map(
                (e) => `${e?.gmtOffsetName}
                ${e?.tzName}`
              )}`;
            } else {
              return `${data[label][0].number}`;
            }
          } else {
            return `${data[label]?.length}`;
          }
        } else {
          if (modelName !== 'Roles') {
            return `${label}: ${data[label]?.length}`;
          } else {
            return `${data[label]?.length}`;
          }
        }
      } else if (typeof data[label] !== 'boolean') {
        if (typeof data[label] !== 'number' && data[label] == '') {
          return `${t('notDefine')}`;
        } else if (typeof data[label] == 'string' && type == 'rating') {
          return (
            <Rating name='read-only' value={parseInt(data[label])} readOnly />
          );
        } else {
          // Validate date
          if (
            moment(data[label], moment.ISO_8601, true).isValid() &&
            type !== 'number'
          ) {
            const formatedDate =
              modelName == 'Agencies'
                ? label == 'updatedAt'
                  ? moment(data[label]).format('MMMM Do YYYY, H:mm')
                  : moment(new Date(data[label].slice(0, -1))).format(
                      'MMMM Do YYYY, H:mm'
                    )
                : label == 'updatedAt'
                ? moment(data[label]).format('MMMM Do YYYY, H:mm')
                : moment(new Date(data[label].slice(0, -1))).format(
                    'MMMM Do YYYY, H:mm'
                  );
            return formatedDate;
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
                  ? `... ${data[label].slice(0, 10)}`
                  : `${data[label].slice(0, 10)} ...`
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
        } else if (type == 'array' && modelName == 'Countries') {
          return `${data[label].map(
            (e) => `${e?.gmtOffsetName}
            ${e?.tzName}`
          )}`;
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
          <Typography
            variant='caption'
            display='block'
            gutterBottom
            sx={labelSx}>
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
            <Typography
              variant='caption'
              display='block'
              gutterBottom
              sx={labelSx}>
              {t(`${showLabel}`)}
              {' :'}
            </Typography>
          </Box>
        );
      } else {
        return (
          <Box className={classes.expandIconBox}>
            <CheckBoxOutlineBlank style={iconStyle(i)} />
            <Typography
              variant='caption'
              display='block'
              gutterBottom
              sx={labelSx}>
              {t(`${showLabel}`)}
              {' :'}
            </Typography>
          </Box>
        );
      }
    }
  };

  return (
    <>
      {typeof icon !== 'undefined' ? (
        <CardBody pricing plain ref={ref}>
          <h6 className={classes.cardCategory}>{t(`${modelName}`)}</h6>
          <div className={classes.icon} style={{ marginBottom: 10 }}>
            <SvgIcon className={classes.iconPrimary}>
              <path d={`${data.icon}`} />
            </SvgIcon>
          </div>
          <Divider style={{ marginBottom: 20 }} />
          {dataFields.map((item, i) => {
            const { label, type } = item;
            return (
              <div
                key={i}
                className={`${classes.cardTitle} `}
                style={{
                  position: 'relative',
                  display: 'flex',
                }}>
                <div style={{ flex: 1, justifyContent: 'flex-start' }}>
                  {t(`${label}`)} :{' '}
                </div>
                <Tooltip
                  title={
                    label == 'remark' && data.remark.length > 10
                      ? data.remark
                      : ''
                  }
                  placement='bottom'
                  arrow>
                  <div style={{ flex: 1, justifyContent: 'flex-start' }}>
                    {primaryTextData(data, label, type)}
                  </div>
                </Tooltip>
              </div>
            );
          })}
          <Button
            color='primary'
            fullWidth
            variant='contained'
            disabled={updateButtonDisabled}
            className={classes.btnClasses}
            onClick={() => gotToEdit(data._id)}>
            {t('edit')}
          </Button>
          <Button
            color='secondary'
            fullWidth
            disabled={deleteButtonDisabled}
            onClick={() => deleteAlert(data)}
            variant='contained'
            className={classes.btnClasses}>
            {t('delete')}
          </Button>
        </CardBody>
      ) : (
        <CardBody ref={ref}>
          <div className={classes.cardHoverUnder}>
            {activesId !== undefined ? (
              activesId.filter((e) => {
                switch (modelName) {
                  case 'HotelsList':
                    return (
                      e._id[state.SortBy.field] == data[state.SortBy.field]
                    );
                  default:
                    return e.id == data.id;
                }
              }).length > 0 ? (
                <Tooltip
                  title={t('ToggleOff', { ns: 'common' })}
                  placement='bottom'
                  arrow>
                  <span>
                    <Button
                      color='primary'
                      disabled={deleteButtonDisabled}
                      onClick={() => {
                        diactiveAlert(data);
                      }}>
                      <ToggleOff
                        style={{
                          color: deleteButtonDisabled
                            ? theme.palette.text.disabled
                            : theme.palette.success.main,
                        }}
                      />
                    </Button>
                  </span>
                </Tooltip>
              ) : (
                <Tooltip
                  title={t('ToggleOn', { ns: 'common' })}
                  placement='bottom'
                  arrow>
                  <span>
                    <Button
                      disabled={deleteButtonDisabled}
                      color='primary'
                      onClick={() => {
                        activeAlert(data);
                      }}>
                      <ToggleOn
                        style={{
                          color: deleteButtonDisabled
                            ? theme.palette.text.disabled
                            : theme.palette.error.main,
                        }}
                      />
                    </Button>
                  </span>
                </Tooltip>
              )
            ) : (
              editUrl !== '' && (
                <Tooltip
                  title={t('editTooltip', { ns: 'common' })}
                  placement='bottom'
                  arrow>
                  <span>
                    <Button
                      color='primary'
                      onClick={() => gotToEdit(data._id)}
                      disabled={updateButtonDisabled}>
                      <ArtTrack className={classes.underChartIcons} />
                    </Button>
                  </span>
                </Tooltip>
              )
            )}
            {modelName == 'Countries' || modelName == 'Currencies' ? (
              <Tooltip
                title={t('ToggleOff', { ns: 'common' })}
                placement='bottom'
                arrow>
                <span>
                  <Button
                    color='primary'
                    disabled={deleteButtonDisabled}
                    onClick={() => {
                      diactiveAlert(data);
                    }}>
                    <ToggleOff
                      style={{
                        color: deleteButtonDisabled
                          ? theme.palette.text.disabled
                          : theme.palette.success.main,
                      }}
                    />
                  </Button>
                </span>
              </Tooltip>
            ) : modelName == 'Hotels' ? (
              <Fragment>
                {data.isActive ? (
                  <Tooltip
                    title={t('ToggleOn', { ns: 'common' })}
                    placement='bottom'
                    arrow>
                    <span>
                      <Button
                        disabled={deleteButtonDisabled}
                        color='primary'
                        onClick={() => {
                          activeAlert(data);
                        }}>
                        <ToggleOn
                          style={{
                            color: deleteButtonDisabled
                              ? theme.palette.text.disabled
                              : theme.palette.error.main,
                          }}
                        />
                      </Button>
                    </span>
                  </Tooltip>
                ) : (
                  <Tooltip
                    title={t('ToggleOff', { ns: 'common' })}
                    placement='bottom'
                    arrow>
                    <span>
                      <Button
                        color='primary'
                        disabled={deleteButtonDisabled}
                        onClick={() => {
                          diactiveAlert(data);
                        }}>
                        <ToggleOff
                          style={{
                            color: deleteButtonDisabled
                              ? theme.palette.text.disabled
                              : theme.palette.success.main,
                          }}
                        />
                      </Button>
                    </span>
                  </Tooltip>
                )}
              </Fragment>
            ) : (modelName == 'Users' &&
                data._id !== profile._id &&
                editUrl !== '') ||
              modelName == 'Agencies' ? (
              <Tooltip
                title={t('deleteTooltip', { ns: 'common' })}
                placement='bottom'
                arrow>
                <span>
                  <Button
                    color='error'
                    disabled={deleteButtonDisabled}
                    onClick={() => {
                      deleteAlert(data);
                    }}>
                    <DeleteForeverOutlined />
                  </Button>
                </span>
              </Tooltip>
            ) : activesId !== undefined ? null : modelName !== 'Users' &&
              !data.isActive &&
              deleteAlert !== undefined ? (
              <Tooltip
                title={t('deleteTooltip', { ns: 'common' })}
                placement='bottom'
                arrow>
                <span>
                  <Button
                    disabled={deleteButtonDisabled}
                    color='error'
                    onClick={() => {
                      deleteAlert(data);
                    }}>
                    <DeleteForeverOutlined />
                  </Button>
                </span>
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
                    : modelName == 'global_countries' ||
                      modelName == 'Countries'
                    ? rtlActive
                      ? data?.translations?.fa
                      : data?.name
                    : modelName == 'global_currencies' ||
                      modelName == 'Currencies'
                    ? data?.currency_name
                    : modelName == 'Provinces' || modelName == 'Cities'
                    ? data?.name
                    : modelName == 'Agencies'
                    ? data?.agentName
                    : modelName == 'Roles'
                    ? data?.roleName
                    : modelName == 'Hotels'
                    ? data?.hotelName
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
          <Tooltip
            title={expanded[index] ? '' : t('expand')}
            placement='top'
            arrow>
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
                <ClickAwayListener
                  onClickAway={() => awayClicked(index, expanded)}>
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
      )}
    </>
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
