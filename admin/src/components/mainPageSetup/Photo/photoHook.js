import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material';
import { useHistory, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import alertCall from '../../Hooks/useAlert';
import { checkCookies } from 'cookies-next';
import { useRouter } from 'next/router';

import { getUrl, createUrl, editUrl } from './photoStatic';

export var pushUrl = '/admin/dashboard/main-page-setup/photos';

const photoHook = (reactRoutes) => {
  const { t } = useTranslation('photos');
  const theme = useTheme();
  const history = useHistory();
  const dispatch = useDispatch();
  const router = useRouter();
  const { adminAccessToken } = useSelector((state) => state);
  const [imageBlob, setImageBlob] = useState('');
  const photoRoute = reactRoutes.filter((a) => a.componentName == 'Photo')[0];
  const photosRoute = reactRoutes.filter((a) => a.componentName == 'Photos')[0];

  const [values, setValues] = useState({
    title_en: '',
    title_fa: '',
    topTitle_en: '',
    topTitle_fa: '',
    subTitle_en: '',
    subTitle_fa: '',
    button_en: '',
    button_fa: '',
    imageShow: '',
    imageShowKey: '',
    finalFolder: 'photos',
    modelName: 'Photos',
    folderId: (Math.random() + 1).toString(36).substring(7),
    isActive: true,
    _id: '',
  });
  const location = useLocation();
  const { search } = useLocation();
  const urlParams = Object.fromEntries([...new URLSearchParams(search)]);
  const { _id } = urlParams;

  if (!photosRoute.crud[0]?.active) {
    pushUrl = '/admin/dashboard';
  }

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
        setImageBlob(URL.createObjectURL(newFile));
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
      // Create Photo
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
        const photo = await res.json();

        if (status !== 200 && !photo.success) {
          alertCall(theme, 'error', photo.Error, () => {
            dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
            if (!checkCookies('adminAccessToken')) {
              router.push('/', undefined, { shallow: true });
            }
          });
        } else {
          alertCall(theme, 'success', t('photoCreated'), () => {
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
      // Edit Photo
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
        const photo = await res.json();
        if (status !== 200 && !photo.success) {
          alertCall(theme, 'error', photo.Error, () => {
            dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
            if (!checkCookies('adminAccessToken')) {
              router.push('/', undefined, { shallow: true });
            }
          });
        } else {
          alertCall(theme, 'success', t('photoEdited'), () => {
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
          setValues({ ...location.state, modelName: 'Photos' });
          setImageBlob(location.state.imageShow);
        } else {
          // need search
          dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: true });
          const getPhoto = async () => {
            const res = await fetch(getUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                token: `Brearer ${adminAccessToken}`,
              },
              body: JSON.stringify({ _id: _id, modelName: 'Photos' }),
            });
            const { status } = res;
            const photo = await res.json();
            const errorText =
              photo?.ErrorCode == undefined
                ? t(`${photo.Error}`)
                : t(`${photo?.ErrorCode}`);
            if (status !== 200 && !photo.success) {
              alertCall(theme, 'error', errorText, () => {
                dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
                if (!checkCookies('adminAccessToken')) {
                  router.push('/', undefined, { shallow: true });
                } else {
                  history.push(pushUrl);
                }
              });
            } else {
              delete photo.data.__v;
              setValues({ ...photo.data, modelName: 'Photos' });
              setImageBlob(photo.data.imageShow);
              dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
            }
          };

          getPhoto();
        }
      } else {
        setValues({
          title_en: '',
          title_fa: '',
          topTitle_en: '',
          topTitle_fa: '',
          subTitle_en: '',
          subTitle_fa: '',
          button_en: '',
          button_fa: '',
          imageShow: '',
          imageShowKey: '',
          finalFolder: 'photos',
          modelName: 'Photos',
          folderId: (Math.random() + 1).toString(36).substring(7),
          isActive: true,
          _id: '',
        });
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
    imageBlob,
    submitForm,
    pushUrl,
    _id,
    photoRoute,
  };
};

function toFormData(o) {
  return Object.entries(o).reduce(
    (d, e) => (d.append(...e), d),
    new FormData()
  );
}

export default photoHook;
