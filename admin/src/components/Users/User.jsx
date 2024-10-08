import { useState, useEffect } from 'react';
import userStyle from './user-style';
import PropTypes from 'prop-types';

import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import { Visibility, VisibilityOff } from '@mui/icons-material';

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

import Alert from 'react-s-alert';
import CustomAlert from '../../components/Alert/CustomAlert';
import { useQuery } from '../../pages/dashboard/ReactRouter';
import { useSelector } from 'react-redux';

export default function User(props) {
  let query = useQuery();
  const _id = query.get('_id');
  const classes = userStyle();
  const { t } = useTranslation('users');
  const location = useLocation();
  const theme = useTheme();
  const history = useHistory();
  const { adminAccessToken } = useSelector((state) => state);

  const [profileImage, setProfileImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    userName: '',
    password: '',
    isAdmin: false,
    showPassword: false,
    firstName: '',
    lastName: '',
    city: '',
    country: '',
    position: '',
    aboutMe: '',
  });

  useEffect(() => {
    ValidatorForm.addValidationRule(isRegex(values.password));
    return () => {
      ValidatorForm.removeValidationRule('isRegex');
    };
  });

  useEffect(() => {
    let isMount = true;
    if (isMount) {
      if (_id == null) {
        // _id is empty load create
      } else if (location.profile) {
        // location.profile is exist
        setProfileImage(location.profile.profileImage);
        setValues((oldValues) => ({
          ...oldValues,
          userName: location.profile?.userName || '',
          isAdmin: location?.profile.isAdmin || '',
          firstName: location?.profile.firstName || '',
          lastName: location?.profile.lastName || '',
          city: location.profile?.city || '',
          country: location.profile?.country || '',
          position: location.profile?.position || '',
          aboutMe: location.profile?.aboutMe || '',
        }));
      } else {
        // Search for user by _id
        console.log(_id);
      }
    }
    return () => {
      isMount = false;
    };
  }, [location]);

  function toFormData(o) {
    return Object.entries(o).reduce(
      (d, e) => (d.append(...e), d),
      new FormData()
    );
  }

  const formSubmit = async () => {
    delete values.showPassword;
    if (_id == null) {
      // Create user
      setLoading(true);
      const res = await fetch(`/admin/api/users/create`, {
        method: 'POST',
        headers: {
          token: `Brearer ${adminAccessToken}`,
        },
        body: toFormData(values),
      });
      const { status } = res;
      const user = await res.json();
      const errorText = user?.ErrorCode == undefined ? user.Error :  t(`${user?.ErrorCode}`)
      if (status !== 200 && !user.success) {
        Alert.error('', {
          customFields: {
            message: errorText,
            styles: {
              backgroundColor: theme.palette.error.dark,
              zIndex: 9999,
            },
          },
          onClose: function () {
            setLoading(false);
          },
          timeout: 'none',
          position: 'bottom',
          effect: 'bouncyflip',
        });
      } else {
        Alert.success('', {
          customFields: {
            message: `${user.data.userName} ${t('userCreateSuccess')}`,
            styles: {
              backgroundColor: theme.palette.secondary.main,
              zIndex: 9999,
            },
          },
          onClose: function () {
            setLoading(false);
            history.push('/admin/dashboard/user-page');
          },
          timeout: 'none',
          position: 'bottom',
          effect: 'bouncyflip',
        });
      }
    } else {
      // Edit user
      // const res = await fetch(
      //   `${process.env.NEXT_PUBLIC_HOME_VERCEL}/api/auth/login`,
      //   {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify(body),
      //   }
      // );
      // setTimeout(() => {
      //   Alert.error('', {
      //     customFields: {
      //       message: t(`notAdmin`),
      //       styles: {
      //         backgroundColor: theme.palette.secondary.dark,
      //         zIndex: 9999,
      //       },
      //     },
      //     onClose: function () {
      //       setLoading(false);
      //     },
      //     timeout: 'none',
      //     position: 'bottom',
      //     effect: 'bouncyflip',
      //   });
      // }, 2000);
      console.log('sendEdit');
    }
  };

  const handleChange = (name) => (event) => {
    if (name == 'userName') {
      setValues({ ...values, [name]: event.target.value.toLowerCase().trim() });
    } else if (name !== 'password') {
      setValues({
        ...values,
        [name]:
          event.target.value.charAt(0).toUpperCase() +
          event.target.value.slice(1),
      });
    } else {
      setValues({ ...values, [name]: event.target.value });
    }
  };

  return (
    <Container style={{ marginTop: 10 }}>
      {loading ? (
        <Grid container spacing={2}>
          <CircleToBlockLoading color={theme.palette.secondary.main} />
        </Grid>
      ) : (
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
                      const random = (Math.random() + 1)
                        .toString(36)
                        .substring(7);
                      if (e.currentTarget.files.length > 0) {
                        let file = e.currentTarget.files[0];
                        let blob = file.slice(0, file.size, file.type);
                        let newFile = new File([blob], random + file.name, {
                          type: file.type,
                        });
                        setProfileImage(URL.createObjectURL(newFile));
                        values.profileImage = newFile;
                        setValues((oldValue) => ({ ...oldValue }));
                      }
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
                        <PermIdentityIcon style={{ cursor: 'pointer' }} />
                      </label>
                    ) : (
                      <label htmlFor='profileImage'>
                        <img
                          src={profileImage}
                          alt='..'
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 6,
                            cursor: 'pointer',
                          }}
                        />
                      </label>
                    )}
                  </Tooltip>
                </CardIcon>
                <h4 className={classes.cardIconTitle}>
                  {t('editProfile')} - <small>{t('completeProfile')}</small>
                </h4>
              </CardHeader>
              <ValidatorForm onSubmit={formSubmit}>
                <CardBody>
                  <Grid container spacing={1} style={{ marginTop: 10 }}>
                    <Grid item xs={12} sm={12} md={3}>
                      <SelectValidator
                        className={classes.input}
                        autoComplete='off'
                        label={t('isAdmin')}
                        onChange={() => {
                          values.isAdmin = !values.isAdmin;
                          setValues((oldValue) => ({ ...oldValue }));
                        }}
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
                        InputProps={{style: { WebkitTextFillColor: theme.palette.text.color }}}
                        label={t('userName')}
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
                    {t('submitProfile')}
                  </Button>
                </CardBody>
              </ValidatorForm>
            </Card>
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
            <Card profile>
              {profileImage == '' ? (
                <CardHeader color='rose' icon>
                  <CardIcon color='rose'>
                    <PermIdentityIcon />
                  </CardIcon>
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
      )}
    </Container>
  );
}
