import { Fragment, useEffect } from 'react';
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
} from '@mui/material';

import { useTranslation } from 'react-i18next';
import { useLocation, useHistory } from 'react-router-dom';
import { CircleToBlockLoading } from 'react-loadingg';
import {
  ValidatorForm,
  TextValidator,
  SelectValidator,
} from 'react-material-ui-form-validator';

import DeleteIcon from '@mui/icons-material/Delete';
import { useQuery } from '../../pages/dashboard/ReactRouter';
import useFormHook from '../Hooks/useFormHook';

export default function User(props) {
  const { rtlActive } = props;
  let query = useQuery();
  const _id = query.get('_id');
  const classes = userStyle();
  const { t } = useTranslation('users');
  const location = useLocation();
  const theme = useTheme();
  const history = useHistory();
  const pushUrl = '/admin/dashboard/user-page';
  const {
    values,
    handleChange,
    loading,
    profileImage,
    uploadImage,
    deleteImage,
    formSubmit,
  } = useFormHook(_id, location);

  useEffect(() => {
    ValidatorForm.addValidationRule(isRegex(values.password));
    return () => {
      ValidatorForm.removeValidationRule('isRegex');
    };
  });

  return (
    <Container style={{ marginTop: 10, minHeight: '78vh' }} maxWidth='xl'>
      {loading ? (
        <Grid container spacing={2}>
          <CircleToBlockLoading color={theme.palette.secondary.main} />
        </Grid>
      ) : (
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
                      id='profileImage'
                      name='profileImage'
                      hidden
                      onChange={(e) => {
                        uploadImage(e);
                      }}
                      accept='image/png, image/jpeg'
                    />
                    <Tooltip
                      title={
                        profileImage == '' ? t('uploadImage') : t('changeImage')
                      }
                      arrow>
                      {profileImage == '' ? (
                        <label htmlFor='profileImage'>
                          <img
                            src={avatar.src}
                            alt='..'
                            className={classes.smallAvatar}
                          />
                        </label>
                      ) : (
                        <label htmlFor='profileImage'>
                          <img
                            src={profileImage}
                            alt='..'
                            className={classes.smallAvatar}
                          />
                        </label>
                      )}
                    </Tooltip>
                  </CardIcon>
                  <span className={classes.deleteIcon}>
                    <h4 className={classes.cardIconTitle}>
                      {t('editProfile')} -{' '}
                      <small>{t('completeProfile')} </small>
                    </h4>
                    {profileImage !== '' && (
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
                          value={
                            values.isAdmin ? t('isAdmin') : t('isNotAdmin')
                          }
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
                      <Grid item xs={12} sm={12} md={4}>
                        <TextValidator
                          className={classes.input}
                          fullWidth
                          InputProps={{
                            style: {
                              WebkitTextFillColor: theme.palette.text.color,
                            },
                          }}
                          label={t('city')}
                          onChange={handleChange('city')}
                          value={values.city}
                          name='city'
                          variant='standard'
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={4}>
                        <TextValidator
                          className={classes.input}
                          fullWidth
                          label={t('country')}
                          InputProps={{
                            style: {
                              WebkitTextFillColor: theme.palette.text.color,
                            },
                          }}
                          onChange={handleChange('country')}
                          value={values.country}
                          name='country'
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
                {profileImage == '' ? (
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
                      <img src={profileImage} alt='..' />
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
      )}
    </Container>
  );
}
