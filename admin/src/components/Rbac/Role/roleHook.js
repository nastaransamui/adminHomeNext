import { useState, useEffect, createRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { checkCookies } from 'cookies-next';
import { useTheme } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import alertCall from '../../Hooks/useAlert';
import { useRouter } from 'next/router';
import routes from '../../../../routes';
import Home from '@mui/icons-material/Home';
const roleHook = () => {
  const [values, setValues] = useState({
    roleName: '',
    isActive: true,
    remark: '',
    routes: [],
    icon: Home,
  });
  const [roleNameError, setRoleNameError] = useState(false);
  const formSubmit = async () => {
    try {
      console.log(values);
    } catch (error) {
      console.log(error);
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
  // console.log(values);
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
  };
};

export default roleHook;
