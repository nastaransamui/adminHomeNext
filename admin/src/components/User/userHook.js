import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { getCookies, setCookies, checkCookies } from 'cookies-next';
import { useTheme } from '@mui/material';
import { useHistory } from 'react-router-dom';
import jwt from 'jsonwebtoken';
import { useLocation } from 'react-router-dom';
import alertCall from '../Hooks/useAlert';
import { useRouter } from 'next/router';

import {
  getUserUrl,
  pushUrl,
  createUrl,
  editUrl,
  roleUrl,
  cityUrl,
  countryUrl,
  provinceUrl,
} from './userStatic';

let reg = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/;

const userHook = () => {
  const [profileImageBlob, setProfileImageBlob] = useState('');
  const location = useLocation();
  const { search } = useLocation();
  const router = useRouter();
  const urlParams = Object.fromEntries([...new URLSearchParams(search)]);
  const { _id } = urlParams;
  const [values, setValues] = useState({
    userName: '',
    password: '',
    isAdmin: true,
    showPassword: false,
    firstName: '',
    lastName: '',
    profileImage: '',
    profileImageKey: '',
    finalFolder: 'users',
    modelName: 'Users',
    folderId: (Math.random() + 1).toString(36).substring(7),
    roleName: '',
    role_id: [],
    countryName: '',
    country_id: [],
    provinceName: '',
    province_id: [],
    cityName: '',
    city_id: [],
    position: '',
    aboutMe: '',
    _id: _id || '',
  });

  const [roleNameError, setRoleNameError] = useState(false);
  const [updateRoleName, setUpdateRoleName] = useState({
    changed: false,
    roleName: values.roleName,
  });

  const [totalAgents, setTotalAgents] = useState(0);

  const [openRole, setOpenRole] = useState(false);
  const [roleOptions, setRoleOptions] = useState([]);
  let loadingRole = openRole && roleOptions.length === 0;
  const [roleFilter, setRoleFilter] = useState('');

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

  const { adminAccessToken, profile, dataAgentPageNumber } = useSelector(
    (state) => state
  );
  const dispatch = useDispatch();
  const history = useHistory();
  const { t } = useTranslation('users');
  const theme = useTheme();
  const handleChange = (name) => (event) => {
    if (name == 'userName') {
      setValues({ ...values, [name]: event.target.value.toLowerCase().trim() });
    } else if (typeof values[name] == 'boolean') {
      setValues({ ...values, [name]: !values[name] });
    } else if (name !== 'password') {
      setValues({
        ...values,
        [name]:
          event.target.value.charAt(0).toUpperCase() +
          event.target.value.slice(1),
      });
    } else {
      setValues({ ...values, [name]: event.target.value });
    }
  };

  const handleAutocomplete = (name, newValue) => {
    if (newValue == null) {
      if (_id !== undefined) {
        setUpdateRoleName((oldValue) => ({ ...oldValue, changed: false }));
        setRoleNameError(true);
      }
      if (name == 'roleName') {
        setValues({ ...values, [name]: '', role_id: [] });
      }
      if (name == 'cityName') {
        setValues({
          ...values,
          [name]: '',
          city_id: [],
          provinceName: '',
          province_id: [],
          countryName: '',
          country_id: [],
        });
      }
      if (name == 'provinceName') {
        setValues({
          ...values,
          [name]: '',
          province_id: [],
          cityName: '',
          city_id: [],
        });
      }
      if (name == 'countryName') {
        setValues({ ...values, [name]: '', country_id: [] });
      }
    } else {
      if (name == 'roleName') {
        //update role then submit first
        if (_id !== undefined) {
          setUpdateRoleName((oldValue) => ({
            ...oldValue,
            changed: true,
          }));
        }
        values.role_id = [];
        values.role_id.push(newValue._id);
        values.roleName = newValue.roleName;
        setRoleNameError(false);
        setValues({ ...values });
      }
      if (name == 'cityName') {
        values.city_id.push(newValue._id);
        values[name] = newValue.name;
        values.province_id = [];
        values.province_id.push(newValue.state_id);
        values.provinceName = newValue.state_name;
        values.country_id = [];
        values.country_id.push(newValue.country_id);
        values.countryName = newValue.country;
        setValues({ ...values });
      }
      if (name == 'provinceName') {
        values.cityName = '';
        values.city_id = [];
        values.province_id = [];
        values.province_id.push(newValue._id);
        values.provinceName = newValue.name;
        values.country_id = [];
        values.country_id.push(newValue.country_id);
        values.countryName = newValue.country;
        setValues({ ...values });
      }
      if (name == 'countryName') {
        values.cityName = '';
        values.city_id = [];
        values.provinceName = '';
        values.province_id = [];
        values.country_id = [];
        values.country_id.push(newValue._id);
        values.countryName = newValue.name;
        setValues({ ...values });
      }
    }
  };

  const uploadImage = (e) => {
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
        setProfileImageBlob(URL.createObjectURL(newFile));
        values[e.target.name] = newFile;
        setValues((oldValue) => ({ ...oldValue }));
      }
    }
  };

  const deleteImage = () => {
    setProfileImageBlob('');
    values.profileImage = '';
    values.profileImageKey = '';
    setValues((oldValue) => ({ ...oldValue }));
  };

  const isValidated = () => {
    if (values.password == '' && values.role_id.length !== 0) {
      if (values?.agentsData !== undefined || values?.roleData !== undefined) {
        return true;
      } else {
        getUser();
        return true;
      }
    } else if (values.password !== '' && values.role_id.length !== 0) {
      if (values.password.match(reg)) {
        if (
          values?.agentsData !== undefined ||
          values?.roleData !== undefined
        ) {
          return true;
        } else {
          getUser();

          return true;
        }
      } else {
        return false;
      }
    } else if (
      ((values.password !== '' && values.password !== '') ||
        values.password == '') &&
      values.role_id.length == 0
    ) {
      setRoleNameError(true);
      return false;
    } else {
      setRoleNameError(false);
      return true;
    }
  };

  const formSubmit = async () => {
    delete values.showPassword;
    if (_id == undefined) {
      // Create user
      dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: true });
      const res = await fetch(createUrl, {
        method: 'POST',
        headers: {
          token: `Brearer ${adminAccessToken}`,
        },
        body: toFormData(values),
      });
      const { status } = res;
      const user = await res.json();
      const errorText =
        user?.ErrorCode == undefined ? user.Error : t(`${user?.ErrorCode}`);
      if (status !== 200 && !user.success) {
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
          `${user.data.userName} ${t('userCreateSuccess')}`,
          () => {
            dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
            if (!checkCookies('adminAccessToken')) {
              router.push('/', undefined, { shallow: true });
            } else {
              dispatch({
                type: 'TOTAL_USERS',
                payload: user.totalValuesLength,
              });
              setCookies('totalUsers', user.totalValuesLength);
              history.push(pushUrl);
            }
          }
        );
      }
    } else {
      // Edit user
      // delete values.agentsData;
      dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: true });
      const res = await fetch(editUrl, {
        method: 'POST',
        headers: {
          token: `Brearer ${adminAccessToken}`,
        },
        body: toFormData(values),
      });
      const { status } = res;
      const user = await res.json();
      const errorText =
        user?.ErrorCode == undefined ? user.Error : t(`${user?.ErrorCode}`);
      if (status !== 200 && !user.success) {
        alertCall(theme, 'error', errorText, () => {
          dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
          if (!checkCookies('adminAccessToken')) {
            router.push('/', undefined, { shallow: true });
          }
        });
      } else {
        // Update profile
        const NewProfile = jwt.verify(
          getCookies().adminAccessToken,
          process.env.NEXT_PUBLIC_SECRET_KEY,
          (err, user) => {
            if (!err) {
              return user;
            }
          }
        );
        dispatch({ type: 'ADMIN_PROFILE', payload: NewProfile });
        alertCall(
          theme,
          'success',
          `${user.data.userName} ${t('userEditSuccess')}`,
          () => {
            dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
            //Reset pagenumber of agents
            dispatch({
              type: 'DATA_AGENT_PAGENUMBER',
              payload: 0,
            });
            if (!checkCookies('adminAccessToken')) {
              router.push('/', undefined, { shallow: true });
            } else {
              // history.push('/admin/dashboard/user-page');
              getUser();
            }
          }
        );
      }
    }
  };

  useEffect(() => {
    let isMount = true;
    if (isMount) {
      if (location?.profile) {
        // location.profile is exist
        setProfileImageBlob(location.profile.profileImage);
        delete location.profile.iat;
        delete location.profile.exp;
        location.profile.selfProfileUpdate = true;
        setValues((oldValues) => ({
          ...oldValues,
          ...location.profile,
        }));
      } else if (_id !== undefined) {
        //User information is inside location.state and will use it
        dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: true });
        if (location.state !== undefined) {
          setProfileImageBlob(location.state.profileImage);
          //Todo remove social media fro now
          delete location.state.facebook;
          delete location.state.google;
          delete location.state.twitter;
          delete location.state.__v;
          setUpdateRoleName((oldValue) => ({
            ...oldValue,
            roleName: location.state.roleName,
          }));
          location.state.selfProfileUpdate = location.state._id == profile._id;
          setValues((oldValues) => ({
            ...oldValues,
            ...location.state,
          }));
          dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
        } else {
          getUser();
        }
      }
    }
    return () => {
      isMount = false;
    };
  }, [location]);

  //set api to get user information
  const getUser = async () => {
    const res = await fetch(
      `${getUserUrl}?page=${dataAgentPageNumber}&rowsPerPage=${
        JSON.parse(localStorage.getItem('agentDataRowsPerPage')) || 5
      }&order=${localStorage.getItem('agentDataOrder') || 'asc'}&orderBy=${
        localStorage.getItem('agentDataOrderBy') || 'agentName'
      }`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token: `Brearer ${adminAccessToken}`,
        },
        body: JSON.stringify(values),
      }
    );
    const { status } = res;
    const user = await res.json();
    const errorText =
      user?.ErrorCode == undefined && user.Error == 'Notfind'
        ? t('Notfind')
        : user.Error
        ? t(`${user?.ErrorCode}`)
        : user.Error;
    if (status !== 200 && !user.success) {
      alertCall(theme, 'error', errorText, () => {
        dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
        if (!checkCookies('adminAccessToken')) {
          router.push('/', undefined, { shallow: true });
        } else {
          history.push(pushUrl);
        }
      });
    } else {
      setProfileImageBlob(user.data.profileImage);
      setTotalAgents(user.totalAgents);
      //Todo remove social media fro now<Fragment key={i}></Fragment>
      delete user.data.facebook;
      delete user.data.google;
      delete user.data.twitter;
      delete user.data.__v;
      user.data.selfProfileUpdate = user.data._id == profile._id;
      setUpdateRoleName((oldValue) => ({
        ...oldValue,
        roleName: user.data.roleName,
      }));
      setValues((oldValues) => {
        if (oldValues.userName == '') {
          //page refresh
          return {
            ...oldValues,
            ...user.data,
          };
        } else {
          //Page update
          return {
            ...oldValues,
            agentsData: user.data.agentsData,
            roleData: user.data.roleData,
          };
        }
      });
      dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
    }
  };

  const sleep = (delay = 0) => {
    return new Promise((resolve) => {
      setTimeout(resolve, delay);
    });
  };

  const getRoles = async () => {
    const abortController = new AbortController();
    try {
      const res = await fetch(roleUrl, {
        signal: abortController.signal,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token: `Brearer ${adminAccessToken}`,
        },
        body: JSON.stringify({
          modelName: 'Roles',
          filter: roleFilter,
        }),
      });
      const { status } = res;
      const response = await res.json();
      if (status !== 200 && !response.success) {
        setRoleOptions([
          {
            roleName: response.Error,
            icon: '⚠️',
            error: true,
          },
        ]);
      } else {
        setRoleOptions([...response.data]);
      }
    } catch (error) {
      return undefined;
    }
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

  useEffect(() => {
    let isMount = true;
    if (!loadingRole) {
      return undefined;
    }

    (async () => {
      await sleep(1e3);
      if (isMount) {
        getRoles();
      }
    })();

    return () => {
      isMount = false;
    };
  }, [loadingRole, roleFilter]);

  useEffect(() => {
    let isMount = true;
    if (isMount && roleFilter !== '') {
      getRoles();
    }
    return () => {
      isMount = false;
    };
  }, [roleFilter]);

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

  return {
    profile,
    values,
    setValues,
    handleChange,
    profileImageBlob,
    uploadImage,
    deleteImage,
    formSubmit,
    handleAutocomplete,
    openRole,
    setOpenRole,
    openCity,
    setOpenCity,
    openProvince,
    setOpenProvince,
    openCountry,
    setOpenCountry,
    loadingRole,
    loadingCity,
    loadingProvince,
    loadingCountry,
    roleOptions,
    cityOptions,
    provinceOptions,
    countryOptions,
    sleep,
    setRoleFilter,
    setCountryFilter,
    setProvinceFilter,
    setCityFilter,
    getCities,
    isValidated,
    totalAgents,
    getUser,
    roleNameError,
    updateRoleName,
  };
};

function toFormData(o) {
  return Object.entries(o).reduce((d, e) => {
    if (e[0] == 'agents_id') {
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
    if (e[0] == 'role_id') {
      e[1] = JSON.stringify(e[1]);
    }
    return d.append(...e), d;
  }, new FormData());
}

export default userHook;
