import { useTheme } from '@mui/material';
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  KmlLayer,
} from 'react-google-maps';
import { getUrl, pushUrl, getCitiesOfStates, editUrl } from './provinceStatic';
import alertCall from '../../Hooks/useAlert';
import { checkCookies } from 'cookies-next';
import { useRouter } from 'next/router';

const provinceHook = () => {
  const { t } = useTranslation('geoLocations');
  const theme = useTheme();
  const history = useHistory();
  const dispatch = useDispatch();
  const router = useRouter();
  const { adminAccessToken } = useSelector((state) => state);
  const location = useLocation();
  const { search } = useLocation();
  const urlParams = Object.fromEntries([...new URLSearchParams(search)]);
  const { state_id } = urlParams;
  const [values, setValues] = useState({});
  const [expanded, setExpanded] = useState(false);
  const [childExpanded, setChildExpanded] = useState(false);
  const [childArray, setChildArray] = useState(null);

  const handleExpand = (panel) => (event, isExpanded) => {
    if (!expanded) {
      setExpanded(panel);
      childArray == null && loadCities(10);
    } else {
      setExpanded(false);
    }
  };

  const loadCities = async (limitNumber) => {
    const res = await fetch(getCitiesOfStates, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: `Brearer ${adminAccessToken}`,
      },
      body: JSON.stringify({
        country_id: values.countryId,
        state_id: values.id,
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

  const handleChildExpand = (panel) => (event, isExpanded) => {
    setChildExpanded(isExpanded ? panel : false);
  };
  const loadMore = () => {
    loadCities(childArray?.length + 10);
  };

  const formValueChanged = (e) => {
    values[e.target.name] = e.target.value;
    setValues((oldValues) => ({ ...oldValues }));
  };

  const formSubmit = async () => {
    values.modelName = 'Countries';
    values.dataType = 'Provinces';
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
              state_id: state_id,
              modelName: 'Countries',
            }),
          });
          const { status, ok, statusText } = res;
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
  console.log(values);
  const RegularMap = useMemo(() => {
    return withScriptjs(
      withGoogleMap(() => (
        <GoogleMap
          defaultZoom={6}
          defaultCenter={{
            lat: parseFloat(values.latitude),
            lng: parseFloat(values.longitude),
          }}
          defaultOptions={{
            scrollwheel: true,
          }}>
          <KmlLayer
            // url={`https://geodata.ucdavis.edu/gadm/gadm4.0/kmz/gadm40_${values.iso3}_1.kmz`}
            url={`https://admin-home-next-git-admin-nastaransamui.vercel.app/admin/kmz/${values.iso3}/${values.id}.kml`}
            options={{ preserveViewport: true }}
          />
          {/* <Marker
            position={{
              lat: parseFloat(values.latitude),
              lng: parseFloat(values.longitude),
            }}
          /> */}
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
    childExpanded,
    handleChildExpand,
    topRef,
    executeScroll,
  };
};

export default provinceHook;
