import { ValidatorForm } from 'react-material-ui-form-validator';

import Alert from 'react-s-alert';
import { setCookies } from 'cookies-next';

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

export const handleSubmit = async (values, router, t, theme) => {
  const { email, password } = values;
  console.log(values);
};

export const handleChange = (name, setValues, values) => (event) => {
  setValues({ ...values, [name]: event.target.value });
};

export const handleCheck = (event, setCheck) => {
  setCheck(event.target.checked);
};

export const handleThemeName = (pallet, dispatch) => {
  localStorage.setItem('adminThemeName', pallet);
  dispatch({ type: 'ADMIN_THEMENAME', payload: pallet });
};

export const handleLanguage = (lang, i18n) => {
  localStorage.setItem('i18nextLng', lang);
  i18n.changeLanguage(lang);
};

export const handleMode = (modeType, dispatch) => {
  localStorage.setItem('adminThemeType', modeType);
  dispatch({ type: 'ADMIN_THEMETYPE', payload: modeType });
};

export const handleLangSelectChange = (setValues, e) => {
  setValues((oldValues) => ({
    ...oldValues,
    [e.target.name]: e.target.value,
  }));
};
