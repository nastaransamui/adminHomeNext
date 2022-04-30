import { useEffect, useRef } from 'react';
import {
  VideoLibrary,
  AddPhotoAlternate,
  YouTube as YoutubeIcon,
  TextFormat,
  Delete,
} from '@mui/icons-material';
import { Grid, IconButton, Tooltip } from '@mui/material';

import { TextValidator } from 'react-material-ui-form-validator';
import CardHeader from '../../Card/CardHeader';
import CardAvatar from '../../Card/CardAvatar';
import movieAvatar from '../../../../public/images/faces/movie.jpg';
import imageAvatar from '../../../../public/images/faces/avatar1.jpg';
import { Player } from 'video-react';
import { Android12Switch } from '../../datasShow/headerView/FilterSwitch';
import YouTube from 'react-youtube';
import { useTranslation } from 'react-i18next';
import featureStyles from './feature-styles';

export const pushUrl = '/admin/dashboard/main-page-setup/features';
export const getUrl = `/admin/api/mainPageSetup/getOne`;
export const createUrl = `/admin/api/mainPageSetup/create`;
export const editUrl = `/admin/api/mainPageSetup/edit`;

export const youTubeIcon =
  'M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z';
export const movieIcon =
  'M18 3v2h-2V3H8v2H6V3H4v18h2v-2h2v2h8v-2h2v2h2V3h-2zM8 17H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2zm10 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z';

export const Stories = (
  rtlActive,
  values,
  setValues,
  uploadFile,
  deleteFile,
  formValueChanged,
  featureLinkBlob,
  featureThumbBlob
) => {
  const { t, i18n } = useTranslation('feature');

  const classes = featureStyles();
  const languagesArray = Object.keys(i18n.options.resources);
  const featureThumb = useRef(null);
  const featureLinkRef = useRef(null);
  // addValidator to text Validator
  useEffect(() => {
    let isMount = true;
    let observerfeatureThumbValue = null;
    let observerfeatureLinkRefValue = null;
    if (isMount) {
      observerfeatureThumbValue = featureThumb.current;
      observerfeatureLinkRefValue = featureLinkRef.current;
      if (values.featureLink !== '')
        observerfeatureLinkRefValue?.validate(values.featureLink);
      if (values.featureThumb !== '')
        observerfeatureThumbValue?.validate(values.featureThumb);
    }

    return () => {
      isMount = false;
      observerfeatureThumbValue = null;
      observerfeatureLinkRefValue = null;
    };
  }, [values]);

  return [
    {
      // First story
      inverted: true,
      badgeColor: 'primary',
      badgeIcon: VideoLibrary,
      title: t('UploadFeature'),
      badgeTooltip: t('UploadFeature'),
      titleColor: 'primary',
      body: (
        <CardHeader color='rose' icon>
          {values.featureLink !== '' && (
            <Tooltip title={t('featureDelete')} arrow>
              <IconButton
                disableFocusRipple
                disableRipple
                onClick={() => {
                  document.getElementById('featureLink').value = '';
                  deleteFile('featureLink');
                }}
                style={{
                  float: rtlActive ? 'left' : 'right',
                  position: 'relative',
                }}>
                <Delete color='error' />
              </IconButton>
            </Tooltip>
          )}
          {values.featureLink == '' ? (
            <CardAvatar profile style={{ cursor: 'pointer' }}>
              <label htmlFor='featureLink'>
                <Tooltip title={t('UploadFeature')} arrow>
                  <img
                    style={{ objectFit: 'cover', cursor: 'pointer' }}
                    src={movieAvatar.src}
                    alt='..'
                  />
                </Tooltip>
              </label>
            </CardAvatar>
          ) : (
            <label htmlFor='featureLink'>
              <span style={{ cursor: 'pointer' }}>
                <Player
                  autoPlay
                  aspectRatio='auto'
                  ref={(player) => {
                    // console.log(player);
                  }}
                  width={480}
                  height={272}
                  fluid={false}
                  preload='auto'
                  muted
                  src={featureLinkBlob}
                />
              </span>
            </label>
          )}
          <input
            type='file'
            id='featureLink'
            name='featureLink'
            hidden
            onChange={(e) => {
              uploadFile(e);
            }}
            accept='video/mp4,video/x-m4v,video/*'
          />
          <h4 className={classes.cardIconTitle}>
            <small>{values?.featureLink['name']}</small>
          </h4>
          <TextValidator
            validators={['required']}
            className={classes.root}
            variant='standard'
            type='hidden'
            id='file'
            ref={featureLinkRef}
            errorMessages={[t('required')]}
            value={values.featureLink}
          />
        </CardHeader>
      ),
      footerTitle:
        values?.featureLink['name'] !== undefined
          ? `${values?.featureLink['name']}`
          : ``,
    },
    {
      // Second story
      badgeColor: 'secondary',
      badgeIcon: AddPhotoAlternate,
      title: t('featureThumb'),
      badgeTooltip: t('featureThumb'),
      titleColor: 'secondary',
      body: (
        <CardHeader color='rose' icon>
          {values.featureThumb !== '' && (
            <Tooltip title={t('featureDelete')} arrow>
              <IconButton
                disableFocusRipple
                disableRipple
                onClick={() => {
                  document.getElementById('featureThumb').value = '';
                  deleteFile('featureThumb');
                }}
                style={{
                  position: 'absolute',
                }}>
                <Delete color='error' />
              </IconButton>
            </Tooltip>
          )}
          <CardAvatar profile style={{ cursor: 'pointer' }}>
            {values.featureThumb == '' ? (
              <label htmlFor='featureThumb'>
                <Tooltip title={t('featureThumb')} arrow>
                  <img
                    style={{ objectFit: 'cover', cursor: 'pointer' }}
                    src={imageAvatar.src}
                    alt='..'
                  />
                </Tooltip>
              </label>
            ) : (
              <label htmlFor='featureThumb' style={{ cursor: 'pointer' }}>
                <img
                  src={featureThumbBlob}
                  alt='..'
                  style={{ objectFit: 'cover' }}
                />
              </label>
            )}
            <input
              type='file'
              id='featureThumb'
              name='featureThumb'
              hidden
              onChange={(e) => {
                uploadFile(e);
              }}
              accept='image/png, image/jpeg'
            />
          </CardAvatar>
          <h4 className={classes.cardIconTitle}>
            <small>{values?.featureThumb['name']}</small>
          </h4>
          <TextValidator
            validators={['required']}
            className={classes.root}
            variant='standard'
            type='hidden'
            id='file'
            ref={featureThumb}
            errorMessages={[t('required')]}
            value={values.featureThumb}
          />
        </CardHeader>
      ),
      footerTitle:
        values?.featureThumb['name'] !== undefined
          ? `${values?.featureThumb['name']}`
          : ``,
    },
    {
      // Fourth story
      inverted: true,
      badgeColor: 'secondary',
      badgeIcon: YoutubeIcon,
      title: t('youTubeId'),
      badgeTooltip: t('youTubeId'),
      titleColor: 'secondary',
      body: (
        <Grid
          container
          alignItems='center'
          spacing={1}
          justifyContent='space-around'>
          <Grid item>
            {values.isYoutube && (
              <TextValidator
                className={classes.input}
                variant='standard'
                label={t('youTubeId')}
                name='youTubeId'
                value={values.youTubeId}
                onChange={(e) => {
                  formValueChanged(e);
                }}
                validators={values.isYoutube ? ['required'] : []}
                errorMessages={[t('required')]}
              />
            )}
          </Grid>
          <Grid item style={{ display: 'flex', alignItems: 'center' }}>
            <Grid item>{t('showYoutube')}</Grid>
            <Android12Switch
              color={!values.isYoutube ? 'secondary' : 'primary'}
              firsticon={movieIcon}
              secondicon={youTubeIcon}
              checked={!values.isYoutube}
              onChange={() => {
                values.isYoutube = !values.isYoutube;
                if (!values.isYoutube) values.youTubeId = '';
                setValues((oldValues) => ({ ...oldValues }));
              }}
              value={t('showYoutube')}
              inputProps={{ 'aria-label': 'checkbox' }}
            />
            <Grid item>{t('showMovie')}</Grid>
          </Grid>
          {values.youTubeId !== '' && (
            <Grid item sx={{ mt: 5, mb: 5 }} lg={12}>
              <YouTube videoId={values.youTubeId} className={classes.youtube} />
            </Grid>
          )}
        </Grid>
      ),
    },
    ...languagesArray.map((la, i) => {
      return {
        inverted: i % 2 !== 0,
        badgeColor: i % 2 == 0 ? 'primary' : 'secondary',
        badgeIcon: TextFormat,
        title: t(`title_${la}`),
        badgeTooltip: t(`title_${la}`),
        titleColor: i % 2 == 0 ? 'primary' : 'secondary',
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
              </Grid>{' '}
            </Grid>
          </>
        ),
      };
    }),
  ];
};
