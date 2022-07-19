import { forwardRef, Fragment } from 'react';
import {
  Grid,
  IconButton,
  Autocomplete,
  TextField,
  CircularProgress,
  Box,
  InputLabel,
  MenuItem,
  Select,
  FormControl,
} from '@mui/material';

import cardsShowStyles from '../cards-show-styles.js';
import useDataSearch from '../../Hooks/useDataSearch.js';
import { MuiTelInput } from 'mui-tel-input';
import ReactPhoneInput from 'react-phone-input-material-ui';
import { useHistory } from 'react-router-dom';

import { Close } from '@mui/icons-material';

export function escapeRegExp(value) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

const MainSearch = forwardRef((props, ref) => {
  const classes = cardsShowStyles();
  const history = useHistory();
  const {
    showSearch,
    setShowSearch,
    dataGridColumns,
    t,
    modelName,
    state,
    setMainData,
  } = props;
  const {
    openField,
    setOpenField,
    loadingField,
    dataOptions,
    showValuesData,
    filterValue,
    fieldValue,
    setFilterValue,
    setFieldValue,
    getLabels,
    handleAutocomplete,
  } = useDataSearch(modelName, state, dataGridColumns, setMainData);

  return (
    <Grid
      className={classes.filterToolbar}
      style={{ justifyContent: 'space-between' }}>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={12} md={6} lg={2} xl={2}>
          <FormControl fullWidth>
            <InputLabel className={classes.select} id='search-fields'>
              {t('Field', { ns: 'common' })}
            </InputLabel>
            <Select
              labelId='search-fields-label'
              className={classes.textfield}
              id='search-fields'
              value={fieldValue}
              label={t('Field', { ns: 'common' })}>
              {dataGridColumns
                .filter((a) => a.searchAble)
                .map((d, i) => {
                  return (
                    <MenuItem
                      key={i}
                      value={d.field}
                      onClick={(e) => {
                        setFieldValue(d.field);
                        setFilterValue('');
                      }}>
                      {t(`${d.description}`)}
                    </MenuItem>
                  );
                })}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
          <Autocomplete
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
                      label={t('labelSearch', { ns: 'common' })}
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
                              <CircularProgress color='inherit' size={20} />
                            ) : (
                              filterValue !== '' && (
                                <IconButton
                                  disableFocusRipple
                                  disableRipple
                                  disableTouchRipple
                                  onClick={() => {
                                    setFilterValue('');
                                  }}>
                                  <Close color='secondary' size={20} />
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
                      // onlyCountries={['TH', 'IR', "US"]}
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
                              <CircularProgress color='primary' size={20} />
                            ) : (
                              filterValue !== '' && (
                                <IconButton
                                  disableFocusRipple
                                  disableRipple
                                  disableTouchRipple
                                  onClick={() => {
                                    setFilterValue('');
                                  }}>
                                  <Close color='secondary' size={20} />
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
        </Grid>
      </Grid>
      <Grid>
        <IconButton
          disableRipple
          disableFocusRipple
          onClick={() => {
            setMainData(state.dataArray);
            setShowSearch(!showSearch);
          }}>
          <Close color='primary' />
        </IconButton>
      </Grid>
    </Grid>
  );
});

MainSearch.propTypes = {
  // title: PropTypes.string.isRequired,
};

export default MainSearch;
