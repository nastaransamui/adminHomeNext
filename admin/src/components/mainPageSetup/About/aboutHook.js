import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material';

import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import alertCall from '../../Hooks/useAlert';
import { checkCookies } from 'cookies-next';
import { useRouter } from 'next/router';

import { getUrl, editUrl } from './aboutStatic';

const aboutHook = (reactRoutes) => {
  const { t } = useTranslation('about');
  const theme = useTheme();

  const aboutRoute = reactRoutes.filter((a) => a.componentName == 'About')[0];

  const dispatch = useDispatch();
  const router = useRouter();
  const { adminAccessToken } = useSelector((state) => state);
  const [firstThumbBlob, setFirstThumbBlob] = useState('');
  const [secondThumbBlob, setSecondThumbBlob] = useState('');
  const [thirdThumbBlob, setThirdThumbBlob] = useState('');
  const [values, setValues] = useState({
    title_en: '',
    title_fa: '',
    desc_en: '',
    desc_fa: '',
    button_en: '',
    button_fa: '',
    firstThumb: '',
    firstThumbKey: '',
    firstTop: 15,
    firstRight: -69,
    secondThumb: '',
    secondThumbKey: '',
    secondTop: 4,
    secondRight: -69,
    thirdThumb: '',
    thirdThumbKey: '',
    thirdTop: 20,
    thirdRight: -84,
    finalFolder: 'about',
    modelName: 'About',
    folderId: (Math.random() + 1).toString(36).substring(7),
    _id: '',
  });

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
          case 'firstThumb':
            setFirstThumbBlob(URL.createObjectURL(newFile));
            break;
          case 'secondThumb':
            setSecondThumbBlob(URL.createObjectURL(newFile));
            break;
          case 'thirdThumb':
            setThirdThumbBlob(URL.createObjectURL(newFile));
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
    // Edit About
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
      const response = await res.json();
      if (status !== 200 && !response.success) {
        alertCall(theme, 'error', response.Error, () => {
          dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
          if (!checkCookies('adminAccessToken')) {
            router.push('/', undefined, { shallow: true });
          }
        });
      } else {
        alertCall(theme, 'success', t('aboutEdited'), () => {
          dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
          if (!checkCookies('adminAccessToken')) {
            router.push('/', undefined, { shallow: true });
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
  };

  useEffect(() => {
    let isMount = true;
    if (isMount) {
      dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: true });
      const getResult = async () => {
        const res = await fetch(getUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            token: `Brearer ${adminAccessToken}`,
          },
          body: JSON.stringify({ modelName: 'About' }),
        });
        const { status } = res;
        const response = await res.json();
        const errorText =
          response?.ErrorCode == undefined
            ? t(`${response.Error}`)
            : t(`${response?.ErrorCode}`);
        if (status !== 200 && !response.success) {
          alertCall(theme, 'error', errorText, () => {
            dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
            if (!checkCookies('adminAccessToken')) {
              router.push('/', undefined, { shallow: true });
            }
          });
        } else {
          delete response.data.__v;
          setValues({ ...response.data, modelName: 'About' });
          setFirstThumbBlob(response.data.firstThumb);
          setSecondThumbBlob(response.data.secondThumb);
          setThirdThumbBlob(response.data.thirdThumb);
          dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
        }
      };

      getResult();
    }
    return () => {
      isMount = false;
    };
  }, []);

  return {
    values,
    setValues,
    uploadFile,
    deleteFile,
    formValueChanged,
    firstThumbBlob,
    secondThumbBlob,
    thirdThumbBlob,
    submitForm,
    aboutRoute,
  };
};

function toFormData(o) {
  return Object.entries(o).reduce(
    (d, e) => (d.append(...e), d),
    new FormData()
  );
}

export default aboutHook;
