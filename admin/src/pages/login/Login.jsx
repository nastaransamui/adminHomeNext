import React, { useState, useEffect } from 'react';

//Material
import { useText } from '../../../theme/common';
import clsx from 'clsx';
import {
  FormControlLabel,
  Checkbox,
  Grid,
  InputAdornment,
  IconButton,
  Button,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

//ThirdParties
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { setCookies } from 'cookies-next';
import jwt from 'jsonwebtoken';
import Alert from 'react-s-alert';
import { useDispatch } from 'react-redux';

//Form
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';

//Componenets
import { isRegex } from '../../components/auth/functions';
import useStyles from '../../components/auth/auth-style';
import AuthFrame from '../../components/auth/AuthFrame';
import LanguagePack from '../../components/auth/LanguagePack';
import Title from '../../components/Title/Title';
import CustomAlert from '../../components/Alert/CustomAlert';



export default function Login(props) {
  const classes = useStyles();
  const text = useText();
  const theme = useTheme();
  const { t, router } = props;
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isForget, setIsForget] = useState(false);
  const dispatch = useDispatch();

  const [values, setValues] = useState({
    email: '',
    password: '',
    showPassword: false,
  });

  useEffect(() => {
    ValidatorForm.addValidationRule(isRegex(values.password));
    return () => {
      ValidatorForm.removeValidationRule('isRegex');
    };
  });

  const [check, setCheck] = useState(false);

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleCheck = (event) => {
    setCheck(event.target.checked);
  };

  const handleSubmit = async () => {
    const body = {
      username: values.email,
      password: values.password,
      strategy: 'local',
    };
    dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: true });
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_HOME_VERCEL}/api/auth/login`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    );
    const { status } = res;

    if (status == 200) {
      const user = await res.json();
      if (user.success) {
        const { accessToken } = user;
        const profile = jwt.verify(
          accessToken,
          process.env.NEXT_PUBLIC_SECRET_KEY,
          (err, user) => {
            if (!err) {
              return user;
            }
          }
        );
        if (profile.isAdmin) {
          dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
          dispatch({ type: 'ADMIN_ACCESS_TOKEN', payload: accessToken });
          setCookies('adminAccessToken', accessToken);
          router.push('/dashboard');
        } else {
          Alert.error('', {
            customFields: {
              message: t(`notAdmin`),
              styles: {
                backgroundColor: theme.palette.secondary.dark,
              },
            },
            onClose: function () {
              dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
            },
            timeout: 'none',
            position: 'bottom',
            effect: 'bouncyflip',
          });
        }
      } else {
        Alert.error('', {
          customFields: {
            message: t(`${user.user.message}`),
            styles: {
              backgroundColor: theme.palette.secondary.dark,
            },
          },
          onClose: function () {
            dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
          },
          timeout: 'none',
          position: 'bottom',
          effect: 'bouncyflip',
        });
      }
    } else {
      Alert.error('', {
        customFields: {
          message: t('serverError'),
          styles: {
            backgroundColor: theme.palette.secondary.dark,
          },
        },
        onClose: function () {
          dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
        },
        timeout: 'none',
        position: 'bottom',
        effect: 'bouncyflip',
      });
    }
  };

  return (
    <div>
      <Alert contentTemplate={CustomAlert} />
      <AuthFrame
        title={t('login_title')}
        subtitle={t('login_subtitle')}
        {...props}>
        <div >
          <div className={classes.head}>
            <Title align={isMobile ? 'center' : 'center'}>{t('login')}</Title>
          </div>
          <LanguagePack {...props} />
          <div className={classes.separator}>
            <Typography>{t('login_or')}</Typography>
          </div>
          <ValidatorForm
            onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextValidator
                  variant='filled'
                  className={classes.input}
                  label={t('login_email')}
                  onChange={handleChange('email')}
                  name='email'
                  value={values.email}
                  validators={['required', 'isEmail']}
                  errorMessages={[t('form_require'), t('form_email_require')]}
                />
              </Grid>
              <Grid item xs={12}>
                {!isForget && (
                  <TextValidator
                    variant='filled'
                    type={values.showPassword ? 'text' : 'password'}
                    className={classes.input}
                    label={t('login_password')}
                    validators={['required', 'isRegex']}
                    onChange={handleChange('password')}
                    errorMessages={[
                      t('form_require'),
                      t('form_password_regex'),
                    ]}
                    name='password'
                    value={values.password}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            aria-label='Toggle password visibility'
                            onClick={() => {
                              setValues({
                                ...values,
                                showPassword: !values.showPassword,
                              });
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
                )}
              </Grid>
            </Grid>
            <div className={classes.formHelper}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={check}
                    onChange={(e) => handleCheck(e)}
                    color='secondary'
                    value={check}
                    className={classes.check}
                  />
                }
                label={
                  <span className={text.caption}>{t('login_remember')}</span>
                }
              />
              {!isForget ? (
                <Button
                  variant='contained'
                  className={classes.buttonLink}
                  onClick={() => {
                    setIsForget(true);
                  }}>
                  {t('login_forgot')}
                </Button>
              ) : (
                <Button
                  variant='contained'
                  className={classes.buttonLink}
                  onClick={() => {
                    setIsForget(false);
                  }}>
                  {t('login')}
                </Button>
              )}
            </div>
            <div className={classes.btnArea}>
              <Button
                variant='contained'
                fullWidth
                type='submit'
                color='secondary'
                size='large'>
                {t('continue')}
              </Button>
            </div>
          </ValidatorForm>
        </div>
      </AuthFrame>
    </div>
  );
}
