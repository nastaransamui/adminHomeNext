import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Popper,
  Paper,
  Typography,
  Badge,
  Tooltip,
} from '@mui/material';
import avatar from '../../../../public/images/faces/avatar1.jpg';
import customerAvatar from '../../../../public/images/faces/Customer.png';
import { Close, Done } from '@mui/icons-material';
import {
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarColumnsButton,
} from '@mui/x-data-grid';
import moment from 'moment';
import { format } from 'date-fns';
import { useTheme } from '@mui/styles';
import { styled } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Player } from 'video-react';
import YouTube from 'react-youtube';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Stack, InputLabel, TextField } from '@mui/material';
import { MobileDateTimePicker } from '@mui/x-date-pickers';
function isOverflown(element) {
  return (
    element?.scrollHeight > element?.clientHeight ||
    element?.scrollWidth > element?.clientWidth
  );
}
const GridCellExpand = React.memo(function GridCellExpand(props) {
  const { width, value } = props;
  const wrapper = React.useRef(null);
  const cellDiv = React.useRef(null);
  const cellValue = React.useRef(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [showFullCell, setShowFullCell] = React.useState(false);
  const [showPopper, setShowPopper] = React.useState(false);
  const theme = useTheme();
  const { stringLimit } = useSelector((state) => state);

  const handleMouseEnter = () => {
    const isCurrentlyOverflown = isOverflown(cellValue.current);
    setShowPopper(isCurrentlyOverflown);
    setAnchorEl(cellDiv.current);
    setShowFullCell(true);
  };

  const handleMouseLeave = () => {
    setShowFullCell(false);
  };

  React.useEffect(() => {
    if (!showFullCell) {
      return undefined;
    }

    function handleKeyDown(nativeEvent) {
      // IE11, Edge (prior to using Bink?) use 'Esc'
      if (nativeEvent.key === 'Escape' || nativeEvent.key === 'Esc') {
        setShowFullCell(false);
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [setShowFullCell, showFullCell]);

  return (
    <Box
      ref={wrapper}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{
        alignItems: 'center',
        lineHeight: '24px',
        width: 1,
        height: 1,
        position: 'relative',
        display: 'flex',
      }}>
      <Box
        ref={cellDiv}
        sx={{
          height: 1,
          width,
          display: 'block',
          position: 'absolute',
          top: 0,
        }}
      />
      <Box
        ref={cellValue}
        sx={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: 'flex',
          alignItems:
            value !== '' && isOverflown(cellValue.current) ? 'left' : 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          width: '100%',
        }}>
        {value == '' ? (
          <Close style={{ color: theme.palette.error.main }} />
        ) : (
          value
        )}
      </Box>
      {showPopper && (
        <Popper
          open={showFullCell && anchorEl !== null}
          anchorEl={anchorEl}
          style={{ width }}>
          <Paper
            elevation={1}
            style={{ minHeight: wrapper.current.offsetHeight - 3 }}>
            <Typography variant='body2' style={{ padding: 8 }}>
              {value}
            </Typography>
          </Paper>
        </Popper>
        // <Tooltip arrow title={value}>
        //   <Typography variant='body2' style={{ padding: 8 }}>
        //     {value}
        //   </Typography>
        // </Tooltip>
      )}
    </Box>
  );
});

GridCellExpand.propTypes = {
  value: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
};

export const RenderCellExpand = (params) => {
  return (
    <>
      {typeof params.value == 'string' ? (
        <GridCellExpand
          value={params.value || ''}
          width={params.colDef.computedWidth}
        />
      ) : (
        <span
          style={{
            width: params.colDef.computedWidth,
            display: 'flex',
            justifyContent: 'center',
          }}>
          {params.type !== 'number'
            ? params.value
            : params?.row?.currencyCode + ' ' + params.value.toLocaleString()}
        </span>
      )}
    </>
  );
};

export const RenderCellBoolean = (params) => {
  const theme = useTheme();
  return (
    <span
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        width: '100%',
      }}>
      {params.value ? (
        <Done style={{ color: theme.palette.success.main }} />
      ) : (
        <Close style={{ color: theme.palette.error.main }} />
      )}
    </span>
  );
};

export const RenderCellDate = (params) => {
  let formatDate = params.formattedValue;
  switch (params.modelName) {
    case 'Agencies':
      return (
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            width: '100%',
          }}>
          {params.field == 'updatedAt'
            ? moment(params.formattedValue).format('MMMM Do YYYY, H:mm')
            : moment(new Date(params.formattedValue.slice(0, -1))).format(
                'MMMM Do YYYY, H:mm'
              )}
        </span>
      );
    default:
      return (
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            width: '100%',
          }}>
          {params.field == 'updatedAt'
            ? moment(params.formattedValue).format('MMMM Do YYYY, H:mm')
            : moment(new Date(params.formattedValue.slice(0, -1))).format(
                'MMMM Do YYYY, H:mm'
              )}
        </span>
      );
  }
  // return (

  // );
};

export const RenderCellAvatar = (params) => {
  const theme = useTheme();
  const { stringLimit, profile } = useSelector((state) => state);
  const { i18n } = useTranslation();
  const rtlActive = i18n.language == 'fa';
  const lang = i18n.language == 'fa' ? 'fa' : 'en';
  const { dataGridColumns, modelName, row, activesId, formattedValue } = params;
  const Image = () => {
    if (modelName == 'Users') {
      return (
        <img
          style={{ height: 40, width: 40, borderRadius: '50%' }}
          src={row.profileImage || avatar.src}
          alt='...'
        />
      );
    } else if (modelName == 'Agencies') {
      return (
        <img
          style={{ height: 40, width: 40, borderRadius: '50%' }}
          src={row[dataGridColumns[0].hasAvatar[1]] || customerAvatar.src}
          alt='...'
        />
      );
    } else if (
      modelName == 'global_countries' ||
      modelName == 'Countries' ||
      modelName == 'Provinces' ||
      modelName == 'Cities' ||
      modelName == 'global_currencies' ||
      modelName == 'Currencies'
    ) {
      return (
        <img
          style={{ height: 40, width: 40, borderRadius: '50%' }}
          src={`/admin/flags/128x128/${
            row[dataGridColumns[0].hasAvatar[1]]
          }.png`}
          alt='...'
        />
      );
    } else {
      return (
        <img
          style={{ height: 40, width: 40, borderRadius: '50%' }}
          src={
            (dataGridColumns[0].hasAvatar[0] &&
              row[dataGridColumns[0].hasAvatar[1]]) ||
            avatar.src
          }
          alt='...'
        />
      );
    }
  };

  const badgeColor = () => {
    if (modelName == 'Users') {
      return 'secondary';
    } else if (
      modelName == 'global_countries' ||
      modelName == 'global_currencies'
    ) {
      if (activesId.filter((e) => e.id == params.id).length > 0) {
        return 'secondary';
      } else {
        return 'primary';
      }
    } else if (
      modelName == 'Countries' ||
      modelName == 'Provinces' ||
      modelName == 'Cities' ||
      modelName == 'Currencies'
    ) {
      return 'secondary';
    } else {
      if (row.isActive) {
        return 'secondary';
      } else {
        return 'primary';
      }
    }
  };

  return (
    <span
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        width: '100%',
      }}>
      <Badge
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        color={badgeColor()}
        variant='dot'
        badgeContent=' '
        overlap='circular'
        invisible={params.modelName == 'Users' && params.id !== profile._id}>
        <Image />
      </Badge>
      {modelName == 'Users'
        ? formattedValue.length <= stringLimit
          ? formattedValue
          : rtlActive
          ? `... ${formattedValue.slice(0, stringLimit)}`
          : `${formattedValue.slice(0, stringLimit)} ...`
        : modelName == 'global_countries' || modelName == 'Countries'
        ? rtlActive
          ? `${row?.translations?.fa} / ${row?.name}`
          : row?.name
        : modelName == 'Provinces' || modelName == 'Cities'
        ? row?.name
        : modelName == 'Agencies'
        ? row?.agentName
        : modelName == 'global_currencies' || modelName == 'Currencies'
        ? row?.currency_name
        : row[`title_${lang}`]}
    </span>
  );
};

export const RenderCellVideo = (params) => {
  const { modelName, row, rtlActive } = params;
  const badgeColor = () => {
    if (modelName == 'Users') {
      return 'secondary';
    } else {
      if (row.isActive) {
        return 'secondary';
      } else {
        return 'primary';
      }
    }
  };

  if (params.field.includes('youTube')) {
    if (row.youTubeId !== '') {
      return (
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
          }}>
          <Avatar>
            <YouTube
              videoId={row.youTubeId}
              opts={{ playerVars: { autoplay: 1 } }}
            />
          </Avatar>
          <Typography>{row.youTubeId}</Typography>
        </span>
      );
    } else {
      return <RenderCellExpand modelName={modelName} {...params} />;
    }
  } else {
    return (
      <Tooltip
        title={row.title_en}
        placement={rtlActive ? 'right' : 'left'}
        arrow>
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            width: '100%',
          }}>
          <Badge
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            color={badgeColor()}
            variant='dot'
            badgeContent=' '
            overlap='circular'>
            <Avatar>
              <Player
                autoPlay
                aspectRatio='auto'
                ref={(player) => {
                  // console.log(player);
                }}
                fluid={false}
                preload='auto'
                muted
                src={row.videoLink || row.featureLink}
              />
            </Avatar>
          </Badge>
          <Typography>{row.title_en}</Typography>
        </span>
      </Tooltip>
    );
  }
};

export const RenderArrayTotal = (params) => {
  return (
    <span
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        width: '100%',
      }}>
      {params?.row[params?.field]?.length}
    </span>
  );
};

export const RenderArray = (params) => {
  const { type, row } = params;
  if (params?.field == 'timezones') {
    const timeZoneArray = params?.row[params?.field].map(
      (e) => `${e?.gmtOffsetName}
      ${e?.tzName}`
    );
    return (
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          width: '100%',
        }}>
        <GridCellExpand
          value={timeZoneArray.join(' ') || ''}
          width={params.colDef.computedWidth}
        />
      </span>
    );
  } else {
    return (
      <Tooltip title={tooltipData(params)} placement='top' arrow>
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            width: '100%',
          }}>
          {row[[params?.field][0]][0].number}
        </span>
      </Tooltip>
    );
  }
};

const tooltipData = (params) => {
  const theme = useTheme();
  const { type, row } = params;
  const { t } = params;

  if (type == 'array') {
    return row[params?.field].map((p, i) => {
      const keys = Object.keys(p);
      return (
        <Typography
          key={i}
          variant='subtitle1'
          sx={{
            borderBottom:
              i !== row[params?.field].length - 1
                ? `1px solid ${theme.palette.secondary.main}`
                : 'none',
          }}>
          {t(`${keys[1]}`)}: {p.number}-{p.tags[0]}-{p.remark}
        </Typography>
      );
    });
  }
};

const StyledGridOverlay = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  '& .ant-empty-img-1': {
    fill: theme.palette.mode === 'light' ? '#aeb8c2' : '#262626',
  },
  '& .ant-empty-img-2': {
    fill: theme.palette.mode === 'light' ? '#f5f5f7' : '#595959',
  },
  '& .ant-empty-img-3': {
    fill: theme.palette.mode === 'light' ? '#dce0e6' : '#434343',
  },
  '& .ant-empty-img-4': {
    fill: theme.palette.mode === 'light' ? '#fff' : '#1c1c1c',
  },
  '& .ant-empty-img-5': {
    fillOpacity: theme.palette.mode === 'light' ? '0.8' : '0.08',
    fill: theme.palette.mode === 'light' ? '#f5f5f5' : '#fff',
  },
}));

export const CustomNoRowsOverlay = () => {
  const { t } = useTranslation('users');
  return (
    <StyledGridOverlay>
      <svg
        width='120'
        height='100'
        viewBox='0 0 184 152'
        aria-hidden
        focusable='false'>
        <g fill='none' fillRule='evenodd'>
          <g transform='translate(24 31.67)'>
            <ellipse
              className='ant-empty-img-5'
              cx='67.797'
              cy='106.89'
              rx='67.797'
              ry='12.668'
            />
            <path
              className='ant-empty-img-1'
              d='M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z'
            />
            <path
              className='ant-empty-img-2'
              d='M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z'
            />
            <path
              className='ant-empty-img-3'
              d='M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zM42.94 49.767h49.713a2.262 2.262 0 1 1 0 4.524H42.94a2.262 2.262 0 0 1 0-4.524zM42.94 61.53h49.713a2.262 2.262 0 1 1 0 4.525H42.94a2.262 2.262 0 0 1 0-4.525zM121.813 105.032c-.775 3.071-3.497 5.36-6.735 5.36H20.515c-3.238 0-5.96-2.29-6.734-5.36a7.309 7.309 0 0 1-.222-1.79V69.675h26.318c2.907 0 5.25 2.448 5.25 5.42v.04c0 2.971 2.37 5.37 5.277 5.37h34.785c2.907 0 5.277-2.421 5.277-5.393V75.1c0-2.972 2.343-5.426 5.25-5.426h26.318v33.569c0 .617-.077 1.216-.221 1.789z'
            />
          </g>
          <path
            className='ant-empty-img-3'
            d='M149.121 33.292l-6.83 2.65a1 1 0 0 1-1.317-1.23l1.937-6.207c-2.589-2.944-4.109-6.534-4.109-10.408C138.802 8.102 148.92 0 161.402 0 173.881 0 184 8.102 184 18.097c0 9.995-10.118 18.097-22.599 18.097-4.528 0-8.744-1.066-12.28-2.902z'
          />
          <g className='ant-empty-img-4' transform='translate(149.65 15.383)'>
            <ellipse cx='20.654' cy='3.167' rx='2.849' ry='2.815' />
            <path d='M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z' />
          </g>
        </g>
      </svg>
      <Box sx={{ mt: 1 }}>{t('noRow')}</Box>
    </StyledGridOverlay>
  );
};

export const CustomToolbar = () => {
  return (
    <GridToolbarContainer sx={{ pt: 1, pb: 1 }}>
      <GridToolbarFilterButton />
      <GridToolbarColumnsButton />
      <GridToolbarDensitySelector />
    </GridToolbarContainer>
  );
};

export const DateFilters = (props) => {
  const [date, setDate] = useState(new Date());
  const { item, applyValue } = props;
  const { t } = useTranslation('users');
  const handleFilterChange = (date) => {
    const value = moment(date).format('YYYY-MM-DDTHH:mm:ss.SSSSZ');
    setDate(value);
    applyValue({ ...item, value: value });
  };
  return (
    <div>
      <InputLabel htmlFor={`-select`} shrink={true}>
        {t(`${props.item.columnField}`)}
      </InputLabel>
      <div style={{ paddingTop: 16 }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Stack spacing={3}>
            <MobileDateTimePicker
              allowSameDateSelection
              inputFormat='MMMM do yyyy, H:mm'
              ampm
              ampmInClock
              value={date}
              onChange={(date) => handleFilterChange(date)}
              renderInput={(params) => (
                <TextField variant='standard' {...params} />
              )}
            />
          </Stack>
        </LocalizationProvider>
      </div>
    </div>
  );
};
