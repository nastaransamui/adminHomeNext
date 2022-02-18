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
import { isRegex } from './LoginForm';
import CheckboxValidatorElement from './CheckboxValidatorElement';
import { useDispatch } from 'react-redux';

export default function RegisterForm(props) {
  const classes = formStyles();
  const { t } = useTranslation('auth');
  const text = useText();
  const { router } = props;
  const [check, setCheck] = useState(false);
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false,
    showPassword: false,
    showConfirmPassword: false,
  });
  useEffect(() => {
    ValidatorForm.addValidationRule(isRegex(values.password));
    ValidatorForm.addValidationRule('isTruthy', (value) => value);
    ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
      if (value !== values.password) {
        return false;
      }
      return true;
    });
    return () => {
      ValidatorForm.removeValidationRule('isRegex');
      ValidatorForm.removeValidationRule('isPasswordMatch');
      ValidatorForm.removeValidationRule('isTruthy');
    };
  });
  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleCheck = (event) => {
    setCheck(event.target.checked);
  };

  const handleSubmit = () => {
    console.log(values);
    dispatch({ type: 'FORM_SUBMIT', payload: true });
    setTimeout(() => {
      dispatch({ type: 'FORM_SUBMIT', payload: false });
      router.push('/', undefined, { locale: router.locale });
    }, 2000);
  };
  return (
    <div>
      <ValidatorForm
        // onError={(errors) => console.log(errors)}
        onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextValidator
              variant='filled'
              className={classes.input}
              label={t('register_name')}
              onChange={handleChange('name')}
              name='name'
              value={values.name}
              validators={['required']}
              errorMessages={[t('form_require')]}
            />
          </Grid>
          <Grid item xs={12}>
            <TextValidator
              variant='filled'
              className={classes.input}
              label={t('register_email')}
              onChange={handleChange('email')}
              name='email'
              value={values.email}
              validators={['required', 'isEmail']}
              errorMessages={[t('form_require'), t('form_email_require')]}
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <TextValidator
              variant='filled'
              type={values.showPassword ? 'text' : 'password'}
              className={classes.input}
              label={t('register_password')}
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
          <Grid item md={6} xs={12}>
            <TextValidator
              variant='filled'
              type={values.showConfirmPassword ? 'text' : 'password'}
              className={classes.input}
              label={t('register_confirm')}
              validators={['isPasswordMatch', 'required']}
              errorMessages={['register_mismatch', t('form_require')]}
              onChange={handleChange('confirmPassword')}
              name='confirm'
              value={values.confirmPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      aria-label='Toggle password visibility'
                      onClick={() => {
                        setValues({
                          ...values,
                          showConfirmPassword: !values.showConfirmPassword,
                        });
                      }}>
                      {values.showConfirmPassword ? (
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
        <div className={classes.btnArea}>
          <FormControlLabel
            control={
              <CheckboxValidatorElement
                value={check}
                validators={['isTruthy']}
                errorMessages={[t('form_require')]}
                onChange={(e) => handleCheck(e)}
                checked={check}
                className={classes.check}
              />
            }
            label={
              <span className={text.caption}>
                {t('form_terms')}
                &nbsp;
                <a href='#'>{t('form_privacy')}</a>
              </span>
            }
          />
          <Button
            variant='contained'
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
