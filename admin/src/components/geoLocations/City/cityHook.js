import { useTheme } from '@mui/material';
import { useState, useEffect, useMemo } from 'react';
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
import { getUrl, pushUrl, editUrl } from './cityStatic';
import alertCall from '../../Hooks/useAlert';
import { checkCookies } from 'cookies-next';
import { useRouter } from 'next/router';
import useButtonActivation from '../../Hooks/useButtonActivation';

const cityHook = (reactRoutes) => {
  const { t } = useTranslation('geoLocations');
  const theme = useTheme();
  const history = useHistory();
  const dispatch = useDispatch();
  const { adminAccessToken } = useSelector((state) => state);
  const location = useLocation();
  const router = useRouter();
  const { search } = useLocation();
  const urlParams = Object.fromEntries([...new URLSearchParams(search)]);

  const countriesRoute = reactRoutes.filter((a) => {
    if (a.componentName == 'Cities') {
      return true;
    }
  })[0];
  const { updateButtonDisabled } = useButtonActivation(countriesRoute);
  const { city_id } = urlParams;
  const [values, setValues] = useState({});

  const formValueChanged = (e) => {
    values[e.target.name] = e.target.value;
    setValues((oldValues) => ({ ...oldValues }));
  };

  const formSubmit = async () => {
    values.modelName = 'Countries';
    values.dataType = 'Cities';
    try {
      if (!updateButtonDisabled) {
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
        const getCity = async () => {
          const res = await fetch(getUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              token: `Brearer ${adminAccessToken}`,
            },
            body: JSON.stringify({
              city_id: city_id,
              modelName: 'Countries',
            }),
          });
          const { status, ok, statusText } = res;
          if (status !== 200 && !ok) {
            alertCall(theme, 'error', t(`${statusText}`), () => {
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

        getCity();
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
          defaultZoom={8}
          defaultCenter={{
            lat: parseFloat(values.latitude),
            lng: parseFloat(values.longitude),
          }}
          defaultOptions={{
            scrollwheel: false,
          }}>
          <Marker
            position={{
              lat: parseFloat(values.latitude),
              lng: parseFloat(values.longitude),
            }}
          />
          <KmlLayer
            url={`https://admin-home-next-git-admin-nastaransamui.vercel.app/admin/kmz/cities_country/${values.iso3}/${values.id}.kml`}
            options={{ preserveViewport: true }}
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

  return {
    values,
    formSubmit,
    formValueChanged,
    setValues,
    RegularMap,
    objIsEmpty,
    theme,
    updateButtonDisabled,
  };
};

export default cityHook;
