import { useState, useEffect, createRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { checkCookies } from 'cookies-next';
import { useTheme } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import alertCall from '../../Hooks/useAlert';
import { useRouter } from 'next/router';
import {
  getAgencyUrl,
  createUrl,
  editUrl,
  cityUrl,
  countryUrl,
  provinceUrl,
  userUrl,
  currencyUrl,
} from './agencyStatic';

export var pushUrl = '/admin/dashboard/client-data/clients';

const agencyHook = (reactRoutes) => {
  const [logoImageBlob, setLogoImageBlob] = useState('');
  const [countryPhoneCode, setCountryPhoneCode] = useState('th');
  const { adminAccessToken, profile } = useSelector((state) => state);
  const location = useLocation();
  const router = useRouter();
  const { search } = useLocation();
  const urlParams = Object.fromEntries([...new URLSearchParams(search)]);
  const { client_id } = urlParams;
  const isVercel = process.env.NEXT_PUBLIC_SERVERLESS == 'true' ? true : false;
  const clientRoute = reactRoutes.filter((a) => a.componentName == 'Client')[0];
  const clientsRoute = reactRoutes.filter(
    (a) => a.componentName == 'Clients'
  )[0];
  if (!clientsRoute.crud[0]?.active) {
    pushUrl = '/admin/dashboard';
  }
  const [values, setValues] = useState({
    agentId: '',
    agentName: '',
    address: '',
    logoImage: '',
    logoImageKey: '',
    finalFolder: 'agencies',
    folderId: (Math.random() + 1).toString(36).substring(7),
    cityName: '',
    city_id: [],
    provinceName: '',
    province_id: [],
    countryName: '',
    country_id: [],
    phones: [
      {
        tags: [''],
        number: '',
        remark: '',
      },
    ],
    email: '',
    currencyCode_id: [],
    currencyCode: '',
    creditAmount: 0,
    depositAmount: 0,
    remainCreditAmount: 0,
    remainDepositAmount: 0,
    userCreated: [profile._id],
    userUpdated: [profile._id],
    accountManager: '',
    accountManager_id: [],
    isActive: true,
    isVercel: isVercel,
    modelName: 'Agencies',
    remark: '',
    _id: client_id || '',
  });

  const [numbersRef, setNumbersRef] = useState([]);
  const [phoneNumberError, setPhoneNumberError] = useState([{ 0: false }]);
  useEffect(() => {
    // add  refs
    setNumbersRef((numbersRef) =>
      Array(values.phones.length)
        .fill()
        .map((_, i) => numbersRef[i] || createRef())
    );
  }, [values.phones.length]);

  const dispatch = useDispatch();
  const history = useHistory();
  const { t } = useTranslation('agencies');
  const theme = useTheme();
  const handleChange = (name) => (event) => {
    if (typeof values[name] == 'boolean') {
      setValues({ ...values, [name]: !values[name] });
    } else {
      setValues({ ...values, [name]: event.target.value });
    }
  };

  const uploadImage = (e) => {
    const random = (Math.random() + 1).toString(36).substring(7);
    if (e.currentTarget.files.length > 0) {
      let file = e.currentTarget.files[0];
      if (isVercel && file.size > 4999999) {
        alertCall(theme, 'error', t('isVercelFileSize'), () => {
          if (!checkCookies('adminAccessToken')) {
            router.push('/', undefined, { shallow: true });
          }
          return false;
        });
      } else {
        let blob = file.slice(0, file.size, file.type);
        let newFile = new File([blob], random + file.name, {
          type: file.type,
        });
        setLogoImageBlob(URL.createObjectURL(newFile));
        values[e.target.name] = newFile;
        if (client_id !== undefined && values.logoImageKey !== '') {
          values.deletedImage.push(values.logoImageKey);
        }
        values.logoImageKey = '';
        setValues((oldValue) => ({ ...oldValue }));
      }
    }
  };

  const deleteImage = () => {
    if (client_id !== undefined && values.logoImageKey !== '') {
      values.deletedImage.push(values.logoImageKey);
    }
    setLogoImageBlob('');
    values.logoImage = '';
    values.logoImageKey = '';
    setValues((oldValue) => ({ ...oldValue }));
  };

  const formSubmit = async () => {
    if (client_id == undefined) {
      try {
        // Create client
        dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: true });
        const res = await fetch(createUrl, {
          method: 'POST',
          headers: {
            token: `Brearer ${adminAccessToken}`,
          },
          body: toFormData(values),
        });
        const { status } = res;
        const client = await res.json();

        if (status !== 200 && !client.success) {
          const errorText =
            client?.ErrorCode == undefined
              ? client.Error
              : `${Object.keys(client?.keyPattern)[0]} ${t('isDuplicate')}`;
          alertCall(theme, 'error', errorText, () => {
            dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
            if (!checkCookies('adminAccessToken')) {
              router.push('/', undefined, { shallow: true });
            }
          });
        } else {
          alertCall(
            theme,
            'success',
            `${client.data?.agentName} ${t('agentCreateSuccess')}`,
            () => {
              dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
              if (!checkCookies('adminAccessToken')) {
                router.push('/', undefined, { shallow: true });
              } else {
                history.push(pushUrl);
              }
            }
          );
        }
      } catch (error) {
        alertCall(theme, 'error', error, () => {
          dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
          if (!checkCookies('adminAccessToken')) {
            router.push('/', undefined, { shallow: true });
          }
        });
      }
    } else {
      // Edit Agent
      delete values?.accountManagerData;
      delete values?.cityData;
      delete values?.countryData;
      delete values?.currencyCodeData;
      delete values?.provinceData;
      delete values?.userCreatedData;
      delete values?.userUpdatedData;
      values.userUpdated = [profile._id];
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
        const agent = await res.json();
        const errorText =
          agent?.ErrorCode == undefined
            ? agent.Error
            : `${Object.keys(agent?.keyPattern)[0]} ${t('isDuplicate')}`;
        if (status !== 200 && !agent.success) {
          alertCall(theme, 'error', errorText, () => {
            dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
            if (!checkCookies('adminAccessToken')) {
              router.push('/', undefined, { shallow: true });
            }
          });
        } else {
          alertCall(
            theme,
            'success',
            `${agent.data.agentName} ${t('agentEditSuccess')}`,
            () => {
              dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
              if (!checkCookies('adminAccessToken')) {
                router.push('/', undefined, { shallow: true });
              } else {
                history.push(pushUrl);
              }
            }
          );
        }
      } catch (error) {
        alertCall(theme, 'error', error, () => {
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
      if (client_id !== undefined) {
        //Client information is inside location.state and will use it
        dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: true });
        if (location.state !== undefined) {
          setLogoImageBlob(location.state.logoImage);
          delete location.state.__v;
          //Number of phone error fixed
          location?.state?.phones.map((p, i) => {
            if (i > 0) {
              phoneNumberError.push({
                [i]: false,
              });
              setPhoneNumberError(phoneNumberError);
            }
          });
          setValues((oldValues) => ({
            ...oldValues,
            ...location.state,
            deletedImage: [],
          }));
          dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
        } else {
          //set api to get Client information
          const getAgent = async () => {
            const res = await fetch(getAgencyUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                token: `Brearer ${adminAccessToken}`,
              },
              body: JSON.stringify(values),
            });
            const { status } = res;
            const agent = await res.json();
            const errorText =
              agent?.ErrorCode == undefined && agent.Error == 'Notfind'
                ? t('Notfind', { ns: 'common' })
                : agent?.ErrorCode !== undefined
                ? t(`${agent?.ErrorCode}`)
                : agent.Error;
            if (status !== 200 && !agent.success) {
              alertCall(theme, 'error', errorText, () => {
                dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
                if (!checkCookies('adminAccessToken')) {
                  router.push('/', undefined, { shallow: true });
                } else {
                  history.push(pushUrl);
                }
              });
            } else {
              setLogoImageBlob(agent.data.logoImage);
              delete agent.data.__v;
              //Number of phone error fixed
              agent?.data?.phones.map((p, i) => {
                if (i > 0) {
                  phoneNumberError.push({
                    [i]: false,
                  });
                  setPhoneNumberError(phoneNumberError);
                }
              });
              setValues((oldValues) => {
                oldValues.deletedImage = oldValues?.deletedImage || [];
                return {
                  ...oldValues,
                  ...agent?.data,
                  deletedImage: [],
                };
              });
              dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
            }
          };

          getAgent();
        }
      }
    }
    return () => {
      isMount = false;
    };
  }, [location]);

  const phoneTags = [
    {
      fa_name: 'شرکت',
      en_name: 'Company',
    },
    {
      fa_name: 'همراه',
      en_name: 'Mobile',
    },
    {
      fa_name: 'خانه',
      en_name: 'Home',
    },
    {
      fa_name: 'اضطراری',
      en_name: 'Emergency',
    },
  ];

  return {
    values,
    setValues,
    handleChange,
    logoImageBlob,
    uploadImage,
    deleteImage,
    formSubmit,
    countryPhoneCode,
    setCountryPhoneCode,
    phoneTags,
    phoneNumberError,
    setPhoneNumberError,
    pushUrl,
    clientRoute,
  };
};

function toFormData(o) {
  return Object.entries(o).reduce((d, e) => {
    if (e[0] == 'phones') {
      e[1] = JSON.stringify(e[1]);
    }
    if (e[0] == 'accountManager_id') {
      e[1] = JSON.stringify(e[1]);
    }
    if (e[0] == 'city_id') {
      e[1] = JSON.stringify(e[1]);
    }
    if (e[0] == 'province_id') {
      e[1] = JSON.stringify(e[1]);
    }
    if (e[0] == 'country_id') {
      e[1] = JSON.stringify(e[1]);
    }
    if (e[0] == 'currencyCode_id') {
      e[1] = JSON.stringify(e[1]);
    }
    if (e[0] == 'deletedImage') {
      e[1] = JSON.stringify(e[1]);
    }
    if (e[0] == 'userUpdated') {
      e[1] = JSON.stringify(e[1]);
    }
    if (e[0] == 'userCreated') {
      e[1] = JSON.stringify(e[1]);
    }
    return d.append(...e), d;
  }, new FormData());
}

export default agencyHook;
