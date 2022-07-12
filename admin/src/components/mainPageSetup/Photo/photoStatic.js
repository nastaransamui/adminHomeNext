import { useEffect, useRef } from 'react';
import { PhotoLibrary, TextFormat, Delete } from '@mui/icons-material';
import { Grid, IconButton, Tooltip } from '@mui/material';

import { TextValidator } from 'react-material-ui-form-validator';
import CardHeader from '../../Card/CardHeader';
import CardAvatar from '../../Card/CardAvatar';
import movieAvatar from '../../../../public/images/faces/movie.jpg';

import { useTranslation } from 'react-i18next';
import photoStyle from './photo-styles';

export const createUrl = `/admin/api/mainPageSetup/create`;

export const getUrl = `/admin/api/mainPageSetup/getOne`;
export const editUrl = `/admin/api/mainPageSetup/edit`;

export const Stories = (
  rtlActive,
  values,
  setValues,
  uploadFile,
  deleteFile,
  formValueChanged,
  imageBlob
) => {
  const { t, i18n } = useTranslation('photos');

  const classes = photoStyle();
  const languagesArray = Object.keys(i18n.options.resources);

  const imageRef = useRef(null);
  // addValidator to text Validator
  useEffect(() => {
    let isMount = true;
    let observerImageRefValue = null;
    if (isMount) {
      observerImageRefValue = imageRef.current;
      if (values.imageShow !== '')
        observerImageRefValue?.validate(values.imageShow);
    }

    return () => {
      isMount = false;
      observerImageRefValue = null;
    };
  }, [values]);

  return [
    {
      // First story
      inverted: true,
      badgeColor: 'primary',
      badgeIcon: PhotoLibrary,
      title: t('UploadImage'),
      badgeTooltip: t('UploadImage'),
      titleColor: 'primary',
      body: (
        <CardHeader color='rose' icon>
          {values.imageShow !== '' && (
            <Tooltip title={t('videoDelete')} arrow>
              <IconButton
                disableFocusRipple
                disableRipple
                onClick={() => {
                  document.getElementById('imageShow').value = '';
                  deleteFile('imageShow');
                }}
                style={{
                  float: rtlActive ? 'left' : 'right',
                  position: 'relative',
                }}>
                <Delete color='error' />
              </IconButton>
            </Tooltip>
          )}
          {values.imageShow == '' ? (
            <CardAvatar profile style={{ cursor: 'pointer' }}>
              <label htmlFor='imageShow'>
                <Tooltip title={t('UploadImage')} arrow>
                  <img
                    style={{ objectFit: 'cover', cursor: 'pointer' }}
                    src={movieAvatar.src}
                    alt='..'
                  />
                </Tooltip>
              </label>
            </CardAvatar>
          ) : (
            <label htmlFor='imageShow'>
              <CardAvatar
                plain
                style={{
                  cursor: 'pointer',
                }}>
                <label
                  htmlFor='imageShow'
                  style={{ display: 'flex', justifyContent: 'center' }}>
                  <Tooltip title={t('UploadImage')} arrow>
                    <img
                      style={{
                        objectFit: 'cover',
                        cursor: 'pointer',
                        width: '50%',
                        borderRadius: 5,
                      }}
                      src={imageBlob}
                      alt='..'
                    />
                  </Tooltip>
                </label>
              </CardAvatar>
            </label>
          )}
          <input
            type='file'
            id='imageShow'
            name='imageShow'
            hidden
            onChange={(e) => {
              uploadFile(e);
            }}
            accept='image/png, image/jpeg'
          />
          <h4 className={classes.cardIconTitle}>
            <small></small>
          </h4>
          <TextValidator
            validators={['required']}
            className={classes.root}
            variant='standard'
            type='hidden'
            id='file'
            ref={imageRef}
            errorMessages={[t('required')]}
            value={values.imageShow}
          />
        </CardHeader>
      ),
      footerTitle:
        values?.imageShow !== '' ? `${values?.imageShow['name']}` : ``,
    },
    ...languagesArray.map((la, i) => {
      return {
        inverted: i % 2 !== 0,
        badgeColor: i % 2 !== 0 ? 'primary' : 'secondary',
        badgeIcon: TextFormat,
        title: t(`title_${la}`),
        badgeTooltip: t(`title_${la}`),
        titleColor: i % 2 !== 0 ? 'primary' : 'secondary',
        body: (
          <>
            <Grid container>
              <Grid item md={6} lg={6}>
                <TextValidator
                  className={classes.input}
                  variant='standard'
                  label={t(`title_${la}`)}
                  name={`title_${la}`}
                  value={values[`title_${la}`]}
                  onChange={(e) => {
                    formValueChanged(e);
                  }}
                  validators={['required']}
                  errorMessages={[t('required')]}
                />
              </Grid>
              <Grid item md={6} lg={6}>
                <TextValidator
                  className={classes.input}
                  variant='standard'
                  label={t(`topTitle_${la}`)}
                  name={`topTitle_${la}`}
                  value={values[`topTitle_${la}`]}
                  onChange={(e) => {
                    formValueChanged(e);
                  }}
                  validators={['required']}
                  errorMessages={[t('required')]}
                />
              </Grid>
              <Grid item md={6} lg={6}>
                <TextValidator
                  className={classes.input}
                  variant='standard'
                  label={t(`subTitle_${la}`)}
                  name={`subTitle_${la}`}
                  value={values[`subTitle_${la}`]}
                  onChange={(e) => {
                    formValueChanged(e);
                  }}
                  validators={['required']}
                  errorMessages={[t('required')]}
                />
              </Grid>
              <Grid item md={6} lg={6}>
                <TextValidator
                  className={classes.input}
                  variant='standard'
                  label={t(`button_${la}`)}
                  name={`button_${la}`}
                  value={values[`button_${la}`]}
                  onChange={(e) => {
                    formValueChanged(e);
                  }}
                  validators={['required']}
                  errorMessages={[t('required')]}
                />
              </Grid>
            </Grid>
          </>
        ),
      };
    }),
  ];
};
