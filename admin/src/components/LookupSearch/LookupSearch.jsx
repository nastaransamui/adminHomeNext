import { useState, Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import lookupSearchStyle from './lookup-search-style';
import customerAvatar from '../../../public/images/faces/Customer.png';
import avatar from '../../../public/images/faces/avatar1.jpg';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Close from '@mui/icons-material/Close';
import { MuiTelInput } from 'mui-tel-input';
import { useSelector } from 'react-redux';

export function escapeRegExp(value) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

const getDataUrl = '/admin/api/autocomplete/lookup';

const LookupSearch = (props) => {
  const { columns, setMainData, originalData, _id, modelName, lookupFrom } =
    props;
  const classes = lookupSearchStyle();
  const { t } = useTranslation('common');
  const { adminAccessToken } = useSelector((state) => state);
  const [fieldValue, setFieldValue] = useState(columns[0]?.id);
  const [filterValue, setFilterValue] = useState('');
  const [dataOptions, setDataOptions] = useState([]);
  const [openField, setOpenField] = useState(false);
  let loadingField = openField && dataOptions.length === 0;
  const handleAutocomplete = (newValue) => {
    if (fieldValue !== 'phones') {
      setFilterValue(newValue !== null ? newValue[`${fieldValue}`] || '' : '');
    } else {
      setFilterValue(
        newValue !== null ? newValue[`${fieldValue}`][0].number || '' : ''
      );
    }
  };
  const getLabels = (dataOptions) => {
    switch (lookupFrom) {
      case 'agencies':
        return dataOptions.agentName;
      case 'users':
        return dataOptions.userName;
    }
  };

  const getData = async () => {
    const abortController = new AbortController();
    try {
      const res = await fetch(getDataUrl, {
        signal: abortController.signal,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token: `Brearer ${adminAccessToken}`,
        },
        body: JSON.stringify({
          modelName: modelName,
          lookupFrom: lookupFrom,
          fieldValue: fieldValue,
          filterValue: filterValue,
          _id: _id,
        }),
      });
      const { status } = res;
      const response = await res.json();
      if (status !== 200 && !response.success) {
        setDataOptions([
          {
            [`${fieldValue}`]: response.Error,
            emoji: '⚠️',
            error: true,
            _id: 0,
          },
        ]);
        if (!checkCookies('adminAccessToken')) {
          alertCall(theme, 'error', response.Error, () => {
            router.push('/', undefined, { shallow: true });
          });
        }
      } else {
        setMainData([...response.data]);
        setDataOptions([...response.data]);
      }
    } catch (error) {
      return undefined;
    }
  };

  const sleep = (delay = 0) => {
    return new Promise((resolve) => {
      setTimeout(resolve, delay);
    });
  };

  useEffect(() => {
    let isMount = true;
    if (isMount && filterValue !== '') {
      getData();
    }
    if (filterValue == '') {
      setDataOptions([]);
      setMainData(originalData);
    }
    return () => {
      isMount = false;
    };
  }, [filterValue]);

  const showValuesData = (dataOptions) => {
    switch (lookupFrom) {
      case 'agencies':
        if (typeof dataOptions[fieldValue] == 'number') {
          return (
            <>
              <img
                height={30}
                width={30}
                style={{ borderRadius: '50%' }}
                src={`${dataOptions.logoImage || customerAvatar.src}`}
                alt=''
              />
              &nbsp;&nbsp;&nbsp;
              {`${dataOptions.agentName} ${dataOptions[
                fieldValue
              ].toLocaleString()} ${dataOptions?.currencyCode}`}
            </>
          );
        }
        if (fieldValue !== 'phones') {
          return (
            <>
              <img
                height={30}
                width={30}
                style={{ borderRadius: '50%' }}
                src={`${dataOptions.logoImage || customerAvatar.src}`}
                alt=''
              />
              &nbsp;&nbsp;&nbsp;
              {`${dataOptions.agentName} ${dataOptions[fieldValue]}`}
            </>
          );
        } else {
          const phoneValue = dataOptions[fieldValue].map((a, i) => {
            return `${dataOptions.agentName} ${a.number} ${a.tags[0]} ${a.remark} \n`;
          });
          return (
            <>
              <img
                height={30}
                width={30}
                style={{ borderRadius: '50%' }}
                src={`${dataOptions.logoImage || customerAvatar.src}`}
                alt=''
              />
              &nbsp;&nbsp;&nbsp;
              {phoneValue}
            </>
          );
        }
      case 'users':
        return (
          <>
            <img
              height={30}
              width={30}
              style={{ borderRadius: '50%' }}
              src={`${dataOptions.profileImage || avatar.src}`}
              alt=''
            />
            &nbsp;&nbsp;&nbsp;
            {`${dataOptions[fieldValue]}`}
          </>
        );
    }
  };

  return (
    <Grid container sx={{ flex: '1 1 100%' }}>
      <Grid item xs={12} sm={12} md={3} lg={2} xl={2}>
        <FormControl
          sx={{ m: { xs: 0, sm: 0 }, minWidth: 180 }}
          fullWidth
          size='small'>
          <InputLabel className={classes.select} id='search-fields'>
            {t('Field')}
          </InputLabel>
          <Select
            labelId='search-fields-label'
            className={classes.textfield}
            id='search-fields'
            value={fieldValue}
            label={t('Field')}>
            {columns
              .filter((a) => a.id !== 'isActive')
              .map((d, i) => {
                return (
                  <MenuItem
                    key={i}
                    value={d.id}
                    onClick={(e) => {
                      setFieldValue(d.id);
                      setFilterValue('');
                    }}>
                    {t(`${d.label}`)}
                  </MenuItem>
                );
              })}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
        <FormControl
          sx={{
            m: { xs: 0, sm: 0 },
            ml: { xs: 0, sm: 0, md: 2, lg: 5 },
            mt: { xs: 1, sm: 1, md: 0 },
            minWidth: 180,
          }}
          fullWidth>
          <Autocomplete
            size='small'
            id='data-select'
            clearIcon=''
            options={dataOptions}
            loading={loadingField}
            loadingText={t('loadingField', { ns: 'common' })}
            noOptionsText={t('fieldNoOptions', { ns: 'common' })}
            inputValue={filterValue}
            autoHighlight
            onChange={(event, newValue) => {
              handleAutocomplete(newValue);
            }}
            open={openField}
            onOpen={() => {
              setOpenField(true);
            }}
            onClose={() => {
              setOpenField(false);
            }}
            getOptionLabel={(dataOptions) => getLabels(dataOptions)}
            getOptionDisabled={(dataOptions) => dataOptions.error}
            isOptionEqualToValue={(dataOptions, value) => {
              return dataOptions.name === value.name;
            }}
            filterOptions={(x, s) => {
              const searchRegex = new RegExp(escapeRegExp(filterValue), 'i');
              const filterdData = x.filter((row) => {
                if (fieldValue !== 'phones') {
                  return Object.keys(row).some((field) => {
                    if (row[field] !== null) {
                      return searchRegex.test(row[field].toString());
                    }
                  });
                } else {
                  return Object.keys(row).some((field) => {
                    if (row[field] !== null) {
                      if (field == 'phones') {
                        return row[field].map((a, i) => {
                          return searchRegex.test(a.number.toString());
                        });
                      }
                    }
                  });
                }
              });
              return filterdData;
            }}
            renderOption={(props, dataOptions) => (
              <Box component='li' {...props} key={dataOptions._id}>
                {showValuesData(dataOptions)}
              </Box>
            )}
            renderInput={(params) => {
              return (
                <>
                  {fieldValue !== 'phones' ? (
                    <TextField
                      {...params}
                      label={t('labelSearch')}
                      size="small"
                      className={classes.textfield}
                      value={filterValue}
                      onChange={(e) => {
                        setFilterValue(e.target.value);
                      }}
                      fullWidth
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <Fragment>
                            {loadingField ? (
                              <CircularProgress
                                color='primary'
                                size={10}
                                sx={{ mr: 4,p:0 }}
                              />
                            ) : (
                              filterValue !== '' && (
                                <IconButton
                                size='small'
                                  disableFocusRipple
                                  disableRipple
                                  disableTouchRipple
                                  onClick={() => {
                                    setFilterValue('');
                                  }}>
                                  <Close
                                    color='secondary'
                                    size={10}
                                    sx={{ mr: 2, p: 0 }}
                                  />
                                </IconButton>
                              )
                            )}
                            {params.InputProps.endAdornment}
                          </Fragment>
                        ),
                      }}
                    />
                  ) : (
                    <MuiTelInput
                      {...params}
                      label={t('labelSearch')}
                      className={classes.phone}
                      MenuProps={{
                        PaperProps: {
                          className: classes.phoneMenu,
                        },
                      }}
                      value={filterValue}
                      onChange={(e) => {
                        setFilterValue(e);
                      }}
                      fullWidth
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <Fragment>
                            {loadingField ? (
                              <CircularProgress
                                color='primary'
                                size={20}
                                sx={{ mr: 4 }}
                              />
                            ) : (
                              filterValue !== '' && (
                                <IconButton
                                  disableFocusRipple
                                  disableRipple
                                  disableTouchRipple
                                  onClick={() => {
                                    setFilterValue('');
                                  }}>
                                  <Close
                                    color='secondary'
                                    size={20}
                                    sx={{ mr: 2 }}
                                  />
                                </IconButton>
                              )
                            )}
                            {params.InputProps.endAdornment}
                          </Fragment>
                        ),
                      }}
                    />
                  )}
                </>
              );
            }}
          />
        </FormControl>
      </Grid>
    </Grid>
  );
};

LookupSearch.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      align: PropTypes.string.isRequired,
      disablePadding: PropTypes.bool.isRequired,
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      minWidth: PropTypes.number.isRequired,
      type: PropTypes.string.isRequired,
    }).isRequired
  ).isRequired,
  setMainData: PropTypes.func.isRequired,
  originalData: PropTypes.array.isRequired,
  _id: PropTypes.string.isRequired,
  modelName: PropTypes.string.isRequired,
  lookupFrom: PropTypes.string.isRequired,
};
export default LookupSearch;
