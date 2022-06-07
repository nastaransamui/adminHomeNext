import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material';
import { useHistory, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import alertCall from '../../Hooks/useAlert';
import { checkCookies } from 'cookies-next';
import { useRouter } from 'next/router';

import { pushUrl, getUrl, createUrl, editUrl } from './videoStatic';

const videoHook = () => {
  const { t } = useTranslation('video');
  const theme = useTheme();
  const history = useHistory();
  const dispatch = useDispatch();
  const router = useRouter();
  const { adminAccessToken } = useSelector((state) => state);
  const [videoLinkBlob, setVideoLinkBlob] = useState('');
  const [imageMobileBlob, setImageMobileBlob] = useState('');
  const [videoPosterBlob, setVideoPosterBlob] = useState('');
  const [values, setValues] = useState({
    title_en: '',
    title_fa: '',
    topTitle_en: '',
    topTitle_fa: '',
    subTitle_en: '',
    subTitle_fa: '',
    button_en: '',
    button_fa: '',
    imageMobileShow: '',
    imageMobileShowKey: '',
    videoPoster: '',
    videoPosterKey: '',
    videoLink: '',
    videoLinkKey: '',
    youTubeId: '',
    youTubeBanner: false,
    finalFolder: 'videos',
    modelName: 'Videos',
    folderId: (Math.random() + 1).toString(36).substring(7),
    isActive: false,
    _id: '',
  });
  const location = useLocation();
  const { search } = useLocation();
  const urlParams = Object.fromEntries([...new URLSearchParams(search)]);
  const { _id } = urlParams;

  const formValueChanged = (e) => {
    values[e.target.name] = e.target.value;
    setValues((oldValues) => ({ ...oldValues }));
  };

  const uploadFile = (e) => {
    const random = (Math.random() + 1).toString(36).substring(7);
    const isVercel =
      process.env.NEXT_PUBLIC_SERVERLESS == 'true' ? true : false;
    if (e.currentTarget.files.length > 0) {
      let file = e.currentTarget.files[0];
      if (isVercel && file.size > 4999999) {
        alertCall(theme, 'error', t('isVercelFileSize'), () => {
          if (!checkCookies('adminAccessToken')) {
            router.push('/', undefined, { shallow: true });
          } else {
            return false;
          }
        });
      } else {
        let blob = file.slice(0, file.size, file.type);
        let newFile = new File([blob], random + file.name, {
          type: file.type,
        });
        values[e.target.name] = newFile;
        switch (e.target.name) {
          case 'videoLink':
            setVideoLinkBlob(URL.createObjectURL(newFile));
            break;
          case 'imageMobileShow':
            setImageMobileBlob(URL.createObjectURL(newFile));
            break;
          case 'videoPoster':
            setVideoPosterBlob(URL.createObjectURL(newFile));
            break;
        }
        setValues((oldValues) => ({ ...oldValues }));
      }
    }
  };

  const deleteFile = (name) => {
    values[name] = '';
    setValues((oldValues) => ({ ...oldValues }));
  };

  const submitForm = async () => {
    if (_id == undefined) {
      // Create Video
      try {
        dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: true });
        const res = await fetch(createUrl, {
          method: 'POST',
          headers: {
            token: `Brearer ${adminAccessToken}`,
          },
          body: toFormData(values),
        });
        const { status } = res;
        const video = await res.json();
        const errorText = video.Error == 'onlyOne' ? t('onlyOne') : video.Error;
        if (status !== 200 && !video.success) {
          alertCall(theme, 'error', errorText, () => {
            dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
            if (!checkCookies('adminAccessToken')) {
              router.push('/', undefined, { shallow: true });
            }
          });
        } else {
          alertCall(theme, 'success', t('videoCreated'), () => {
            dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
            if (!checkCookies('adminAccessToken')) {
              router.push('/', undefined, { shallow: true });
            } else {
              history.push(pushUrl);
            }
          });
        }
      } catch (error) {
        alertCall(theme, 'error', error.toString(), () => {
          dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
          if (!checkCookies('adminAccessToken')) {
            router.push('/', undefined, { shallow: true });
          }
        });
      }
    } else {
      // Edit Video
      try {
        dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: true });
        const res = await fetch(editUrl, {
          method: 'POST',
          headers: {
            token: `Brearer ${adminAccessToken}`,
          },
          body: toFormData(values),
        });
        const { status } = res;
        const video = await res.json();
        const errorText = video.Error == 'onlyOne' ? t('onlyOne') : video.Error;
        if (status !== 200 && !video.success) {
          alertCall(theme, 'error', errorText, () => {
            dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
            if (!checkCookies('adminAccessToken')) {
              router.push('/', undefined, { shallow: true });
            }
          });
        } else {
          alertCall(theme, 'success', t('videoEdited'), () => {
            dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
            if (!checkCookies('adminAccessToken')) {
              router.push('/', undefined, { shallow: true });
            } else {
              history.push(pushUrl);
            }
          });
        }
      } catch (error) {
        alertCall(theme, 'error', error.toString(), () => {
          dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
          if (!checkCookies('adminAccessToken')) {
            router.push('/', undefined, { shallow: true });
          }
        });
      }
    }
  };

  useEffect(() => {
    let isMount = true;
    if (isMount) {
      if (_id !== undefined) {
        if (location.state) {
          // Data is in state of location
          setValues({ ...location.state, modelName: 'Videos' });
          setVideoLinkBlob(location.state.videoLink);
          setImageMobileBlob(location.state.imageMobileShow);
          setVideoPosterBlob(location.state.videoPoster);
        } else {
          // need search
          dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: true });
          const getVideo = async () => {
            const res = await fetch(getUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                token: `Brearer ${adminAccessToken}`,
              },
              body: JSON.stringify({ _id: _id, modelName: 'Videos' }),
            });
            const { status } = res;
            const video = await res.json();
            const errorText =
              video?.ErrorCode == undefined
                ? t(`${video.Error}`)
                : t(`${video?.ErrorCode}`);
            if (status !== 200 && !video.success) {
              alertCall(theme, 'error', errorText, () => {
                dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
                if (!checkCookies('adminAccessToken')) {
                  router.push('/', undefined, { shallow: true });
                } else {
                  history.push(pushUrl);
                }
              });
            } else {
              delete video.data.__v;
              setValues({ ...video.data, modelName: 'Videos' });
              setVideoLinkBlob(video.data.videoLink);
              setImageMobileBlob(video.data.imageMobileShow);
              setVideoPosterBlob(video.data.videoPoster);
              dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
            }
          };

          getVideo();
        }
      }
    }
    return () => {
      isMount = false;
    };
  }, [location]);

  return {
    values,
    setValues,
    uploadFile,
    deleteFile,
    formValueChanged,
    videoLinkBlob,
    imageMobileBlob,
    videoPosterBlob,
    submitForm,
    pushUrl,
  };
};

function toFormData(o) {
  return Object.entries(o).reduce(
    (d, e) => (d.append(...e), d),
    new FormData()
  );
}

export default videoHook;
