import { useEffect } from 'react';

import PropTypes from 'prop-types';

import avatar from '../../../public/images/faces/avatar1.jpg';

import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import {
  ValidatorForm,
  TextValidator,
  SelectValidator,
} from 'react-material-ui-form-validator';
import { useTheme } from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Card from '../Card/Card';
import CardBody from '../Card/CardBody';
import CardHeader from '../Card/CardHeader';
import CardIcon from '../Card/CardIcon';
import CardAvatar from '../Card/CardAvatar';
import Autocomplete from '../Autocomplete/Autocomplete';
import { roleUrl, cityUrl, countryUrl, provinceUrl } from './userStatic';

import { isRegex } from '../auth/functions';

export function escapeRegExp(value) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

const CreateUser = (props) => {
  const theme = useTheme();

  const {
    profile,
    values,
    classes,
    t,
    _id,
    setValues,
    handleChange,
    profileImageBlob,
    uploadImage,
    deleteImage,
    roleNameError,
    setRoleNameError,
    updateRoleName,
    setUpdateRoleName,
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
                  required
                  modelName='Roles'
                  componentName='Roles'
                  optionsUrl={roleUrl}
                  disabled={profile._id == values._id}
                  nameValue='roleName'
                  value={values.roleName}
                  setValues={setValues}
                  values={values}
                  arrayIdName='role_id'
                  roleNameError={roleNameError}
                  setRoleNameError={setRoleNameError}
                  updateRoleName={updateRoleName}
                  setUpdateRoleName={setUpdateRoleName}
                  componentInUse='Users'
                />
              </Grid>
            </Grid>
            <Grid container spacing={1} style={{ marginTop: 10 }}>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <Autocomplete
                  required={false}
                  modelName='Countries'
                  componentName='Cities'
                  optionsUrl={cityUrl}
                  nameValue='cityName'
                  value={values.cityName}
                  setValues={setValues}
                  values={values}
                  arrayIdName='city_id'
                  componentInUse='Users'
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <Autocomplete
                  required={false}
                  modelName='Countries'
                  componentName='Provinces'
                  optionsUrl={provinceUrl}
                  nameValue='provinceName'
                  value={values.provinceName}
                  setValues={setValues}
                  values={values}
                  arrayIdName='province_id'
                  componentInUse='Users'
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <Autocomplete
                  required={false}
                  modelName='Countries'
                  componentName='Countries'
                  optionsUrl={countryUrl}
                  nameValue='countryName'
                  value={values.countryName}
                  setValues={setValues}
                  values={values}
                  arrayIdName='country_id'
                  componentInUse='Users'
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6}>
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
