import { useTranslation } from 'next-i18next';
import AuthFrame from '../../components/Forms/AuthFrame';
import clsx from 'clsx';
import { Icon, Button, Typography, useTheme } from '@mui/material';
import link from '../../../public/text/link';
import TitleWithDesc from '../../components/Title/TitleWithDesc';
import formStyles from '../../components/Forms/form-style';
import LoginForm from '../../components/Forms/LoginForm';
import { useState } from 'react';
import RegisterForm from '../../components/Forms/RegisterForm';
import SocialAuth from '../../components/Forms/SocialAuth';
import Alert from 'react-s-alert';
import CustomAlert from '../../components/Alert/CustomAlert';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

export default function AuthPage(props) {
  const { t } = useTranslation('auth');
  const classes = formStyles();
  const { router } = props;
  const [componentToMount, setComponentToMount] = useState(
    router.asPath.slice(1)
  );
  const [loginError, setloginError] = useState('');
  const { formSubmit } = useSelector((state) => state);
  const dispatch = useDispatch();
  const theme = useTheme();

  useEffect(() => {
    let isMount = true;
    if (isMount && formSubmit && loginError !== '') {
      Alert.error('', {
        customFields: {
          message: t(`${loginError}`),
          styles: {
            backgroundColor: theme.palette.secondary.dark,
          },
        },
        onClose: function () {
          dispatch({ type: 'FORM_SUBMIT', payload: false });
          setloginError("")
        },
        timeout: 'none',
        position: 'bottom',
        effect: 'bouncyflip',
      });
    }
    return () => {
      isMount = false;
    };
  }, [formSubmit, loginError]);

  return (
    <div>
      {formSubmit && <Alert contentTemplate={CustomAlert} />}
      <AuthFrame
        {...props}
        title={
          componentToMount == 'login' ? t('login_title') : t('register_title')
        }
        subtitle={
          componentToMount == 'login'
            ? t('login_subtitle')
            : t('register_subtitle')
        }>
        <div>
          <div className={classes.head}>
            <TitleWithDesc
              head={componentToMount == 'login' ? t('login') : t('register')}
              desc=''
              align='left'
              color='secondary'
            />
            <Button
              size='small'
              onClick={() => {
                componentToMount == 'login'
                  ? setComponentToMount('register')
                  : setComponentToMount('login');
              }}>
              {router.locale == 'fa' ? (
                <Icon className={clsx(classes.icon, classes.signArrow)}>
                  arrow_backward
                </Icon>
              ) : (
                <Icon className={clsx(classes.icon, classes.signArrow)}>
                  arrow_forward
                </Icon>
              )}
              {componentToMount == 'login'
                ? t('login_create')
                : t('register_already')}
            </Button>
          </div>
          <SocialAuth />
          <div className={classes.separator}>
            <Typography>{t('login_or')}</Typography>
          </div>
          {componentToMount == 'login' ? (
            <LoginForm {...props} setloginError={setloginError} />
          ) : (
            <RegisterForm {...props} />
          )}
        </div>
      </AuthFrame>
    </div>
  );
}
