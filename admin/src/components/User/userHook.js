import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { getCookies, setCookies } from 'cookies-next';
import { useTheme } from '@mui/material';
import { useHistory } from 'react-router-dom';
import jwt from 'jsonwebtoken';
import { useLocation } from 'react-router-dom';
import alertCall from '../Hooks/useAlert';

import { getUserUrl, pushUrl, createUrl, editUrl } from './userStatic';

const userHook = () => {
  const [profileImageBlob, setProfileImageBlob] = useState('');
  const location = useLocation();
  const { search } = useLocation();
  const urlParams = Object.fromEntries([...new URLSearchParams(search)]);
  const { _id } = urlParams;
  const [values, setValues] = useState({
    userName: '',
    password: '',
    isAdmin: false,
    showPassword: false,
    firstName: '',
    lastName: '',
    profileImage: '',
    profileImageKey: '',
    finalFolder: 'users',
    modelName: 'Users',
    folderId: (Math.random() + 1).toString(36).substring(7),
    city: '',
    country: '',
    position: '',
    aboutMe: '',
    _id: _id || '',
  });

  const { adminAccessToken, profile } = useSelector((state) => state);
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

  const uploadImage = (e) => {
    const random = (Math.random() + 1).toString(36).substring(7);
    const isVercel =
      process.env.NEXT_PUBLIC_SERVERLESS == 'true' ? true : false;
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
        });
      } else {
        alertCall(
          theme,
          'success',
          `${user.data.userName} ${t('userCreateSuccess')}`,
          () => {
            dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
            dispatch({ type: 'TOTAL_USERS', payload: user.totalValuesLength });
            setCookies('totalUsers', user.totalValuesLength);
            history.push(pushUrl);
          }
        );
      }
    } else {
      // Edit user
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
            history.push('/admin/dashboard/user-page');
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

          location.state.selfProfileUpdate = location.state._id == profile._id;
          setValues((oldValues) => ({
            ...oldValues,
            ...location.state,
          }));
          dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
        } else {
          //set api to get user information
          const getUser = async () => {
            const res = await fetch(getUserUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                token: `Brearer ${adminAccessToken}`,
              },
              body: JSON.stringify(values),
            });
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
                history.push(pushUrl);
              });
            } else {
              setProfileImageBlob(user.data.profileImage);
              //Todo remove social media fro now
              delete user.data.facebook;
              delete user.data.google;
              delete user.data.twitter;
              delete user.data.__v;
              user.data.selfProfileUpdate = user.data._id == profile._id;
              setValues((oldValues) => ({
                ...oldValues,
                ...user.data,
              }));
              dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
            }
          };

          getUser();
        }
      }
    }
    return () => {
      isMount = false;
    };
  }, [location]);

  return {
    values,
    setValues,
    handleChange,
    profileImageBlob,
    uploadImage,
    deleteImage,
    formSubmit,
  };
};

function toFormData(o) {
  return Object.entries(o).reduce(
    (d, e) => (d.append(...e), d),
    new FormData()
  );
}

export default userHook;
