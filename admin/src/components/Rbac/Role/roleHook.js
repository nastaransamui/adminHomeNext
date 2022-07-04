import { useState, useEffect, createRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { checkCookies } from 'cookies-next';
import { useTheme } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import alertCall from '../../Hooks/useAlert';
import { useRouter } from 'next/router';
import Home from '@mui/icons-material/Home';
import { getRoleUrl, createUrl, pushUrl, editUrl } from './roleStatic';

const roleHook = () => {
  const { adminAccessToken } = useSelector((state) => state);
  const location = useLocation();
  const router = useRouter();
  const dispatch = useDispatch();
  const history = useHistory();
  const { t } = useTranslation('roles');
  const theme = useTheme();
  const { search } = useLocation();
  const urlParams = Object.fromEntries([...new URLSearchParams(search)]);
  const { role_id } = urlParams;
  const [values, setValues] = useState({
    roleName: '',
    isActive: true,
    remark: '',
    routes: [],
    icon: Home?.type?.render().props.children.props.d,
    _id: role_id || '',
    modelName: 'Roles',
  });
  const [roleNameError, setRoleNameError] = useState(false);

  useEffect(() => {
    let isMount = true;
    if (isMount) {
      if (role_id !== undefined) {
        //Role information is inside location.state and will use it
        dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: true });
        if (location.state !== undefined) {
          delete location?.state.__v;
          setValues({ ...location.state });
          dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
        } else {
          //send api to get Client information
          const getRole = async () => {
            const res = await fetch(getRoleUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                token: `Brearer ${adminAccessToken}`,
              },
              body: JSON.stringify(values),
            });
            const { status } = res;
            const role = await res.json();
            const errorText =
              role?.ErrorCode == undefined && role.Error == 'Notfind'
                ? t('Notfind')
                : role.Error
                ? t(`${role?.ErrorCode}`)
                : role.Error;
            if (status !== 200 && !role.success) {
              alertCall(theme, 'error', errorText, () => {
                dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
                if (!checkCookies('adminAccessToken')) {
                  router.push('/', undefined, { shallow: true });
                } else {
                  history.push(pushUrl);
                }
              });
            } else {
              delete role.data.__v;
              setValues((oldValues) => ({
                ...oldValues,
                ...role?.data,
              }));
              dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
            }
          };
          getRole();
        }
      }
    }
    return () => {
      isMount = false;
    };
  }, [location]);

  const formSubmit = async () => {
    if (role_id == undefined) {
      try {
        //Create role
        dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: true });
        const res = await fetch(createUrl, {
          method: 'POST',
          headers: {
            token: `Brearer ${adminAccessToken}`,
          },
          body: toFormData(values),
        });
        const { status } = res;
        const role = await res.json();
        const errorText =
          role?.ErrorCode == undefined
            ? role.Error
            : `${Object.keys(role?.keyPattern)[0]} ${t('isDuplicate')}`;
        if (status !== 200 && !role.success) {
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
            `${role.data.roleName} ${t('roleCreateSuccess')}`,
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
      delete values?.userData;
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
        const role = await res.json();
        const errorText =
          role?.ErrorCode == undefined
            ? role.Error
            : `${Object.keys(role?.keyPattern)[0]} ${t('isDuplicate')}`;
        if (status !== 200 && !role.success) {
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
            `${role.data.roleName} ${t('roleEditSuccess')}`,
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
  const handleChange = (name) => (event) => {
    if (event.target.value !== '') {
      setRoleNameError(false);
    } else {
      setRoleNameError(true);
    }
    if (typeof values[name] == 'boolean') {
      setValues({ ...values, [name]: !values[name] });
    } else {
      setValues({ ...values, [name]: event.target.value });
    }
  };
  const isValidated = () => {
    if (values.roleName == '') {
      setRoleNameError(true);
      return false;
    } else {
      setRoleNameError(false);
      return true;
    }
  };

  const handleAddRoutes = (route) => {
    let crudArray = [
      {
        name: 'read',
        active: true,
      },
      {
        name: 'delete',
        active: true,
      },
      {
        name: 'create',
        active: true,
      },
      {
        name: 'update',
        active: true,
      },
    ];
    route.map((r) => {
      if (r.collapse == undefined && r.crud == undefined) {
        r.crud = crudArray;
        return r;
      } else if (r.collapse && r.crud == undefined) {
        r.crud = crudArray;
        r.views.map((v) => {
          if (v.crud == undefined) {
            v.crud = crudArray;
          }
          if (v.collapse) {
            v.views.map((a) => {
              if (a.crud == undefined) {
                a.crud = crudArray;
              }
            });
          }
        });
      }
    });
    values.routes = route;
    setValues((oldvalue) => ({ ...oldvalue }));
  };
  const handleRemoveRoutes = (route) => {
    values.routes = route;
    setValues((oldvalue) => ({ ...oldvalue }));
  };

  return {
    formSubmit,
    handleChange,
    values,
    setValues,
    isValidated,
    roleNameError,
    handleAddRoutes,
    handleRemoveRoutes,
    role_id,
  };
};

function toFormData(o) {
  return Object.entries(o).reduce((d, e) => {
    if (e[0] == 'routes') {
      e[1] = JSON.stringify(e[1]);
    }
    return d.append(...e), d;
  }, new FormData());
}

export default roleHook;
