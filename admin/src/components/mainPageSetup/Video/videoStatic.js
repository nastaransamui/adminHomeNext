import { useEffect, useRef, useLayoutEffect, useState } from 'react';
import VideoLibrary from '@mui/icons-material/VideoLibrary';
import AddPhotoAlternate from '@mui/icons-material/AddPhotoAlternate';
import { YouTube as YoutubeIcon } from '@mui/icons-material';
import TextFormat from '@mui/icons-material/TextFormat';
import Delete from '@mui/icons-material/Delete';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import { TextValidator } from 'react-material-ui-form-validator';
import CardHeader from '../../Card/CardHeader';
import CardAvatar from '../../Card/CardAvatar';
import movieAvatar from '../../../../public/images/faces/movie.jpg';
import imageAvatar from '../../../../public/images/faces/avatar1.jpg';
import { Player } from 'video-react';
import { Android12Switch } from '../../datasShow/headerView/FilterSwitch';
import YouTube from 'react-youtube';
import { useTranslation } from 'react-i18next';
import videoStyles from './video-styles';

import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

export const getUrl = `/admin/api/mainPageSetup/getOne`;
export const createUrl = `/admin/api/modelsCrud/create`;
export const editUrl = `/admin/api/modelsCrud/edit`;

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
  videoLinkBlob,
  imageMobileBlob,
  videoPosterBlob
) => {
  const theme = useTheme();
  const { t, i18n } = useTranslation('video');
  const xl = useMediaQuery(theme.breakpoints.only('xl'));
  const lg = useMediaQuery(theme.breakpoints.only('lg'));
  const md = useMediaQuery(theme.breakpoints.only('md'));
  const sm = useMediaQuery(theme.breakpoints.only('sm'));
  const xs = useMediaQuery(theme.breakpoints.only('xs'));
  const classes = videoStyles();
  const languagesArray = Object.keys(i18n.options.resources);
  const fileInput = useRef(null);
  const mobileImageRef = useRef(null);
  const videoPosterRef = useRef(null);
  const span = useRef(null);
  const [videoWidth, setVideoWidth] = useState(0);
  // addValidator to text Validator
  useEffect(() => {
    let isMount = true;
    let observerRefValue = null;
    let observerMobileImageRefValue = null;
    let observervideoPosterRefValue = null;
    if (isMount) {
      observerRefValue = fileInput.current;
      observerMobileImageRefValue = mobileImageRef.current;
      observervideoPosterRefValue = videoPosterRef.current;
      if (values.videoLink !== '') observerRefValue?.validate(values.videoLink);
      if (values.videoPoster !== '')
        observervideoPosterRefValue?.validate(values.videoPoster);
      if (values.imageMobileShow !== '')
        observerMobileImageRefValue?.validate(values.imageMobileShow);
    }

    return () => {
      isMount = false;
      observerRefValue = null;
      observerMobileImageRefValue = null;
      observervideoPosterRefValue = null;
    };
  }, [values]);

  useLayoutEffect(() => {
    setVideoWidth(span?.current?.offsetWidth);
  });

  return [
    {
      // First story
      inverted: true,
      badgeColor: 'primary',
      badgeIcon: VideoLibrary,
      title: t('UploadVideo'),
      badgeTooltip: t('UploadVideo'),
      titleColor: 'primary',
      body: (
        <CardHeader color='rose' icon ref={span}>
          {values.videoLink !== '' && (
            <Tooltip title={t('videoDelete')} arrow>
              <IconButton
                disableFocusRipple
                disableRipple
                onClick={() => {
                  document.getElementById('videoLink').value = '';
                  deleteFile('videoLink');
                }}
                style={{
                  float: rtlActive ? 'left' : 'right',
                  position: 'relative',
                  zIndex: 10,
                }}>
                <Delete color='error' />
              </IconButton>
            </Tooltip>
          )}
          {values.videoLink == '' ? (
            <CardAvatar profile style={{ cursor: 'pointer' }}>
              <label htmlFor='videoLink'>
                <Tooltip title={t('UploadVideo')} arrow>
                  <img
                    style={{ objectFit: 'cover', cursor: 'pointer' }}
                    src={movieAvatar.src}
                    alt='..'
                  />
                </Tooltip>
              </label>
            </CardAvatar>
          ) : (
            <label htmlFor='videoLink'>
              <span style={{ cursor: 'pointer' }}>
                <Player
                  autoPlay
                  aspectRatio='auto'
                  ref={(player) => {
                    // console.log(player);
                  }}
                  width={videoWidth}
                  height={228}
                  fluid={false}
                  preload='auto'
                  muted
                  src={videoLinkBlob}
                />
              </span>
            </label>
          )}
          <input
            type='file'
            id='videoLink'
            name='videoLink'
            hidden
            onChange={(e) => {
              uploadFile(e);
            }}
            accept='video/mp4,video/x-m4v,video/*'
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
            ref={fileInput}
            errorMessages={[t('required')]}
            value={values.videoLink}
          />
        </CardHeader>
      ),
      footerTitle:
        values?.videoLink['name'] !== undefined
          ? `${values?.videoLink['name']}`
          : ``,
    },
    {
      // Second story
      badgeColor: 'secondary',
      badgeIcon: AddPhotoAlternate,
      title: t('imageMobileShow'),
      badgeTooltip: t('imageMobileShow'),
      titleColor: 'secondary',
      body: (
        <CardHeader color='rose' icon>
          {values.imageMobileShow !== '' && (
            <Tooltip title={t('videoDelete')} arrow>
              <IconButton
                disableFocusRipple
                disableRipple
                onClick={() => {
                  document.getElementById('imageMobileShow').value = '';
                  deleteFile('imageMobileShow');
                }}
                style={{
                  position: 'absolute',
                }}>
                <Delete color='error' />
              </IconButton>
            </Tooltip>
          )}
          <CardAvatar profile style={{ cursor: 'pointer', marginTop: 10 }}>
            {values.imageMobileShow == '' ? (
              <label htmlFor='imageMobileShow'>
                <Tooltip title={t('imageMobileShow')} arrow>
                  <img
                    style={{ objectFit: 'cover', cursor: 'pointer' }}
                    src={imageAvatar.src}
                    alt='..'
                  />
                </Tooltip>
              </label>
            ) : (
              <label htmlFor='imageMobileShow' style={{ cursor: 'pointer' }}>
                <img
                  src={imageMobileBlob}
                  alt='..'
                  style={{ objectFit: 'cover' }}
                />
              </label>
            )}
            <input
              type='file'
              id='imageMobileShow'
              name='imageMobileShow'
              hidden
              onChange={(e) => {
                uploadFile(e);
              }}
              accept='image/png, image/jpeg'
            />
          </CardAvatar>
          <h4 className={classes.cardIconTitle}>
            <small></small>
          </h4>
          <TextValidator
            validators={['required']}
            className={classes.root}
            variant='standard'
            type='hidden'
            id='file'
            ref={mobileImageRef}
            errorMessages={[t('required')]}
            value={values.imageMobileShow}
          />
        </CardHeader>
      ),
      footerTitle:
        values?.imageMobileShow['name'] !== undefined
          ? `${values?.imageMobileShow['name']}`
          : ``,
    },
    {
      // Third story
      inverted: true,
      badgeColor: 'primary',
      badgeIcon: AddPhotoAlternate,
      title: t('videoPoster'),
      badgeTooltip: t('videoPoster'),
      titleColor: 'primary',
      body: (
        <CardHeader color='rose' icon>
          {values.videoPoster !== '' && (
            <Tooltip title={t('videoDelete')} arrow>
              <IconButton
                disableFocusRipple
                disableRipple
                onClick={() => {
                  document.getElementById('videoPoster').value = '';
                  deleteFile('videoPoster');
                }}
                style={{
                  float: rtlActive ? 'left' : 'right',
                  position: 'relative',
                }}>
                <Delete color='error' />
              </IconButton>
            </Tooltip>
          )}
          <CardAvatar profile style={{ cursor: 'pointer', marginTop: 10 }}>
            {values.videoPoster == '' ? (
              <label htmlFor='videoPoster'>
                <Tooltip title={t('videoPoster')}>
                  <img
                    src={imageAvatar.src}
                    alt='..'
                    style={{ objectFit: 'cover', cursor: 'pointer' }}
                  />
                </Tooltip>
              </label>
            ) : (
              <label htmlFor='videoPoster' style={{ cursor: 'pointer' }}>
                <img
                  src={videoPosterBlob}
                  alt='..'
                  style={{ objectFit: 'cover' }}
                />
              </label>
            )}
            <input
              type='file'
              id='videoPoster'
              name='videoPoster'
              hidden
              onChange={(e) => {
                uploadFile(e);
              }}
              accept='image/png, image/jpeg'
            />
          </CardAvatar>
          <h4 className={classes.cardIconTitle}>
            <small></small>
          </h4>
          <TextValidator
            className={classes.root}
            variant='standard'
            type='hidden'
            id='file'
            ref={videoPosterRef}
            validators={['required']}
            errorMessages={[t('required')]}
            value={values.videoPoster}
          />
        </CardHeader>
      ),
      footerTitle:
        values?.videoPoster['name'] !== undefined
          ? `${values?.videoPoster['name']}`
          : ``,
    },
    {
      // Fourth story
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
            {values.youTubeBanner && (
              <TextValidator
                className={classes.input}
                variant='standard'
                label={t('youTubeId')}
                name='youTubeId'
                value={values.youTubeId}
                onChange={(e) => {
                  formValueChanged(e);
                }}
                validators={values.youTubeBanner ? ['required'] : []}
                errorMessages={[t('required')]}
              />
            )}
          </Grid>
          <Grid item style={{ display: 'flex', alignItems: 'center' }}>
            <Grid item>{t('showYoutube')}</Grid>
            <Android12Switch
              color={!values.youTubeBanner ? 'secondary' : 'primary'}
              firsticon={movieIcon}
              secondicon={youTubeIcon}
              checked={!values.youTubeBanner}
              onChange={() => {
                values.youTubeBanner = !values.youTubeBanner;
                if (!values.youTubeBanner) values.youTubeId = '';
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
        inverted: i % 2 == 0,
        badgeColor: i % 2 == 0 ? 'primary' : 'secondary',
        badgeIcon: TextFormat,
        title: t(`title_${la}`),
        badgeTooltip: t(`title_${la}`),
        titleColor: i % 2 == 0 ? 'primary' : 'secondary',
        body: (
          <>
            <Grid container spacing={1}>
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
