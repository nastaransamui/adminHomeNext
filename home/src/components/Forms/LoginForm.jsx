import formStyles from './form-style';
import {
  FormControlLabel,
  Checkbox,
  Grid,
  InputAdornment,
  IconButton,
  Button,
} from '@mui/material';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useText } from '../../../theme/common';
import { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { setCookies } from 'cookies-next';
import { useDispatch } from 'react-redux';

export const isRegex = (value) => {
  return ValidatorForm.addValidationRule('isRegex', (value) => {
    let reg =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/;
    if (value.match(reg)) {
      return true;
    } else {
      return false;
    }
  });
};
export default function LoginForm(props) {
  const classes = formStyles();
  const text = useText();
  const { router, setloginError } = props;
  const dispatch = useDispatch();
  const { t } = useTranslation('auth');
  const [values, setValues] = useState({
    email: '',
    password: '',
    showPassword: false,
  });
  const [check, setCheck] = useState(false);

  useEffect(() => {
    ValidatorForm.addValidationRule(isRegex(values.password));
    return () => {
      ValidatorForm.removeValidationRule('isRegex');
    };
  });

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleCheck = (event) => {
    setCheck(event.target.checked);
  };

  const handleSubmit = async () => {
    // console.log(values);
    const body = {
      username: values.email,
      password: values.password,
      strategy: 'local',
    };
    dispatch({ type: 'FORM_SUBMIT', payload: true });
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const { status } = res;
    const user = await res.json();

    if (status === 200 && user.success) {
      const { accessToken } = user;
      dispatch({ type: 'accessToken', payload: accessToken });
      setCookies('accessToken', accessToken);
      dispatch({ type: 'FORM_SUBMIT', payload: false });
      router.push(`/`, '/', {
        scroll: false,
        locale: router.locale,
      });
    } else {
      setloginError(user.user.message);
    }
  };

  return (
    <div>
      <ValidatorForm
        onError={(errors) => console.log(errors)}
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
            <TextValidator
              variant='filled'
              type={values.showPassword ? 'text' : 'password'}
              className={classes.input}
              label={t('login_password')}
              validators={['required', 'isRegex']}
              onChange={handleChange('password')}
              errorMessages={[t('form_require'), t('form_password_regex')]}
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
                      {values.showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
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
            label={<span className={text.caption}>{t('login_remember')}</span>}
          />
          <Button size='small' className={classes.buttonLink} href='#'>
            {t('login_forgot')}
          </Button>
        </div>
        <div className={classes.btnArea}>
          <Button
            variant='contained'
            fullWidth
            type='submit'
            color='secondary'
            size='large'>
            {t('login_continue')}
          </Button>
        </div>
      </ValidatorForm>
    </div>
  );
}
