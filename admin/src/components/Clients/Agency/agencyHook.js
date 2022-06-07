import { useState, useEffect, useRef, createRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { getCookies, setCookies } from 'cookies-next';
import { useTheme } from '@mui/material';
import { useHistory } from 'react-router-dom';
import jwt from 'jsonwebtoken';
import { useLocation } from 'react-router-dom';
import alertCall from '../../Hooks/useAlert';

import {
  getAgencyUrl,
  pushUrl,
  createUrl,
  editUrl,
  cityUrl,
  countryUrl,
  provinceUrl,
  userUrl,
  currencyUrl,
} from './agencyStatic';

const agencyHook = () => {
  const [logoImageBlob, setLogoImageBlob] = useState('');
  const [countryPhoneCode, setCountryPhoneCode] = useState('th');
  const { adminAccessToken, profile } = useSelector((state) => state);
  const location = useLocation();
  const { search } = useLocation();
  const urlParams = Object.fromEntries([...new URLSearchParams(search)]);
  const { client_id } = urlParams;
  const isVercel = process.env.NEXT_PUBLIC_SERVERLESS == 'true' ? true : false;
  const [values, setValues] = useState({
    agentId: '',
    agentName: '',
    address: '',
    logoImage: '',
    logoImageKey: '',
    finalFolder: 'agencies',
    folderId: (Math.random() + 1).toString(36).substring(7),
    cityName: '',
    city_id: '',
    provinceName: '',
    province_id: '',
    countryName: '',
    country_id: '',
    phones: [
      {
        tags: [''],
        number: '',
        remark: '',
      },
    ],
    email: '',
    currencyCode_id: '',
    currencyCode: '',
    creditAmount: 0,
    depositAmount: 0,
    remainCreditAmount: 0,
    remainDepositAmount: 0,
    userCreated: profile._id,
    userUpdated: profile._id,
    accountManager: '',
    accountManager_id: '',
    isActive: true,
    isVercel: isVercel,
    modelName: 'Agencies',
    remark: '',
    _id: client_id || '',
  });
  // console.log(values);
  const [openCity, setOpenCity] = useState(false);
  const [cityOptions, setCityOptions] = useState([]);
  let loadingCity = openCity && cityOptions.length === 0;
  const [cityFilter, setCityFilter] = useState('');
  const [openProvince, setOpenProvince] = useState(false);
  const [provinceOptions, setProvinceOptions] = useState([]);
  let loadingProvince = openProvince && provinceOptions.length === 0;
  const [provinceFilter, setProvinceFilter] = useState('');

  const [openCountry, setOpenCountry] = useState(false);
  const [countryOptions, setCountryOptions] = useState([]);
  const loadingCountry = openCountry && countryOptions.length === 0;
  const [countryFilter, setCountryFilter] = useState('');

  const [openAm, setOpenAm] = useState(false);
  const [amOptions, setAmOptions] = useState([]);
  const loadingAm = openAm && amOptions.length === 0;
  const [amFilter, setAmFilter] = useState('');

  const [openCurrency, setOpenCurrency] = useState(false);
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const loadingCurrency = openCurrency && currencyOptions.length === 0;
  const [currencyFilter, setCurrencyFilter] = useState('');

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

  const handleAutocomplete = (name, newValue) => {
    if (newValue == null) {
      if (name == 'cityName') {
        setValues({
          ...values,
          [name]: '',
          city_id: '',
        });
        setCountryPhoneCode('th');
      }
      if (name == 'provinceName') {
        setValues({
          ...values,
          [name]: '',
          province_id: '',
          cityName: '',
          city_id: '',
        });
        setCountryPhoneCode('th');
      }
      if (name == 'countryName') {
        setValues({ ...values, [name]: '', country_id: '' });
        setCountryPhoneCode('th');
      }
      if (name == 'accountManager') {
        setValues({ ...values, [name]: '', accountManager_id: '' });
        setCountryPhoneCode('th');
      }
      if (name == 'currencyCode') {
        setValues({ ...values, [name]: '', currencyCode_id: '' });
        setCountryPhoneCode('th');
      }
    } else {
      if (name == 'cityName') {
        setValues({
          ...values,
          [name]: newValue.name,
          city_id: newValue._id,
          provinceName: newValue.state_name,
          province_id: newValue.state_id,
          countryName: newValue.country,
          country_id: newValue.country_id,
        });
        setCountryPhoneCode(newValue.iso2.toLowerCase());
      }
      if (name == 'provinceName') {
        setValues({
          ...values,
          cityName: '',
          city_id: '',
          provinceName: newValue.name,
          province_id: newValue._id,
          countryName: newValue.country,
          country_id: newValue.country_id,
        });
        setCountryPhoneCode(newValue.iso2.toLowerCase());
      }
      if (name == 'countryName') {
        setValues({
          ...values,
          cityName: '',
          city_id: '',
          provinceName: '',
          province_id: '',
          countryName: newValue.name,
          country_id: newValue._id,
        });
        setCountryPhoneCode(newValue.iso2.toLowerCase());
      }
      if (name == 'accountManager') {
        setValues({
          ...values,
          accountManager: newValue.userName,
          accountManager_id: newValue._id,
        });
      }
      if (name == 'currencyCode') {
        setValues({
          ...values,
          currencyCode: newValue.currency,
          currencyCode_id: newValue._id,
        });
      }
    }
  };

  const uploadImage = (e) => {
    const random = (Math.random() + 1).toString(36).substring(7);
    if (e.currentTarget.files.length > 0) {
      let file = e.currentTarget.files[0];
      if (isVercel && file.size > 4999999) {
        alertCall(theme, 'error', t('isVercelFileSize'), () => {
          return false;
        });
      } else {
        let blob = file.slice(0, file.size, file.type);
        let newFile = new File([blob], random + file.name, {
          type: file.type,
        });
        setLogoImageBlob(URL.createObjectURL(newFile));
        values[e.target.name] = newFile;
        setValues((oldValue) => ({ ...oldValue }));
      }
    }
  };

  const deleteImage = () => {
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
          });
        } else {
          alertCall(
            theme,
            'success',
            `${client.data?.agentName} ${t('agentCreateSuccess')}`,
            () => {
              dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
              history.push(pushUrl);
            }
          );
        }
      } catch (error) {
        alertCall(theme, 'error', error, () => {
          dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
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
      values.userUpdated = profile._id;
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
          });
        } else {
          alertCall(
            theme,
            'success',
            `${agent.data.agentName} ${t('agentEditSuccess')}`,
            () => {
              dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
              history.push(pushUrl);
            }
          );
        }
      } catch (error) {
        alertCall(theme, 'error', error, () => {
          dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
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
                ? t('Notfind')
                : agent.Error
                ? t(`${agent?.ErrorCode}`)
                : agent.Error;
            if (status !== 200 && !agent.success) {
              alertCall(theme, 'error', errorText, () => {
                dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
                history.push(pushUrl);
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
              setValues((oldValues) => ({
                ...oldValues,
                ...agent?.data,
              }));
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

  const sleep = (delay = 0) => {
    return new Promise((resolve) => {
      setTimeout(resolve, delay);
    });
  };

  const getCities = async () => {
    const abortController = new AbortController();
    try {
      const res = await fetch(cityUrl, {
        signal: abortController.signal,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token: `Brearer ${adminAccessToken}`,
        },
        body: JSON.stringify({
          modelName: 'Countries',
          filter: cityFilter,
        }),
      });
      const { status } = res;
      const response = await res.json();
      if (status !== 200 && !response.success) {
        setCityOptions([
          {
            name: response.Error,
            emoji: '⚠️',
            error: true,
          },
        ]);
      } else {
        setCityOptions([...response.data]);
      }
    } catch (error) {
      return undefined;
    }
  };

  const getCountries = async () => {
    const abortController = new AbortController();
    try {
      const res = await fetch(countryUrl, {
        signal: abortController.signal,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token: `Brearer ${adminAccessToken}`,
        },
        body: JSON.stringify({
          modelName: 'Countries',
          filter: countryFilter,
        }),
      });
      const { status } = res;
      const response = await res.json();
      if (status !== 200 && !response.success) {
        setCountryOptions([
          {
            name: response.Error,
            emoji: '⚠️',
            error: true,
          },
        ]);
      } else {
        setCountryOptions([...response.data]);
      }
    } catch (error) {
      return undefined;
    }
  };

  const getProvinces = async () => {
    const abortController = new AbortController();
    try {
      const res = await fetch(provinceUrl, {
        signal: abortController.signal,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token: `Brearer ${adminAccessToken}`,
        },
        body: JSON.stringify({
          modelName: 'Countries',
          filter: provinceFilter,
        }),
      });
      const { status } = res;
      const response = await res.json();
      if (status !== 200 && !response.success) {
        setProvinceOptions([
          {
            name: response.Error,
            emoji: '⚠️',
            error: true,
            id: 0,
          },
        ]);
      } else {
        setProvinceOptions([...response.data]);
      }
    } catch (error) {
      setProvinceOptions([
        {
          name: response.Error,
          emoji: '⚠️',
          error: true,
          id: 0,
        },
      ]);
    }
  };

  const getUsers = async () => {
    const abortController = new AbortController();
    try {
      const res = await fetch(userUrl, {
        signal: abortController.signal,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token: `Brearer ${adminAccessToken}`,
        },
        body: JSON.stringify({
          modelName: 'Users',
          filter: amFilter,
        }),
      });
      const { status } = res;
      const response = await res.json();
      if (status !== 200 && !response.success) {
        setAmOptions([
          {
            name: response.Error,
            emoji: '⚠️',
            error: true,
          },
        ]);
      } else {
        setAmOptions([...response.data]);
      }
    } catch (error) {
      return undefined;
    }
  };

  const getCurrencies = async () => {
    const abortController = new AbortController();
    try {
      const res = await fetch(currencyUrl, {
        signal: abortController.signal,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token: `Brearer ${adminAccessToken}`,
        },
        body: JSON.stringify({
          modelName: 'Currencies',
          filter: currencyFilter,
        }),
      });
      const { status } = res;
      const response = await res.json();
      if (status !== 200 && !response.success) {
        setCurrencyOptions([
          {
            name: response.Error,
            emoji: '⚠️',
            error: true,
          },
        ]);
      } else {
        setCurrencyOptions([...response.data]);
      }
    } catch (error) {
      return undefined;
    }
  };

  useEffect(() => {
    let isMount = true;
    if (!loadingCity) {
      return undefined;
    }

    (async () => {
      await sleep(1e3); // For demo purposes.
      if (isMount) {
        getCities();
      }
    })();

    return () => {
      isMount = false;
    };
  }, [loadingCity, cityFilter]);

  useEffect(() => {
    let isMount = true;
    if (isMount && cityFilter !== '') {
      getCities();
    }
    return () => {
      isMount = false;
    };
  }, [cityFilter]);

  useEffect(() => {
    let isMount = true;

    if (!loadingProvince) {
      return undefined;
    }

    (async () => {
      await sleep(1e3); // For demo purposes.

      if (isMount) {
        getProvinces();
      }
    })();

    return () => {
      isMount = false;
    };
  }, [loadingProvince, provinceFilter]);

  useEffect(() => {
    let isMount = true;
    if (isMount && provinceFilter !== '') {
      getProvinces();
    }
    return () => {
      isMount = false;
    };
  }, [provinceFilter]);

  useEffect(() => {
    let isMount = true;
    if (isMount && countryFilter !== '') {
      getCountries();
    }
    return () => {
      isMount = false;
    };
  }, [countryFilter]);

  useEffect(() => {
    let isMount = true;

    if (!loadingCountry) {
      return undefined;
    }

    (async () => {
      await sleep(1e3); // For demo purposes.

      if (isMount) {
        getCountries();
      }
    })();

    return () => {
      isMount = false;
    };
  }, [loadingCountry]);

  useEffect(() => {
    let isMount = true;
    if (!loadingCity) {
      return undefined;
    }

    (async () => {
      await sleep(1e3); // For demo purposes.
      if (isMount) {
        getUsers();
      }
    })();

    return () => {
      isMount = false;
    };
  }, [loadingAm, amFilter]);

  useEffect(() => {
    let isMount = true;
    if (isMount && amFilter !== '') {
      getUsers();
    }
    return () => {
      isMount = false;
    };
  }, [amFilter]);

  useEffect(() => {
    let isMount = true;
    if (!loadingCurrency) {
      return undefined;
    }

    (async () => {
      await sleep(1e3); // For demo purposes.
      if (isMount) {
        getCurrencies();
      }
    })();

    return () => {
      isMount = false;
    };
  }, [loadingCurrency, currencyFilter]);

  useEffect(() => {
    let isMount = true;
    if (isMount && currencyFilter !== '') {
      getCurrencies();
    }
    return () => {
      isMount = false;
    };
  }, [currencyFilter]);

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
    handleAutocomplete,
    openCity,
    setOpenCity,
    openProvince,
    setOpenProvince,
    openCountry,
    setOpenCountry,
    openAm,
    setOpenAm,
    openCurrency,
    setOpenCurrency,
    loadingCity,
    loadingProvince,
    loadingCountry,
    loadingAm,
    loadingCurrency,
    cityOptions,
    provinceOptions,
    countryOptions,
    amOptions,
    currencyOptions,
    sleep,
    setCountryFilter,
    setProvinceFilter,
    setCityFilter,
    setAmFilter,
    setCurrencyFilter,
    getCities,
    countryPhoneCode,
    setCountryPhoneCode,
    phoneTags,
    phoneNumberError,
    setPhoneNumberError,
  };
};

function toFormData(o) {
  return Object.entries(o).reduce((d, e) => {
    if (e[0] == 'phones') {
      e[1] = JSON.stringify(e[1]);
    }
    return d.append(...e), d;
  }, new FormData());
}

export default agencyHook;
