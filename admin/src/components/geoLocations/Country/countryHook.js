import { useTheme } from '@mui/material';
import { useState, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { getUrl, pushUrl, getStatesOfCountry, editUrl } from './countryStatic';
import alertCall from '../../Hooks/useAlert';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from 'react-google-maps';
import { checkCookies } from 'cookies-next';
import { useRouter } from 'next/router';

const countryHook = () => {
  const { t } = useTranslation('geoLocations');
  const theme = useTheme();
  const history = useHistory();
  const router = useRouter();
  const dispatch = useDispatch();
  const { adminAccessToken } = useSelector((state) => state);
  const location = useLocation();
  const { search } = useLocation();
  const urlParams = Object.fromEntries([...new URLSearchParams(search)]);
  const { country_id } = urlParams;
  const [values, setValues] = useState({});
  const [expanded, setExpanded] = useState(false);
  const [childExpanded, setChildExpanded] = useState(false);
  const [childArray, setChildArray] = useState(null);
  const [timeExpanded, setTimeExpanded] = useState(false);
  const handleTimeExpand = (panel) => (event, isExpanded) => {
    setTimeExpanded(isExpanded ? panel : false);
  };
  const loadStates = async (limitNumber) => {
    const res = await fetch(getStatesOfCountry, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: `Brearer ${adminAccessToken}`,
      },
      body: JSON.stringify({
        country_id: country_id,
        limitNumber: limitNumber,
        modelName: 'Countries',
      }),
    });
    const { status, ok, statusText } = res;
    // console.log(res);
    if (status !== 200 && !ok) {
      alertCall(theme, 'error', statusText, () => {
        if (!checkCookies('adminAccessToken')) {
          router.push('/', undefined, { shallow: true });
        } else {
          setExpanded(false);
        }
      });
    }
    const response = await res.json();
    const errorText =
      response?.ErrorCode == undefined
        ? t(`${response.Error}`)
        : t(`${response?.ErrorCode}`);
    if (status !== 200 && !response.success) {
      alertCall(theme, 'error', errorText, () => {
        if (!checkCookies('adminAccessToken')) {
          router.push('/', undefined, { shallow: true });
        } else {
          setExpanded(false);
        }
      });
    } else {
      if (childArray == null) {
        setChildArray(response.data);
      } else {
        const updatedArray = [...childArray, ...response.data];

        setChildArray(updatedArray);
      }
    }
  };
  const handleExpand = (panel) => (event, isExpanded) => {
    if (!expanded) {
      setExpanded(panel);
      childArray == null && loadStates(10);
    } else {
      setExpanded(false);
    }
  };
  const handleChildExpand = (panel) => (event, isExpanded) => {
    setChildExpanded(isExpanded ? panel : false);
  };

  const loadMore = () => {
    loadStates(childArray?.length + 10);
  };

  const formValueChanged = (e) => {
    values[e.target.name] = e.target.value;
    setValues((oldValues) => ({ ...oldValues }));
  };

  const formSubmit = async () => {
    values.modelName = 'Countries';
    values.dataType = 'Countries';
    try {
      dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: true });
      const res = await fetch(editUrl, {
        method: 'POST',
        headers: {
          token: `Brearer ${adminAccessToken}`,
        },
        body: JSON.stringify(values),
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
        alertCall(theme, 'success', t('countryEdited'), () => {
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
  };

  useEffect(() => {
    let isMount = true;
    if (isMount) {
      if (location?.state !== undefined) {
        setValues({ ...location?.state });
      } else {
        dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: true });
        const getProvince = async () => {
          const res = await fetch(getUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              token: `Brearer ${adminAccessToken}`,
            },
            body: JSON.stringify({
              country_id: country_id,
              modelName: 'Countries',
            }),
          });
          const { status, ok, statusText } = res;
          // console.log(res);
          if (status !== 200 && !ok) {
            alertCall(theme, 'error', statusText, () => {
              dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
              if (!checkCookies('adminAccessToken')) {
                router.push('/', undefined, { shallow: true });
              } else {
                history.push(pushUrl);
              }
            });
          }
          const response = await res.json();
          // console.log(response);
          const errorText =
            response?.ErrorCode == undefined
              ? t(`${response.Error}`)
              : t(`${response?.ErrorCode}`);
          if (status !== 200 && !response.success) {
            alertCall(theme, 'error', errorText, () => {
              dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
              if (!checkCookies('adminAccessToken')) {
                router.push('/', undefined, { shallow: true });
              } else {
                history.push(pushUrl);
              }
            });
          } else {
            setValues({ ...response.data });
            dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
          }
        };

        getProvince();
      }
    }

    return () => {
      isMount = false;
    };
  }, [location]);

  const RegularMap = useMemo(() => {
    return withScriptjs(
      withGoogleMap(() => (
        <GoogleMap
          defaultZoom={4}
          defaultCenter={{
            lat: values.latitude !== '' ? parseFloat(values.latitude) : 0,
            lng: values.longitude !== '' ? parseFloat(values.longitude) : 0,
          }}
          defaultOptions={{
            scrollwheel: false,
          }}>
          <Marker
            position={{
              lat: values.latitude !== '' ? parseFloat(values.latitude) : 0,
              lng: values.longitude !== '' ? parseFloat(values.longitude) : 0,
            }}
          />
        </GoogleMap>
      ))
    );
  }, [values.latitude, values.longitude]);

  const objIsEmpty = (obj) => {
    if (
      Object.keys(obj).length === 0 &&
      Object.getPrototypeOf(obj) === Object.prototype
    ) {
      return true;
    } else {
      return false;
    }
  };

  const topRef = useRef(null);

  const executeScroll = () => topRef.current.scrollIntoView();

  return {
    values,
    formSubmit,
    formValueChanged,
    setValues,
    RegularMap,
    objIsEmpty,
    expanded,
    handleExpand,
    childArray,
    theme,
    loadMore,
    timeExpanded,
    handleTimeExpand,
    childExpanded,
    handleChildExpand,
    topRef,
    executeScroll,
  };
};

export default countryHook;
