import { useTheme } from '@mui/material';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { getUrl, pushUrl, editUrl } from './currencyStatic';
import alertCall from '../../Hooks/useAlert';
import { checkCookies } from 'cookies-next';
import { useRouter } from 'next/router';
import useButtonActivation from '../../Hooks/useButtonActivation';

const currencyHook = (reactRoutes) => {
  const { t } = useTranslation('exchange');
  const theme = useTheme();
  const history = useHistory();
  const router = useRouter();
  const dispatch = useDispatch();
  const { adminAccessToken } = useSelector((state) => state);
  const location = useLocation();
  const { search } = useLocation();
  const urlParams = Object.fromEntries([...new URLSearchParams(search)]);
  const currenciesRoute = reactRoutes.filter((a) => {
    if (a.componentName == 'Currencies' && a.componentView == 'view') {
      return true;
    }
  })[0];
  const { updateButtonDisabled } = useButtonActivation(currenciesRoute);
  const { currency_id } = urlParams;
  const [values, setValues] = useState({});

  const formValueChanged = (e) => {
    values[e.target.name] = e.target.value;
    setValues((oldValues) => ({ ...oldValues }));
  };

  const formSubmit = async () => {
    values.modelName = 'Currencies';
    values.dataType = 'Currencies';
    try {
      if (!updateButtonDisabled) {
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
          alertCall(theme, 'success', t('currencyEdited'), () => {
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
        const getProvince = async () => {
          const res = await fetch(getUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              token: `Brearer ${adminAccessToken}`,
            },
            body: JSON.stringify({
              currency_id: currency_id,
              modelName: 'Currencies',
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
    objIsEmpty,
    theme,
    updateButtonDisabled,
  };
};

function toFormData(o) {
  return Object.entries(o).reduce((d, e) => {
    if (e[0] == 'agents_id') {
      e[1] = JSON.stringify(e[1]);
    }
    return d.append(...e), d;
  }, new FormData());
}

export default currencyHook;
