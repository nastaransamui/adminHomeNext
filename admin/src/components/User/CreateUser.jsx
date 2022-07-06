import { Fragment, useEffect } from 'react';

import PropTypes from 'prop-types';

import avatar from '../../../public/images/faces/avatar1.jpg';

import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import {
  ValidatorForm,
  TextValidator,
  SelectValidator,
} from 'react-material-ui-form-validator';
import { useTheme } from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import SvgIcon from '@mui/material/SvgIcon';
import Card from '../Card/Card';
import CardBody from '../Card/CardBody';
import CardHeader from '../Card/CardHeader';
import CardIcon from '../Card/CardIcon';
import CardAvatar from '../Card/CardAvatar';
import Close from '@mui/icons-material/Close';
import Done from '@mui/icons-material/Done';

import { isRegex } from '../auth/functions';

export function escapeRegExp(value) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

function copy(arr1, arr2) {
  for (var i = 0; i < arr1.length; i++) {
    arr2[i] = arr1[i];
  }
}

const CreateUser = (props) => {
  const theme = useTheme();

  const {
    values,
    classes,
    t,
    _id,
    setValues,
    handleChange,
    profileImageBlob,
    uploadImage,
    deleteImage,
    formSubmit,
    handleAutocomplete,
    openRole,
    setOpenRole,
    openCity,
    setOpenCity,
    openProvince,
    setOpenProvince,
    openCountry,
    setOpenCountry,
    loadingRole,
    loadingCity,
    loadingProvince,
    loadingCountry,
    roleOptions,
    cityOptions,
    provinceOptions,
    countryOptions,
    sleep,
    setRoleFilter,
    setCountryFilter,
    setProvinceFilter,
    setCityFilter,
    roleNameError,
    updateRoleName,
  } = props;

  useEffect(() => {
    ValidatorForm.addValidationRule(isRegex(values.password));
    return () => {
      ValidatorForm.removeValidationRule('isRegex');
    };
  });

  return (
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
                  profileImageBlob == '' ? t('uploadImage') : t('changeImage')
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
              <Grid item xs={12} sm={12} md={4}>
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
              <Grid item xs={12} sm={12} md={4}>
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
              <Grid item xs={12} sm={12} md={4}>
                <Autocomplete
                  id='role-select'
                  options={roleOptions}
                  loading={loadingRole}
                  loadingText={t('loadingRole')}
                  noOptionsText={t('roleNoOptions')}
                  inputValue={values.roleName}
                  autoHighlight
                  onChange={(event, newValue) => {
                    handleAutocomplete('roleName', newValue);
                  }}
                  open={openRole}
                  onOpen={() => {
                    setOpenRole(true);
                  }}
                  onClose={() => {
                    setOpenRole(false);
                  }}
                  getOptionLabel={(roleOptions) => roleOptions.roleName}
                  getOptionDisabled={(roleOptions) => {
                    console.log();
                    return !roleOptions.isActive;
                  }}
                  isOptionEqualToValue={(roleOptions, value) => {
                    return roleOptions.roleName === value.roleName;
                  }}
                  filterOptions={(options, state) => {
                    const searchRegex = new RegExp(
                      escapeRegExp(values.roleName),
                      'i'
                    );
                    const filterdData = options.filter((row) => {
                      return Object.keys(row).some((field) => {
                        if (row[field] !== null) {
                          return searchRegex.test(row[field].toString());
                        }
                      });
                    });
                    return filterdData;
                  }}
                  renderOption={(props, roleOptions) => (
                    <Box component='li' {...props} key={roleOptions._id}>
                      <SvgIcon
                        style={{ color: theme.palette.secondary.main }}
                        sx={{ mr: 2 }}>
                        <path d={`${roleOptions.icon}`} />
                      </SvgIcon>
                      {'  '}
                      {roleOptions.roleName}{' '}
                      {roleOptions.isActive ? (
                        <Done className={classes.autocompleteIconDone} />
                      ) : (
                        <Close className={classes.autocompleteIconClose} />
                      )}
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextValidator
                      {...params}
                      label={t('roleName')}
                      variant='standard'
                      error={
                        roleNameError ||
                        (updateRoleName.changed &&
                          updateRoleName.roleName !== values.roleName)
                      }
                      helperText={
                        roleNameError
                          ? t('required')
                          : (updateRoleName.changed &&
                            updateRoleName.roleName !== values.roleName)
                          ? t('routeChanged')
                          : ' '
                      }
                      validators={
                        values.role_id.length == 0
                          ? ['required']
                          : _id == null
                          ? ['required']
                          : []
                      }
                      errorMessages={[t('required')]}
                      value={values.roleName}
                      onBlur={() => {
                        if (
                          roleOptions
                            .map((a) => a.roleName)
                            .indexOf(values.roleName) == -1
                        ) {
                          setValues({ ...values, roleName: '', role_id: [] });
                        }
                      }}
                      onChange={(e) => {
                        setValues({ ...values, roleName: e.target.value });
                        (async () => {
                          await sleep(1e3);
                          setRoleFilter(e.target.value);
                        })();
                      }}
                      className={classes.inputAutocomplete}
                      fullWidth
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <Fragment>
                            {loadingRole ? (
                              <CircularProgress color='inherit' size={20} />
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
            <Grid container spacing={1} style={{ marginTop: 10 }}>
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
                      onBlur={() => {
                        if (
                          cityOptions
                            .map((a) => a.name)
                            .indexOf(values.cityName) == -1
                        ) {
                          setValues({ ...values, cityName: '', city_id: [] });
                        }
                      }}
                      onChange={(e) => {
                        setValues({ ...values, cityName: e.target.value });
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
                              <CircularProgress color='inherit' size={20} />
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
                  getOptionLabel={(provinceOptions) => provinceOptions.name}
                  getOptionDisabled={(provinceOptions) => provinceOptions.error}
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
                    <Box component='li' {...props} key={provinceOptions.id}>
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
                      onBlur={() => {
                        if (
                          provinceOptions
                            .map((a) => a.name)
                            .indexOf(values.provinceName) == -1
                        ) {
                          setValues({
                            ...values,
                            provinceName: '',
                            province_id: [],
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
                              <CircularProgress color='inherit' size={20} />
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
                  getOptionDisabled={(countryOptions) => countryOptions.error}
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
                    <Box component='li' {...props} key={countryOptions.id}>
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
                        setValues({ ...values, countryName: e.target.value });
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
                              <CircularProgress color='inherit' size={20} />
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
            {_id == null && (
              <Button
                color='primary'
                variant='contained'
                type='submit'
                className={classes.updateProfileButton}>
                {t('createUserProfile')}
              </Button>
            )}
          </CardBody>
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
  );
};

CreateUser.propTypes = {
  classes: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  _id: PropTypes.string,
};

export default CreateUser;
