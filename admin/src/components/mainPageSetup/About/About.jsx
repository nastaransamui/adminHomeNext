import aboutStyles from './about-styles';
import Container from '@mui/material/Container';
import Slider from '@mui/material/Slider';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Hidden from '@mui/material/Hidden';
import { useTheme } from '@mui/styles';
import { Delete } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import Heading from '../../Heading/Heading';
import aboutHook from './aboutHook';
import clsx from 'clsx';
import imageAvatar from '../../../../public/images/faces/avatar1.jpg';
import { useEffect, useRef } from 'react';
import useButtonActivation from '../../Hooks/useButtonActivation';

export default function Feature(props) {
  const { rtlActive, reactRoutes } = props;
  const theme = useTheme();
  const classes = aboutStyles();
  const {
    values,
    uploadFile,
    deleteFile,
    formValueChanged,
    firstThumbBlob,
    secondThumbBlob,
    thirdThumbBlob,
    submitForm,
    aboutRoute,
  } = aboutHook(reactRoutes);
  const { updateButtonDisabled } = useButtonActivation(aboutRoute);
  const { t } = useTranslation('about');
  const firstThumbRef = useRef(null);
  const secondThumbRef = useRef(null);
  const thirdThumbRef = useRef(null);
  useEffect(() => {
    let isMount = true;
    let observeFirst = null;
    let observeSecond = null;
    let observeThird = null;
    if (isMount) {
      observeFirst = firstThumbRef.current;
      observeSecond = secondThumbRef.current;
      observeThird = thirdThumbRef.current;
      if (values.firstThumb !== '') observeFirst?.validate(values.firstThumb);
      if (values.secondThumb !== '')
        observeSecond?.validate(values.secondThumb);
      if (values.thirdThumb !== '') observeThird?.validate(values.thirdThumb);
    }
    return () => {
      isMount = false;
      observeFirst = null;
      observeSecond = null;
      observeThird = null;
    };
  }, [values]);

  return (
    <div style={{ minWidth: '100%' }}>
      <Heading title={t('AboutTitle')} textAlign='center' />
      <ValidatorForm onSubmit={submitForm}>
        <div className={classes.root}>
          <Container fixed>
            <Grid container justify='center' spacing={2}>
              <Grid item lg={6} md={12} xs={12} className={classes.imageGrid}>
                <div className={clsx(classes.illustration, classes.one)} />

                {values.firstThumb !== '' && (
                  <>
                    <Tooltip title={t('photoHorizen')} arrow>
                      <span>
                        <Slider
                          sx={{ height: 210 }}
                          aria-label='firstTop'
                          defaultValue={values.firstTop}
                          disabled={updateButtonDisabled}
                          name='firstTop'
                          size='small'
                          value={values.firstTop}
                          orientation='vertical'
                          color='secondary'
                          min={-100}
                          max={50}
                          className={classes.firstTop}
                          onChange={(e) => {
                            formValueChanged(e);
                          }}
                        />
                      </span>
                    </Tooltip>
                    <Tooltip title={t('thumbDelete')} arrow>
                      <span>
                      <IconButton
                        disableFocusRipple
                        disableRipple
                        disabled={updateButtonDisabled}
                        onClick={() => {
                          document.getElementById('firstThumb').value = '';
                          deleteFile('firstThumb');
                        }}
                        className={classes.firstDelete}>
                        <Delete style={{ color: updateButtonDisabled ? theme.palette.text.disabled : theme.palette.error.main }}  />
                      </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip title={t('photoVertical')} arrow>
                      <span>
                      <Slider
                        sx={{ width: 210 }}
                        aria-label='firstRight'
                        disabled={updateButtonDisabled}
                        defaultValue={values.firstRight}
                        size='small'
                        value={values.firstRight}
                        color='secondary'
                        min={-100}
                        max={50}
                        name='firstRight'
                        className={classes.firstRight}
                        onChange={(e) => {
                          formValueChanged(e);
                        }}
                      />
                      </span>
                    </Tooltip>
                  </>
                )}
                <figure className={clsx(classes.illustration, classes.two)}>
                  {values.firstThumb == '' ? (
                    <label htmlFor='firstThumb'>
                      <Tooltip title={t('456x304')} arrow>
                        <img
                          style={{
                            position: 'absolute',
                            top: -4,
                            right: rtlActive ? -12 : -34,
                            cursor: 'pointer',
                          }}
                          src={imageAvatar.src}
                          alt='about'
                        />
                      </Tooltip>
                    </label>
                  ) : (
                    <label htmlFor='firstThumb' style={{ cursor: 'pointer' }}>
                      <img
                        src={firstThumbBlob}
                        alt='..'
                        style={{
                          position: 'absolute',
                          top: values.firstTop,
                          right: values.firstRight,
                          cursor: 'pointer',
                        }}
                      />
                    </label>
                  )}
                  <input
                    type='file'
                    id='firstThumb'
                    name='firstThumb'
                    disabled={updateButtonDisabled}
                    hidden
                    onChange={(e) => {
                      uploadFile(e);
                    }}
                    accept='image/png, image/jpeg'
                  />
                </figure>
                <TextValidator
                  validators={['required']}
                  className={classes.firstValidator}
                  variant='standard'
                  type='hidden'
                  id='file'
                  ref={firstThumbRef}
                  errorMessages={[t('required')]}
                  value={values.firstThumb}
                />
                {values.secondThumb !== '' && (
                  <>
                    <Tooltip title={t('photoHorizen')} arrow>
                      <span>
                      <Slider
                        sx={{ height: 180 }}
                        aria-label='secondTop'
                        defaultValue={values.secondTop}
                        size='small'
                        disabled={updateButtonDisabled}
                        value={values.secondTop}
                        name='secondTop'
                        orientation='vertical'
                        color='secondary'
                        min={-100}
                        max={50}
                        className={classes.secondTop}
                        onChange={(e) => {
                          formValueChanged(e);
                        }}
                      />
                      </span>
                    </Tooltip>
                    <Tooltip title={t('thumbDelete')} arrow>
                      <IconButton
                        disableFocusRipple
                        disableRipple
                        onClick={() => {
                          document.getElementById('secondThumb').value = '';
                          deleteFile('secondThumb');
                        }}
                        className={classes.secondDelete}>
                        <Delete style={{ color: updateButtonDisabled ? theme.palette.text.disabled : theme.palette.error.main }}  />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t('photoVertical')} arrow>
                      <span>
                      <Slider
                        sx={{ width: 150 }}
                        aria-label='secondRight'
                        defaultValue={values.secondRight}
                        size='small'
                        disabled={updateButtonDisabled}
                        name='secondRight'
                        value={values.secondRight}
                        color='secondary'
                        min={-100}
                        max={50}
                        className={classes.secondRight}
                        onChange={(e) => {
                          formValueChanged(e);
                        }}
                      />
                      </span>
                    </Tooltip>
                  </>
                )}
                <figure className={clsx(classes.illustration, classes.three)}>
                  {values.secondThumb == '' ? (
                    <label htmlFor='secondThumb'>
                      <Tooltip title={t('456x304')} arrow>
                        <img
                          style={{
                            position: 'absolute',
                            top: -4,
                            right: rtlActive ? -12 : -27,
                            cursor: 'pointer',
                          }}
                          src={imageAvatar.src}
                          alt='about'
                        />
                      </Tooltip>
                    </label>
                  ) : (
                    <label htmlFor='secondThumb' style={{ cursor: 'pointer' }}>
                      <img
                        src={secondThumbBlob}
                        alt='..'
                        style={{
                          position: 'absolute',
                          top: values.secondTop,
                          right: values.secondRight,
                          cursor: 'pointer',
                        }}
                      />
                    </label>
                  )}
                  <input
                    type='file'
                    id='secondThumb'
                    name='secondThumb'
                    disabled={updateButtonDisabled}
                    hidden
                    onChange={(e) => {
                      uploadFile(e);
                    }}
                    accept='image/png, image/jpeg'
                  />
                </figure>
                <TextValidator
                  validators={['required']}
                  className={classes.secondValidator}
                  variant='standard'
                  type='hidden'
                  id='file'
                  ref={secondThumbRef}
                  errorMessages={[t('required')]}
                  value={values.secondThumb}
                />
                {values.thirdThumb !== '' && (
                  <>
                    <Tooltip title={t('photoHorizen')} arrow>
                      <span>
                      <Slider
                        sx={{ height: 210 }}
                        aria-label='thirdTop'
                        defaultValue={values.thirdTop}
                        disabled={updateButtonDisabled}
                        size='small'
                        name='thirdTop'
                        value={values.thirdTop}
                        orientation='vertical'
                        color='secondary'
                        min={-100}
                        max={50}
                        className={classes.thirdTop}
                        onChange={(e) => {
                          formValueChanged(e);
                        }}
                      />
                      </span>
                    </Tooltip>
                    <Tooltip title={t('thumbDelete')} arrow>
                      <span>
                      <IconButton
                        disableFocusRipple
                        disabled={updateButtonDisabled}
                        disableRipple
                        onClick={() => {
                          document.getElementById('thirdThumb').value = '';
                          deleteFile('thirdThumb');
                        }}
                        className={classes.thirdDelete}>
                         <Delete style={{ color: updateButtonDisabled ? theme.palette.text.disabled : theme.palette.error.main }}  />
                      </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip title={t('photoVertical')} arrow>
                      <span>
                      <Slider
                        sx={{ width: 210 }}
                        aria-label='thirdRight'
                        defaultValue={values.thirdRight}
                        disabled={updateButtonDisabled}
                        name='thirdRight'
                        size='small'
                        value={values.thirdRight}
                        color='secondary'
                        min={-100}
                        max={50}
                        className={classes.thirdRight}
                        onChange={(e) => {
                          formValueChanged(e);
                        }}
                      />
                      </span>
                    </Tooltip>
                  </>
                )}
                <figure className={clsx(classes.illustration, classes.four)}>
                  {values.thirdThumb == '' ? (
                    <label htmlFor='thirdThumb'>
                      <Tooltip title={t('456x304')} arrow>
                        <img
                          style={{
                            position: 'absolute',
                            top: -4,
                            right: rtlActive ? -12 : -41,
                            cursor: 'pointer',
                          }}
                          src={imageAvatar.src}
                          alt='about'
                        />
                      </Tooltip>
                    </label>
                  ) : (
                    <label htmlFor='thirdThumb' style={{ cursor: 'pointer' }}>
                      <img
                        src={thirdThumbBlob}
                        alt='..'
                        style={{
                          position: 'absolute',
                          top: values.thirdTop,
                          right: values.thirdRight,
                          cursor: 'pointer',
                        }}
                      />
                    </label>
                  )}
                  <input
                    type='file'
                    id='thirdThumb'
                    name='thirdThumb'
                    disabled={updateButtonDisabled}
                    hidden
                    onChange={(e) => {
                      uploadFile(e);
                    }}
                    accept='image/png, image/jpeg'
                  />
                </figure>
                <TextValidator
                  validators={['required']}
                  className={classes.thirdValidator}
                  variant='standard'
                  type='hidden'
                  id='file'
                  ref={thirdThumbRef}
                  errorMessages={[t('required')]}
                  value={values.thirdThumb}
                />
                <Hidden smDown>
                  {' '}
                  <div className={clsx(classes.illustration, classes.fiv)} />
                </Hidden>
              </Grid>
              <Grid item lg={6} md={12} xs={12}>
                <Grid
                  container
                  spacing={2}
                  className={`animate__animated animate__fadeIn${
                    rtlActive ? 'Right' : 'Left'
                  }`}>
                  <Grid item lg={6} md={6} sm={12} xs={12}>
                    <TextValidator
                      fullWidth
                      className={classes.input}
                      disabled={updateButtonDisabled}
                      variant='standard'
                      label={t('title_en')}
                      name='title_en'
                      value={values.title_en}
                      onChange={(e) => {
                        formValueChanged(e);
                      }}
                      validators={['required']}
                      errorMessages={[t('required')]}
                    />
                  </Grid>
                  <Grid item lg={6} md={6} sm={12} xs={12}>
                    <TextValidator
                      fullWidth
                      className={classes.input}
                      disabled={updateButtonDisabled}
                      variant='standard'
                      label={t('title_fa')}
                      name='title_fa'
                      value={values.title_fa}
                      onChange={(e) => {
                        formValueChanged(e);
                      }}
                      validators={['required']}
                      errorMessages={[t('required')]}
                    />
                  </Grid>
                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <TextValidator
                      className={classes.input}
                      disabled={updateButtonDisabled}
                      multiline
                      rows={4}
                      fullWidth
                      label={t('desc_en')}
                      onChange={(e) => {
                        formValueChanged(e);
                      }}
                      value={values.desc_en}
                      name='desc_en'
                      variant='standard'
                      validators={['required']}
                      errorMessages={[t('required')]}
                    />
                  </Grid>
                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <TextValidator
                      className={classes.input}
                      disabled={updateButtonDisabled}
                      multiline
                      rows={4}
                      fullWidth
                      label={t('desc_fa')}
                      onChange={(e) => {
                        formValueChanged(e);
                      }}
                      value={values.desc_fa}
                      name='desc_fa'
                      variant='standard'
                      validators={['required']}
                      errorMessages={[t('required')]}
                    />
                  </Grid>
                  <Grid item lg={6} md={6} sm={12} xs={12}>
                    <TextValidator
                      className={classes.input}
                      disabled={updateButtonDisabled}
                      fullWidth
                      variant='standard'
                      label={t('button_en')}
                      name='button_en'
                      value={values.button_en}
                      onChange={(e) => {
                        formValueChanged(e);
                      }}
                      validators={['required']}
                      errorMessages={[t('required')]}
                    />
                  </Grid>
                  <Grid item lg={6} md={6} sm={12} xs={12}>
                    <TextValidator
                      className={classes.input}
                      disabled={updateButtonDisabled}
                      fullWidth
                      variant='standard'
                      label={t('button_fa')}
                      name='button_fa'
                      value={values.button_fa}
                      onChange={(e) => {
                        formValueChanged(e);
                      }}
                      validators={['required']}
                      errorMessages={[t('required')]}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Container>
        </div>
        <Button
          fullWidth
          type='submit'
          variant='contained'
          color='secondary'
          disabled={updateButtonDisabled}
          style={{ marginBottom: 30 }}>
          {t('submit')}
        </Button>
      </ValidatorForm>
    </div>
  );
}
