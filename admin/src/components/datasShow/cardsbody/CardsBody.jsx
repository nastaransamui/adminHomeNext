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
} from '@mui/icons-material';

import {
  Button,
  ClickAwayListener,
  Divider,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Box
} from '@mui/material';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/styles';
import { useSelector } from 'react-redux';

const CardsBody = forwardRef((props, ref) => {
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
    deleteAlert
  } = props;
  const { stringLimit, profile } = useSelector((state) => state);

  const theme = useTheme();
  const history = useHistory();
  const setBoxStyle = (index, expanded) => {
    return {
      bgcolor: theme.palette.background.paper,
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
    history.push({
      pathname: editUrl,
      search: `?_id=${_id}`,
    });
  };

  const primaryTextData = (data, label) => {
    if (typeof data[label] !== 'boolean') {
      if (data[label] == '') {
        return `${t('notDefine')}`;
      } else {
        // Validate date
        if (moment(data[label], moment.ISO_8601, true).isValid()) {
          return moment(data[label]).format('MMMM Do YYYY, H:mm');
        } else {
          if (data[label].length < stringLimit) {
            return data[label];
          } else {
            return rtlActive
              ? `... ${data[label].slice(0, stringLimit)}`
              : `${data[label].slice(0, stringLimit)} ...`;
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
  };

  return (
    <CardBody ref={ref}>
      <div className={classes.cardHoverUnder}>
        <Tooltip
          title={t('editTooltip')}
          placement='bottom'
          classes={{ tooltip: classes.tooltip }}>
          <Button color='primary' onClick={() => gotToEdit(data._id)}>
            <ArtTrack className={classes.underChartIcons} />
          </Button>
        </Tooltip>
        {modelName == 'Users' && data._id !== profile._id && (
          <Tooltip
            title={t('deleteTooltip')}
            placement='bottom'
            classes={{ tooltip: classes.tooltip }}>
            <Button
              color='error'
              onClick={() => {
                deleteAlert(data);
              }}>
              <DeleteForeverOutlined />
            </Button>
          </Tooltip>
        )}
      </div>
      <span
        style={{
          display: 'flex',
          flexDirection: rtlActive ? 'row-reverse' : 'row',
        }}>
        <h4 className={classes.cardProductTitle}>
          <Tooltip title={data.userName} placement='top' arrow>
            {/* Todo fix userName to global */}
            <a href='#' onClick={() => gotToEdit(data._id)}>
              {data.userName.length <= stringLimit
                ? data.userName
                : rtlActive
                ? `... ${data.userName.slice(0, stringLimit)}`
                : `${data.userName.slice(0, stringLimit)} ...`}
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
              primary={t('information')}
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
                    const { Icon, label } = item;
                    return (
                      <Tooltip title={t(`${label}`)} placement='top' key={label} arrow>
                      <ListItemButton
                        onClick={() => gotToEdit(data._id)}
                        
                        sx={dataFieldsSX}>
                          <ListItemIcon sx={{ color: 'inherit' }}>
                            <Icon style={iconStyle(i)} />
                          </ListItemIcon>
                        <ListItemText
                          primaryTypographyProps={{
                            fontSize: 14,
                            fontWeight: 'medium',
                          }}
                          primary={primaryTextData(data, label)}
                          style={{textAlign: rtlActive ? 'right' : 'left'}}
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

CardsBody.propTypes = {
  t: PropTypes.func.isRequired,
  rtlActive: PropTypes.bool.isRequired,
  expanded: PropTypes.object.isRequired,
  setExpanded: PropTypes.func.isRequired,
  editUrl: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
  dataFields: PropTypes.array.isRequired,
  modelName: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  deleteAlert: PropTypes.func.isRequired
};

export default CardsBody;
