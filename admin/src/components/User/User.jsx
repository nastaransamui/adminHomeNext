import { Fragment, useEffect, useState } from 'react';
import userStyle from './user-style';
import PropTypes from 'prop-types';

import avatar from '../../../public/images/faces/avatar1.jpg';
import {
  ArrowBack,
  ArrowForward,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';

import Card from '../Card/Card';
import CardBody from '../Card/CardBody';
import CardHeader from '../Card/CardHeader';
import CardIcon from '../Card/CardIcon';
import CardFooter from '../Card/CardFooter';
import CardAvatar from '../Card/CardAvatar';

import { isRegex } from '../auth/functions';

import {
  Container,
  Grid,
  InputAdornment,
  IconButton,
  Button,
  useTheme,
  MenuItem,
  Tooltip,
  Autocomplete,
  TextField,
  Box,
  CircularProgress,
} from '@mui/material';

import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { CircleToBlockLoading } from 'react-loadingg';
import {
  ValidatorForm,
  TextValidator,
  SelectValidator,
} from 'react-material-ui-form-validator';

import DeleteIcon from '@mui/icons-material/Delete';
import { useQuery } from '../../pages/dashboard/ReactRouter';
import userHook from './userHook';

export function escapeRegExp(value) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

export default function User(props) {
  const { rtlActive } = props;
  let query = useQuery();
  const _id = query.get('_id');
  const classes = userStyle();
  const { t } = useTranslation('users');
  const theme = useTheme();
  const history = useHistory();
  const pushUrl = '/admin/dashboard/user-page';
  const {
    values,
    setValues,
    handleChange,
    profileImageBlob,
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
    loadingCity,
    loadingProvince,
    loadingCountry,
    cityOptions,
    provinceOptions,
    countryOptions,
    sleep,
    setCountryFilter,
    setProvinceFilter,
    setCityFilter,
    getCities,
  } = userHook();

  useEffect(() => {
    ValidatorForm.addValidationRule(isRegex(values.password));
    return () => {
      ValidatorForm.removeValidationRule('isRegex');
    };
  });
  // console.log(values);
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
                    id='profileImageBlob'
                    name='profileImage'
                    hidden
                    onChange={(e) => {
                      uploadImage(e);
                    }}
                    accept='image/png, image/jpeg'
                  />
                  <Tooltip
                    title={
                      profileImageBlob == ''
                        ? t('uploadImage')
                        : t('changeImage')
                    }
                    arrow>
                    {profileImageBlob == '' ? (
                      <label htmlFor='profileImageBlob'>
                        <img
                          src={avatar.src}
                          alt='..'
                          className={classes.smallAvatar}
                        />
                      </label>
                    ) : (
                      <label htmlFor='profileImageBlob'>
                        <img
                          src={profileImageBlob}
                          alt='..'
                          className={classes.smallAvatar}
                        />
                      </label>
                    )}
                  </Tooltip>
                </CardIcon>
                <span className={classes.deleteIcon}>
                  <h4 className={classes.cardIconTitle}>
                    {t('editProfile')} - <small>{t('completeProfile')} </small>
                  </h4>
                  {profileImageBlob !== '' && (
                    <Tooltip title={t('deleteImage')} arrow>
                      <IconButton
                        onClick={() => {
                          deleteImage();
                        }}
                        style={{ marginTop: 10 }}
                        disableRipple>
                        <DeleteIcon color='error' />
                      </IconButton>
                    </Tooltip>
                  )}
                </span>
              </CardHeader>
              <ValidatorForm onSubmit={formSubmit}>
                <CardBody>
                  <Grid container spacing={1} style={{ marginTop: 10 }}>
                    <Grid item xs={12} sm={12} md={3}>
                      <SelectValidator
                        className={classes.input}
                        autoComplete='off'
                        label={t('isAdmin')}
                        onClick={handleChange('isAdmin')}
                        value={values.isAdmin ? t('isAdmin') : t('isNotAdmin')}
                        name='isAdmin'
                        variant='standard'
                        validators={['required']}
                        errorMessages={[t('required')]}
                        fullWidth>
                        {[t('isAdmin'), t('isNotAdmin')].map((d, i) => {
                          return (
                            <MenuItem key={i} value={d}>
                              {d}
                            </MenuItem>
                          );
                        })}
                      </SelectValidator>
                    </Grid>
                    <Grid item xs={12} sm={12} md={5}>
                      <TextValidator
                        className={classes.input}
                        InputProps={{
                          style: {
                            WebkitTextFillColor: theme.palette.text.color,
                          },
                        }}
                        label={t('userName')}
                        disabled={_id !== null}
                        fullWidth
                        onChange={handleChange('userName')}
                        value={values.userName}
                        name='userName'
                        variant='standard'
                        validators={['required', 'isEmail']}
                        errorMessages={[t('required'), t('userNameRequire')]}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={4}>
                      <TextValidator
                        className={classes.input}
                        fullWidth
                        label={t('password')}
                        onChange={handleChange('password')}
                        value={values.password}
                        type={!values.showPassword ? 'password' : 'text'}
                        name='password'
                        variant='standard'
                        validators={
                          values.password !== ''
                            ? ['required', 'isRegex']
                            : _id == null
                            ? ['required', 'isRegex']
                            : []
                        }
                        errorMessages={[t('required'), t('isRegex')]}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position='end'>
                              <IconButton
                                aria-label='Toggle password visibility'
                                onClick={() => {
                                  setValues((oldValue) => ({
                                    ...oldValue,
                                    showPassword: !values.showPassword,
                                  }));
                                }}>
                                {values.showPassword ? (
                                  <Visibility />
                                ) : (
                                  <VisibilityOff />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={1} style={{ marginTop: 10 }}>
                    <Grid item xs={12} sm={12} md={6}>
                      <TextValidator
                        className={classes.input}
                        InputProps={{
                          style: {
                            WebkitTextFillColor: theme.palette.text.color,
                          },
                        }}
                        fullWidth
                        label={t('firstName')}
                        onChange={handleChange('firstName')}
                        value={values.firstName}
                        name='firstName'
                        variant='standard'
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6}>
                      <TextValidator
                        className={classes.input}
                        fullWidth
                        InputProps={{
                          style: {
                            WebkitTextFillColor: theme.palette.text.color,
                          },
                        }}
                        label={t('lastName')}
                        onChange={handleChange('lastName')}
                        value={values.lastName}
                        name='lastName'
                        variant='standard'
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={1} style={{ marginTop: 10 }}>
                    <Grid item xs={12} sm={12} md={3}>
                      <Autocomplete
                        id='city-select'
                        options={cityOptions}
                        loading={loadingCity}
                        loadingText={t('loadingCity')}
                        noOptionsText={t('cityNoOptions')}
                        inputValue={values.city}
                        autoHighlight
                        onChange={(event, newValue) => {
                          handleAutocomplete('city', newValue);
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
                            escapeRegExp(values.city),
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
                            label={t('city')}
                            variant='standard'
                            value={values.city}
                            onBlur={()=>{
                              if(cityOptions.map(a => a.name).indexOf(values.city) == -1){
                                setValues({ ...values, city: '' });
                              }
                            }}
                            onChange={(e) => {
                              setValues({ ...values, city: e.target.value });
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
                        inputValue={values.province}
                        autoHighlight
                        onChange={(event, newValue) => {
                          handleAutocomplete('province', newValue);
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
                            escapeRegExp(values.province),
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
                            label={t('province')}
                            variant='standard'
                            value={values.province}
                            onBlur={()=>{
                              if(provinceOptions.map(a => a.name).indexOf(values.province) == -1){
                                setValues({ ...values, province: '', });
                              }
                            }}
                            onChange={(e) => {
                              setValues({
                                ...values,
                                province: e.target.value,
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
                        inputValue={values.country}
                        onChange={(event, newValue) => {
                          handleAutocomplete('country', newValue);
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
                            escapeRegExp(values.country),
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
                            label={t('country')}
                            variant='standard'
                            value={values.country}
                            onBlur={()=>{
                              if(countryOptions.map(a => a.name).indexOf(values.country) == -1){
                                setValues({ ...values, country: '', });
                              }
                            }}
                            onChange={(e) => {
                              setValues({ ...values, country: e.target.value });
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
                      <TextValidator
                        className={classes.input}
                        fullWidth
                        InputProps={{
                          style: {
                            WebkitTextFillColor: theme.palette.text.color,
                          },
                        }}
                        label={t('position')}
                        onChange={handleChange('position')}
                        value={values.position}
                        name='position'
                        variant='standard'
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={1} style={{ marginTop: 10 }}>
                    <Grid item xs={12} sm={12} md={12}>
                      <TextValidator
                        className={classes.input}
                        multiline
                        rows={4}
                        fullWidth
                        label={t('aboutMe')}
                        onChange={handleChange('aboutMe')}
                        value={values.aboutMe}
                        name='aboutMe'
                        variant='standard'
                      />
                    </Grid>
                  </Grid>
                  <Button
                    color='primary'
                    variant='contained'
                    type='submit'
                    className={classes.updateProfileButton}>
                    {_id == null
                      ? t('createUserProfile')
                      : t('editUserProfile')}
                  </Button>
                </CardBody>
              </ValidatorForm>
            </Card>
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
            <Card profile>
              {profileImageBlob == '' ? (
                <CardHeader color='rose' icon>
                  <CardAvatar profile>
                    <img src={avatar.src} alt='..' />
                  </CardAvatar>
                  <h4 className={classes.cardIconTitle}>
                    {values.userName}
                    <small>
                      {' '}
                      {values.password !== '' &&
                        [...Array(values.password.length).keys()].map(
                          (d, i) => '*'
                        )}
                    </small>
                  </h4>
                </CardHeader>
              ) : (
                <>
                  <CardAvatar profile>
                    <img src={profileImageBlob} alt='..' />
                  </CardAvatar>
                  <h4 className={classes.cardIconTitle}>
                    {values.userName}
                    <small>
                      {' '}
                      {values.password !== '' &&
                        [...Array(values.password.length).keys()].map(
                          (d, i) => '*'
                        )}
                    </small>
                  </h4>
                </>
              )}
              <CardBody profile>
                <h6 className={classes.cardCategory}>{values.position}</h6>
                <h4 className={classes.cardTitle}>
                  {values.firstName} {values.lastName}
                </h4>
                <p
                  className={classes.description}
                  style={{ whiteSpace: 'pre-wrap' }}>
                  {values.aboutMe}
                </p>
              </CardBody>
            </Card>
          </Grid>
        </Grid>
      </Fragment>
    </Container>
  );
}
