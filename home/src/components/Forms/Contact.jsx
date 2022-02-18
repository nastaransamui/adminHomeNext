import { useTranslation } from 'next-i18next';
import formStyle from './form-style';
import { useState, forwardRef } from 'react';
import clsx from 'clsx';
import {
  Button,
  Hidden,
  useMediaQuery,
  IconButton,
  FormControlLabel,
  Paper,
  Checkbox,
  Container,
  Grid,
  Typography,
  Snackbar,
} from '@mui/material';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import brand from '../../../public/text/brand';
import link from '../../../public/text/link';
import { useText } from '../../../theme/common';
import { useTheme } from '@mui/styles';
import MuiAlert from '@mui/material/Alert';


const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


export default function Contact(props) {
  const classes = formStyle();
  const text = useText();
  const { router } = props;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { t } = useTranslation('contact');
  const [values, setValues] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
  });

  const [openNotif, setOpenNotif] = useState(false);
  const [check, setCheck] = useState(false);

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };
  const handleCheck = (e) => {
    setCheck(e.target.checked);
  };
  const handleSubmit = () => {
    setOpenNotif(true);
  };

  const handleClose = () => {
    setOpenNotif(false);
  };
  return (
    <div className={classes.pageWrap}>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        key='top right'
        open={openNotif}
        autoHideDuration={4000}
        onClose={handleClose}
        ContentProps={{
          'aria-describedby': 'message-id',
        }}
      >
        <Alert onClose={handleClose} severity='success' sx={{ width: '100%' }}>
        {t('messageSucces')}
        </Alert>
      </Snackbar>
      <Hidden mdUp>
        <div className={clsx(classes.logo, classes.logoHeader)}>
          <a href={link.panel[`home_${router.locale}`]}>
            <img src='/images/logo.svg' alt='' />
            <Typography component='span' className={text.subtitle2}>
              {brand[`projectName_${router.locale}`]}
            </Typography>
          </a>
        </div>
      </Hidden>
      <Container maxWidth='md' className={classes.innerWrap}>
        <IconButton
          href={`/${router.locale}/`}
          className={classes.backtohome}>
          <i className='ion-ios-home-outline' />
          <i className='ion-ios-arrow-thin-left' />
        </IconButton>
        <Paper className={clsx(classes.formBox, 'fragment-fadeUp')}>
          <div className={classes.fullFromWrap}>
            <Typography
              variant='h3'
              align='center'
              className={clsx(classes.title, text.title)}
              gutterBottom>
              {t('contact_title2')}
            </Typography>
            <Typography className={clsx(classes.desc, text.subtitle2)}>
              {t('contact_subtitle')}
            </Typography>
            <div className={classes.form}>
              <ValidatorForm
                onSubmit={handleSubmit}
                onError={(errors) => console.log(errors)}>
                <Grid container spacing={6}>
                  <Grid item md={6} xs={12}>
                    <TextValidator
                      variant='filled'
                      className={clsx(classes.input, classes.light)}
                      label={t('form_name')}
                      onChange={handleChange('name')}
                      name='Name'
                      value={values.name}
                      validators={['required']}
                      errorMessages={t('form_require')}
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextValidator
                      variant='filled'
                      className={clsx(classes.input, classes.light)}
                      label={t('form_email')}
                      onChange={handleChange('email')}
                      name='Email'
                      value={values.email}
                      validators={['required', 'isEmail']}
                      errorMessages={[t('form_require'), t('form_email_require')]}
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextValidator
                      variant='filled'
                      className={clsx(classes.input, classes.light)}
                      label={t('form_phone')}
                      onChange={handleChange('phone')}
                      name='Phone'
                      value={values.phone}
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextValidator
                      variant='filled'
                      className={clsx(classes.input, classes.light)}
                      label={t('form_company')}
                      onChange={handleChange('company')}
                      name='Company'
                      value={values.company}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextValidator
                      variant='filled'
                      multiline
                      rows='6'
                      className={clsx(classes.input, classes.light)}
                      label={t('form_message')}
                      onChange={handleChange('message')}
                      name='Message'
                      value={values.message}
                    />
                  </Grid>
                </Grid>
                <div className={clsx(classes.btnArea, classes.flex)}>
                  <FormControlLabel
                    control={
                      <Checkbox
                      className={classes.check}
                        checked={check}
                        onChange={(e) => handleCheck(e)}
                        color='secondary'
                        value='check'
                      />
                    }
                    label={
                      <span>
                        {t('form_terms')}
                        <br />
                        <a href='#'>{t('form_privacy')}</a>
                      </span>
                    }
                  />
                  <Button
                    variant='contained'
                    fullWidth={isMobile}
                    type='submit'
                    color='secondary'
                    size='large'>
                    {t('form_send')}
                  </Button>
                </div>
              </ValidatorForm>
            </div>
          </div>
        </Paper>
      </Container>
    </div>
  );
}
