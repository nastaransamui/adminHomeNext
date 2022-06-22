import { Fragment } from 'react';
import agencyStyle from './agency-style';
import customerAvatar from '../../../../public/images/faces/Customer.png';
import avatar from '../../../../public/images/faces/avatar1.jpg';
import {
  ArrowBack,
  ArrowForward,
  Delete,
  Add,
  Remove,
} from '@mui/icons-material';

import Card from '../../Card/Card';
import CardBody from '../../Card/CardBody';
import CardHeader from '../../Card/CardHeader';
import CardIcon from '../../Card/CardIcon';
import CardAvatar from '../../Card/CardAvatar';
import {
  Container,
  Grid,
  Fab,
  IconButton,
  Button,
  useTheme,
  MenuItem,
  Tooltip,
  Autocomplete,
  Box,
  CircularProgress,
} from '@mui/material';

import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import {
  ValidatorForm,
  TextValidator,
  SelectValidator,
} from 'react-material-ui-form-validator';

import { useQuery } from '../../../pages/dashboard/ReactRouter';
import agencyHook from './agencyHook';
import { pushUrl } from './agencyStatic';
import PhoneInput from '../../PhoneInput/PhoneInput';
import NumberInput from '../../NumberInput/NumberInput';

export function escapeRegExp(value) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

export default function Agency(props) {
  const { rtlActive } = props;
  let query = useQuery();
  const client_id = query.get('client_id');
  const classes = agencyStyle();
  const { t, i18n } = useTranslation('agencies');
  const theme = useTheme();
  const history = useHistory();
  const lang = i18n.language == 'fa' ? 'fa' : 'en';
  const {
    values,
    setValues,
    handleChange,
    logoImageBlob,
    uploadImage,
    deleteImage,
    formSubmit,
    handleAutocomplete,
    openCity,
    setOpenCity,
    openProvince,
    setOpenProvince,
    openCountry,
    setOpenCountry,
    openAm,
    setOpenAm,
    openCurrency,
    setOpenCurrency,
    loadingCity,
    loadingProvince,
    loadingCountry,
    loadingAm,
    loadingCurrency,
    cityOptions,
    provinceOptions,
    countryOptions,
    amOptions,
    currencyOptions,
    sleep,
    setCountryFilter,
    setProvinceFilter,
    setCityFilter,
    setAmFilter,
    setCurrencyFilter,
    getCities,
    countryPhoneCode,
    setCountryPhoneCode,
    numbersRef,
    phoneTags,
    phoneNumberError,
    setPhoneNumberError,
  } = agencyHook();

  return (
    <Container style={{ marginTop: 10, minHeight: '78vh' }} maxWidth='xl'>
      <Fragment>
        <Tooltip title={t('goBack')} arrow placement='bottom'>
          <IconButton
            onClick={() => {
              history.push(pushUrl);
            }}>
            {rtlActive ? <ArrowForward /> : <ArrowBack />}
          </IconButton>
        </Tooltip>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={8}>
            <Card>
              <CardHeader color='rose' icon>
                <CardIcon color='rose' style={{ cursor: 'pointer' }}>
                  <input
                    type='file'
                    id='logoImageBlob'
                    name='logoImage'
                    hidden
                    onChange={(e) => {
                      uploadImage(e);
                    }}
                    accept='image/png, image/jpeg'
                  />
                  <Tooltip
                    title={
                      logoImageBlob == '' ? t('uploadlogo') : t('changelogo')
                    }
                    arrow>
                    {logoImageBlob == '' ? (
                      <label htmlFor='logoImageBlob'>
                        <img
                          src={customerAvatar.src}
                          alt='..'
                          className={classes.smallAvatar}
                        />
                      </label>
                    ) : (
                      <label htmlFor='logoImageBlob'>
                        <img
                          src={logoImageBlob}
                          alt='..'
                          className={classes.smallAvatar}
                        />
                      </label>
                    )}
                  </Tooltip>
                </CardIcon>
                <span className={classes.deleteIcon}>
                  <h4 className={classes.cardIconTitle}>
                    {t('editAgent')} - <small>{t('completeAgent')} </small>
                  </h4>
                  {logoImageBlob !== '' && (
                    <Tooltip title={t('deleteLogo')} arrow>
                      <IconButton
                        onClick={() => {
                          deleteImage();
                        }}
                        style={{ marginTop: 10 }}
                        disableRipple>
                        <Delete color='error' />
                      </IconButton>
                    </Tooltip>
                  )}
                </span>
              </CardHeader>
              <ValidatorForm
                onSubmit={formSubmit}
                onError={(errors) => {
                  for (let index = 0; index < errors.length; index++) {
                    const element = errors[index];
                    if (
                      element.props.id !== undefined &&
                      !isNaN(Number(element.props.id))
                    ) {
                      const phoneIndex = Number(element.props.id);
                      phoneNumberError[phoneIndex][phoneIndex] = true;
                      setPhoneNumberError((prevState) => [...prevState]);
                    }
                  }
                }}>
                <CardBody>
                  <Grid container spacing={3} style={{ marginTop: 10 }}>
                    <Grid item xs={12} sm={12} md={2}>
                      <SelectValidator
                        className={classes.input}
                        autoComplete='off'
                        label={t('isActive')}
                        onClick={handleChange('isActive')}
                        value={
                          values.isActive ? t('isActive') : t('isNotActive')
                        }
                        name='isActive'
                        variant='standard'
                        validators={['required']}
                        errorMessages={[t('required')]}
                        fullWidth>
                        {[t('isActive'), t('isNotActive')].map((d, i) => {
                          return (
                            <MenuItem key={i} value={d}>
                              {d}
                            </MenuItem>
                          );
                        })}
                      </SelectValidator>
                    </Grid>
                    <Grid item xs={12} sm={12} md={2}>
                      <TextValidator
                        className={classes.input}
                        InputProps={{
                          style: {
                            WebkitTextFillColor: theme.palette.text.color,
                          },
                        }}
                        label={t('agentId')}
                        disabled={client_id !== null}
                        fullWidth
                        onChange={handleChange('agentId')}
                        value={values.agentId}
                        name='agentId'
                        variant='standard'
                        validators={['required']}
                        errorMessages={[t('required')]}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={3}>
                      <TextValidator
                        className={classes.input}
                        label={t('agentName')}
                        onChange={handleChange('agentName')}
                        value={values.agentName}
                        name='agentName'
                        variant='standard'
                        validators={['required']}
                        errorMessages={[t('required')]}
                        fullWidth
                        InputProps={{
                          style: {
                            WebkitTextFillColor: theme.palette.text.color,
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={5}>
                      <TextValidator
                        className={classes.input}
                        fullWidth
                        label={t('agentEmail')}
                        onChange={handleChange('email')}
                        value={values.email}
                        name='email'
                        variant='standard'
                        validators={['required', 'isEmail']}
                        errorMessages={[t('required'), t('emailRequire')]}
                        InputProps={{
                          style: {
                            WebkitTextFillColor: theme.palette.text.color,
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={3} style={{ marginTop: 10 }}>
                    <Grid item xs={12} sm={12} md={6}>
                      <TextValidator
                        className={classes.input}
                        InputProps={{
                          style: {
                            WebkitTextFillColor: theme.palette.text.color,
                          },
                        }}
                        fullWidth
                        label={t('address')}
                        onChange={handleChange('address')}
                        value={values.address}
                        name='address'
                        variant='standard'
                      />
                    </Grid>

                    <Grid item xs={12} sm={12} md={6}>
                      <Autocomplete
                        id='user-select'
                        options={amOptions}
                        loading={loadingAm}
                        loadingText={t('loadingUsers')}
                        autoHighlight
                        inputValue={values.accountManager}
                        onChange={(event, newValue) => {
                          handleAutocomplete('accountManager', newValue);
                        }}
                        open={openAm}
                        onOpen={() => {
                          setOpenAm(true);
                        }}
                        onClose={() => {
                          setOpenAm(false);
                        }}
                        getOptionLabel={(amOptions) => amOptions.userName}
                        getOptionDisabled={(amOptions) => amOptions.error}
                        isOptionEqualToValue={(amOptions, value) =>
                          amOptions.label === value.label
                        }
                        filterOptions={(x) => {
                          const searchRegex = new RegExp(
                            escapeRegExp(values.accountManager),
                            'i'
                          );
                          const filterdData = x.filter((row) => {
                            return Object.keys(row).some((field) => {
                              if (row[field] !== null) {
                                return searchRegex.test(row[field].toString());
                              }
                            });
                          });
                          return filterdData;
                        }}
                        renderOption={(props, amOptions) => (
                          <Box component='li' {...props} key={amOptions._id}>
                            <img
                              height={30}
                              width={30}
                              style={{ borderRadius: '50%' }}
                              src={`${amOptions.profileImage || avatar.src}`}
                              alt=''
                            />
                            &nbsp;&nbsp;&nbsp;
                            {`${amOptions.userName}`}
                          </Box>
                        )}
                        renderInput={(params) => (
                          <TextValidator
                            {...params}
                            label={t('accountManager')}
                            variant='standard'
                            value={values.accountManager}
                            validators={['required']}
                            errorMessages={[t('required')]}
                            onBlur={() => {
                              if (
                                amOptions
                                  .map((a) => a.userName)
                                  .indexOf(values.accountManager) == -1
                              ) {
                                setValues({ ...values, accountManager: '' });
                              }
                            }}
                            onChange={(e) => {
                              setValues({
                                ...values,
                                accountManager: e.target.value,
                              });
                              (async () => {
                                await sleep(1e3); // For demo purposes.
                                setAmFilter(e.target.value);
                              })();
                            }}
                            className={classes.inputAutocomplete}
                            fullWidth
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <Fragment>
                                  {loadingAm ? (
                                    <CircularProgress
                                      color='inherit'
                                      size={20}
                                    />
                                  ) : null}
                                  {params.InputProps.endAdornment}
                                </Fragment>
                              ),
                            }}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={3} style={{ marginTop: 10 }}>
                    <Grid item xs={12} sm={12} md={3}>
                      <Autocomplete
                        id='city-select'
                        options={cityOptions}
                        loading={loadingCity}
                        loadingText={t('loadingCity')}
                        noOptionsText={t('cityNoOptions')}
                        inputValue={values.cityName}
                        autoHighlight
                        onChange={(event, newValue) => {
                          handleAutocomplete('cityName', newValue);
                        }}
                        open={openCity}
                        onOpen={() => {
                          setOpenCity(true);
                        }}
                        onClose={() => {
                          setOpenCity(false);
                        }}
                        getOptionLabel={(cityOptions) => cityOptions.name}
                        getOptionDisabled={(cityOptions) => cityOptions.error}
                        isOptionEqualToValue={(cityOptions, value) => {
                          return cityOptions.name === value.name;
                        }}
                        filterOptions={(x, s) => {
                          const searchRegex = new RegExp(
                            escapeRegExp(values.cityName),
                            'i'
                          );
                          const filterdData = x.filter((row) => {
                            return Object.keys(row).some((field) => {
                              if (row[field] !== null) {
                                return searchRegex.test(row[field].toString());
                              }
                            });
                          });
                          return filterdData;
                        }}
                        renderOption={(props, cityOptions) => (
                          <Box component='li' {...props} key={cityOptions.id}>
                            {cityOptions.emoji} {cityOptions.name}{' '}
                            {cityOptions.state_name} {cityOptions.iso2}
                          </Box>
                        )}
                        renderInput={(params) => (
                          <TextValidator
                            {...params}
                            label={t('cityName')}
                            variant='standard'
                            value={values.cityName}
                            validators={['required']}
                            errorMessages={[t('required')]}
                            onBlur={() => {
                              if (
                                cityOptions
                                  .map((a) => a.name)
                                  .indexOf(values.cityName) == -1
                              ) {
                                setValues({
                                  ...values,
                                  cityName: '',
                                  city_id: '',
                                });
                              }
                            }}
                            onChange={(e) => {
                              setValues({
                                ...values,
                                cityName: e.target.value,
                              });
                              (async () => {
                                await sleep(1e3); // For demo purposes.
                                setCityFilter(e.target.value);
                              })();
                            }}
                            className={classes.inputAutocomplete}
                            fullWidth
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <Fragment>
                                  {loadingCity ? (
                                    <CircularProgress
                                      color='inherit'
                                      size={20}
                                    />
                                  ) : null}
                                  {params.InputProps.endAdornment}
                                </Fragment>
                              ),
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={3}>
                      <Autocomplete
                        id='province-select'
                        disablePortal
                        options={provinceOptions}
                        loading={loadingProvince}
                        loadingText={t('loadingProvince')}
                        inputValue={values.provinceName}
                        autoHighlight
                        onChange={(event, newValue) => {
                          handleAutocomplete('provinceName', newValue);
                        }}
                        open={openProvince}
                        onOpen={() => {
                          setOpenProvince(true);
                        }}
                        onClose={() => {
                          setOpenProvince(false);
                        }}
                        getOptionLabel={(provinceOptions) =>
                          provinceOptions.name
                        }
                        getOptionDisabled={(provinceOptions) =>
                          provinceOptions.error
                        }
                        isOptionEqualToValue={(provinceOptions, value) =>
                          provinceOptions.label === value.label
                        }
                        filterOptions={(x) => {
                          const searchRegex = new RegExp(
                            escapeRegExp(values.provinceName),
                            'i'
                          );
                          const filterdData = x.filter((row) => {
                            return Object.keys(row).some((field) => {
                              if (row[field] !== null) {
                                return searchRegex.test(row[field].toString());
                              }
                            });
                          });
                          return filterdData;
                        }}
                        renderOption={(props, provinceOptions) => (
                          <Box
                            component='li'
                            {...props}
                            key={provinceOptions.id}>
                            {provinceOptions.emoji} {provinceOptions.name}{' '}
                            {provinceOptions.iso2}
                          </Box>
                        )}
                        renderInput={(params) => (
                          <TextValidator
                            {...params}
                            label={t('provinceName')}
                            variant='standard'
                            value={values.provinceName}
                            validators={['required']}
                            errorMessages={[t('required')]}
                            onBlur={() => {
                              if (
                                provinceOptions
                                  .map((a) => a.name)
                                  .indexOf(values.provinceName) == -1
                              ) {
                                setValues({
                                  ...values,
                                  provinceName: '',
                                  province_id: '',
                                });
                              }
                            }}
                            onChange={(e) => {
                              setValues({
                                ...values,
                                provinceName: e.target.value,
                              });
                              (async () => {
                                await sleep(1e3); // For demo purposes.
                                setProvinceFilter(e.target.value);
                              })();
                            }}
                            className={classes.inputAutocomplete}
                            fullWidth
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <Fragment>
                                  {loadingProvince ? (
                                    <CircularProgress
                                      color='inherit'
                                      size={20}
                                    />
                                  ) : null}
                                  {params.InputProps.endAdornment}
                                </Fragment>
                              ),
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={3}>
                      <Autocomplete
                        id='country-select'
                        options={countryOptions}
                        loading={loadingCountry}
                        loadingText={t('loadingCountry')}
                        autoHighlight
                        inputValue={values.countryName}
                        onChange={(event, newValue) => {
                          handleAutocomplete('countryName', newValue);
                        }}
                        open={openCountry}
                        onOpen={() => {
                          setOpenCountry(true);
                        }}
                        onClose={() => {
                          setOpenCountry(false);
                        }}
                        getOptionLabel={(countryOptions) => countryOptions.name}
                        getOptionDisabled={(countryOptions) =>
                          countryOptions.error
                        }
                        isOptionEqualToValue={(countryOptions, value) =>
                          countryOptions.label === value.label
                        }
                        filterOptions={(x) => {
                          const searchRegex = new RegExp(
                            escapeRegExp(values.countryName),
                            'i'
                          );
                          const filterdData = x.filter((row) => {
                            return Object.keys(row).some((field) => {
                              if (row[field] !== null) {
                                return searchRegex.test(row[field].toString());
                              }
                            });
                          });
                          return filterdData;
                        }}
                        renderOption={(props, countryOptions) => (
                          <Box
                            component='li'
                            {...props}
                            key={countryOptions.id}>
                            {countryOptions.emoji} {countryOptions.name}{' '}
                            {countryOptions.iso2}
                          </Box>
                        )}
                        renderInput={(params) => (
                          <TextValidator
                            {...params}
                            label={t('countryName')}
                            variant='standard'
                            value={values.countryName}
                            validators={['required']}
                            errorMessages={[t('required')]}
                            onBlur={() => {
                              if (
                                countryOptions
                                  .map((a) => a.name)
                                  .indexOf(values.countryName) == -1
                              ) {
                                setValues({
                                  ...values,
                                  countryName: '',
                                  country_id: '',
                                });
                              }
                            }}
                            onChange={(e) => {
                              setValues({
                                ...values,
                                countryName: e.target.value,
                              });
                              (async () => {
                                await sleep(1e3); // For demo purposes.
                                setCountryFilter(e.target.value);
                              })();
                            }}
                            className={classes.inputAutocomplete}
                            fullWidth
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <Fragment>
                                  {loadingCountry ? (
                                    <CircularProgress
                                      color='inherit'
                                      size={20}
                                    />
                                  ) : null}
                                  {params.InputProps.endAdornment}
                                </Fragment>
                              ),
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={3}>
                      <Autocomplete
                        id='currency-select'
                        options={currencyOptions}
                        loading={loadingCurrency}
                        loadingText={t('loadingCurrency')}
                        autoHighlight
                        inputValue={values.currencyCode}
                        onChange={(event, newValue) => {
                          handleAutocomplete('currencyCode', newValue);
                        }}
                        open={openCurrency}
                        onOpen={() => {
                          setOpenCurrency(true);
                        }}
                        onClose={() => {
                          setOpenCurrency(false);
                        }}
                        getOptionLabel={(currencyOptions) =>
                          currencyOptions.currency
                        }
                        getOptionDisabled={(currencyOptions) =>
                          currencyOptions.error
                        }
                        isOptionEqualToValue={(currencyOptions, value) =>
                          currencyOptions.label === value.label
                        }
                        filterOptions={(x) => {
                          const searchRegex = new RegExp(
                            escapeRegExp(values.currencyCode),
                            'i'
                          );
                          const filterdData = x.filter((row) => {
                            return Object.keys(row).some((field) => {
                              if (row[field] !== null) {
                                return searchRegex.test(row[field].toString());
                              }
                            });
                          });
                          return filterdData;
                        }}
                        renderOption={(props, currencyOptions) => (
                          <Box
                            component='li'
                            {...props}
                            key={currencyOptions.id}>
                            {currencyOptions.emoji} {currencyOptions.currency}{' '}
                            {currencyOptions.currency_name}
                          </Box>
                        )}
                        renderInput={(params) => (
                          <TextValidator
                            {...params}
                            label={t('currencyCode')}
                            variant='standard'
                            value={values.currencyCode}
                            validators={['required']}
                            errorMessages={[t('required')]}
                            onBlur={() => {
                              if (
                                currencyOptions
                                  .map((a) => a.currency)
                                  .indexOf(values.currencyCode) == -1
                              ) {
                                setValues({ ...values, currencyCode: '' });
                              }
                            }}
                            onChange={(e) => {
                              setValues({
                                ...values,
                                currencyCode: e.target.value,
                              });
                              (async () => {
                                await sleep(1e3); // For demo purposes.
                                setCurrencyFilter(e.target.value);
                              })();
                            }}
                            className={classes.inputAutocomplete}
                            fullWidth
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <Fragment>
                                  {loadingCurrency ? (
                                    <CircularProgress
                                      color='inherit'
                                      size={20}
                                    />
                                  ) : null}
                                  {params.InputProps.endAdornment}
                                </Fragment>
                              ),
                            }}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={3} style={{ marginTop: 10 }}>
                    <Grid item xs={12} sm={12} md={3}>
                      <TextValidator
                        className={classes.input}
                        variant='standard'
                        autoComplete='off'
                        placeholder='0'
                        onKeyDown={(e) => e.key === 69 && e.preventDefault()}
                        value={
                          values.creditAmount == 0 ? '' : values.creditAmount
                        }
                        onChange={handleChange('creditAmount')}
                        // validators={['required']}
                        InputProps={{
                          inputComponent: NumberInput,
                          defaultValue:
                            values.currencyCode == ''
                              ? `${t('selectCurrencyFirst')}  `
                              : `${values.currencyCode}  `,
                          [`aria-describedby`]: `${rtlActive}`,
                        }}
                        // errorMessages={[t('required')]}
                        name='creditAmount'
                        label={t('creditAmount')}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={3}>
                      <TextValidator
                        className={classes.input}
                        variant='standard'
                        autoComplete='off'
                        placeholder='0'
                        onKeyDown={(e) => e.key === 69 && e.preventDefault()}
                        value={
                          values.depositAmount == 0 ? '' : values.depositAmount
                        }
                        onChange={handleChange('depositAmount')}
                        // validators={['required']}
                        InputProps={{
                          inputComponent: NumberInput,
                          defaultValue:
                            values.currencyCode == ''
                              ? `${t('selectCurrencyFirst')}  `
                              : `${values.currencyCode}  `,
                          [`aria-describedby`]: `${rtlActive}`,
                        }}
                        // errorMessages={[t('required')]}
                        name='depositAmount'
                        label={t('depositAmount')}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={3}>
                      <TextValidator
                        className={classes.input}
                        variant='standard'
                        autoComplete='off'
                        placeholder='0'
                        onKeyDown={(e) => e.key === 69 && e.preventDefault()}
                        value={values.remainCreditAmount}
                        onChange={handleChange('remainCreditAmount')}
                        // validators={['required']}
                        errorMessages={[t('required')]}
                        disabled
                        InputProps={{
                          inputComponent: NumberInput,
                          defaultValue:
                            values.currencyCode == ''
                              ? `${t('selectCurrencyFirst')}  `
                              : `${values.currencyCode}  `,
                          [`aria-describedby`]: `${rtlActive}`,
                        }}
                        name='remainCreditAmount'
                        label={t('remainCreditAmount')}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={3}>
                      <TextValidator
                        className={classes.input}
                        variant='standard'
                        autoComplete='off'
                        placeholder='0'
                        onKeyDown={(e) => e.key === 69 && e.preventDefault()}
                        value={values.remainDepositAmount}
                        onChange={handleChange('remainDepositAmount')}
                        // validators={['required']}
                        errorMessages={[t('required')]}
                        disabled
                        InputProps={{
                          inputComponent: NumberInput,
                          defaultValue:
                            values.currencyCode == ''
                              ? `${t('selectCurrencyFirst')}  `
                              : `${values.currencyCode}  `,
                          [`aria-describedby`]: `${rtlActive}`,
                        }}
                        name='remainDepositAmount'
                        label={t('remainDepositAmount')}
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={3} style={{ marginTop: 10 }}>
                    {values?.phones.map((value, index) => {
                      return (
                        <Fragment key={index}>
                          <Grid item xs={12} sm={12} md={3}>
                            <PhoneInput
                              type='text'
                              value={value.number}
                              name='number'
                              id={`phoneNumber_${index}`}
                              error={phoneNumberError[index][index]}
                              label={t('phoneNumber')}
                              onChange={(value, country, e, formattedValue) => {
                                values.phones[index][e.target.name] =
                                  formattedValue;
                                setValues({ ...values });
                                phoneNumberError[index][index] = false;
                                setPhoneNumberError((prevState) => [
                                  ...prevState,
                                ]);
                              }}
                              defaultCountry={countryPhoneCode}
                            />
                            <TextValidator
                              validators={['required']}
                              className={classes.root}
                              variant='standard'
                              id={`${index}`}
                              type='hidden'
                              fullWidth
                              InputProps={{
                                classes: {
                                  root: classes.root,
                                },
                              }}
                              ref={numbersRef}
                              errorMessages={[t('required')]}
                              value={value.number}
                            />
                          </Grid>
                          <Grid item xs={12} sm={12} md={3}>
                            <SelectValidator
                              className={classes.inputAutocomplete}
                              autoComplete='off'
                              label={t('phonesTags')}
                              value={value.tags[0]}
                              variant='standard'
                              validators={['required']}
                              errorMessages={[t('required')]}
                              fullWidth>
                              {phoneTags.map((d, i) => {
                                return (
                                  <MenuItem
                                    key={i}
                                    value={d[`${lang}_name`]}
                                    onClick={(e) => {
                                      value.tags[0] = d[`${lang}_name`];
                                      setValues({ ...values });
                                    }}>
                                    {d[`${lang}_name`]}
                                  </MenuItem>
                                );
                              })}
                            </SelectValidator>
                          </Grid>
                          <Grid item xs={12} sm={12} md={3}>
                            <TextValidator
                              className={classes.input}
                              InputProps={{
                                style: {
                                  WebkitTextFillColor: theme.palette.text.color,
                                },
                              }}
                              label={t('phoneRemark')}
                              fullWidth
                              onChange={(e) => {
                                values.phones[index][e.target.name] = e.target.value;
                                setValues({ ...values });
                              }}
                              value={value.remark}
                              name='remark'
                              variant='standard'
                              validators={['required']}
                              errorMessages={[t('required')]}
                            />
                          </Grid>
                          <Grid item xs={12} sm={12} md={3}>
                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                mt: 2,
                              }}>
                              <Tooltip title={index == 0 ? t('addPhones') : t('removePhones')} arrow>
                                <Fab
                                  color={index == 0 ? 'secondary' : 'primary'}
                                  size='small'
                                  aria-label='add'
                                  onClick={() => {
                                    if (index == 0) {
                                      if (values.phones.length < 5) {
                                        values.phones.push({
                                          tags: [''],
                                          number: '',
                                          remark: '',
                                        });
                                        setValues({ ...values });
                                        phoneNumberError.push({
                                          [values.phones.length - 1]: false,
                                        });
                                        setPhoneNumberError((prevState) => [
                                          ...prevState,
                                        ]);
                                      }
                                    } else {
                                      values.phones.splice(index, 1);
                                      setValues({ ...values });
                                      phoneNumberError.splice(index, 1);
                                      setPhoneNumberError((prevState) => [
                                        ...prevState,
                                      ]);
                                    }
                                  }}
                                  style={{ alignItems: 'center' }}>
                                  {index == 0 ? <Add /> : <Remove />}
                                </Fab>
                              </Tooltip>
                            </Box>
                          </Grid>
                        </Fragment>
                      );
                    })}
                  </Grid>
                  <Grid container spacing={3} style={{ marginTop: 10 }}>
                    <Grid item xs={12} sm={12} md={12}>
                      <TextValidator
                        className={classes.input}
                        multiline
                        rows={4}
                        fullWidth
                        label={t('remark')}
                        onChange={handleChange('remark')}
                        value={values.remark}
                        name='remark'
                        variant='standard'
                      />
                    </Grid>
                  </Grid>
                  <Button
                    color='primary'
                    variant='contained'
                    type='submit'
                    fullWidth
                    className={classes.updateProfileButton}>
                    {client_id == null
                      ? t('createAgencyProfile')
                      : t('editAgencyProfile')}
                  </Button>
                </CardBody>
              </ValidatorForm>
            </Card>
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
            <Card profile>
              {logoImageBlob == '' ? (
                <CardHeader color='rose' icon>
                  <CardAvatar profile>
                    <img src={customerAvatar.src} alt='..' />
                  </CardAvatar>
                  <h6 className={classes.cardCategory}>{values.agentId} </h6>
                  <h5 className={classes.cardCategory}>
                    {values.cityName} {values.provinceName} {values.countryName}
                  </h5>
                  <h5 className={classes.cardTitle}>{values.currencyCode}</h5>
                  <h4 className={classes.cardIconTitle}>{values.agentName}</h4>
                  <h4 className={classes.cardIconTitle}>{values.email}</h4>
                  <h4 className={classes.cardIconTitle}>{values.address}</h4>
                </CardHeader>
              ) : (
                <>
                  <CardAvatar profile>
                    <img src={logoImageBlob} alt='..' />
                  </CardAvatar>
                  <h6 className={classes.cardCategory}>{values.agentId}</h6>
                  <h5 className={classes.cardCategory}>
                    {values.cityName} {values.provinceName} {values.countryName}
                  </h5>
                  <h5 className={classes.cardTitle}>{values.currencyCode}</h5>
                  <h4 className={classes.cardIconTitle}>{values.agentName}</h4>
                  <h4 className={classes.cardIconTitle}>{values.email}</h4>
                  <h4 className={classes.cardIconTitle}>{values.address}</h4>
                </>
              )}
              <CardBody profile>
                <h4 className={classes.cardTitle}>
                  {values.phones.map((p, i) => {
                    return (
                      <p key={i}>
                        {p.number} {p.tags[0]} {p.remark}
                      </p>
                    );
                  })}
                </h4>
                <p
                  className={classes.description}
                  style={{ whiteSpace: 'pre-wrap' }}>
                  {values.remark}
                </p>
                <h6 className={classes.cardCategory}>
                  {values.accountManager}
                </h6>

                {values.creditAmount !== 0 && (
                  <p className={classes.cardCategory}>
                    {t('creditAmount')}: {values.creditAmount?.toLocaleString()}{' '}
                    {values.currencyCode !== '' && values.currencyCode}
                  </p>
                )}
                {values.depositAmount !== 0 && (
                  <p className={classes.cardCategory}>
                    {t('depositAmount')}:{' '}
                    {values.depositAmount?.toLocaleString()}{' '}
                    {values.currencyCode !== '' && values.currencyCode}
                  </p>
                )}
                {values.remainCreditAmount !== 0 && (
                  <p className={classes.cardCategory}>
                    {t('remainCreditAmount')}:{' '}
                    {values.remainCreditAmount?.toLocaleString()}{' '}
                    {values.currencyCode !== '' && values.currencyCode}
                  </p>
                )}
                {values.remainDepositAmount !== 0 && (
                  <p className={classes.cardCategory}>
                    {t('remainDepositAmount')}:{' '}
                    {values.remainDepositAmount?.toLocaleString()}{' '}
                    {values.currencyCode !== '' && values.currencyCode}
                  </p>
                )}
              </CardBody>
            </Card>
          </Grid>
        </Grid>
      </Fragment>
    </Container>
  );
}
