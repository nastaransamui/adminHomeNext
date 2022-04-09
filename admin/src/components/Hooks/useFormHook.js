import { useState, useEffect } from 'react';
import Alert from 'react-s-alert';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { getCookies, setCookies } from 'cookies-next';
import { useTheme } from '@mui/material';
import { useHistory } from 'react-router-dom';
import jwt from 'jsonwebtoken';
const useFormHook = (_id, location) => {
  const [profileImage, setProfileImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    userName: '',
    password: '',
    isAdmin: false,
    showPassword: false,
    firstName: '',
    lastName: '',
    city: '',
    country: '',
    position: '',
    aboutMe: '',
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
    if (e.currentTarget.files.length > 0) {
      let file = e.currentTarget.files[0];
      let blob = file.slice(0, file.size, file.type);
      let newFile = new File([blob], random + file.name, {
        type: file.type,
      });
      setProfileImage(URL.createObjectURL(newFile));
      values.profileImage = newFile;
      setValues((oldValue) => ({ ...oldValue }));
    }
  };

  const getUserUrl = `/admin/api/users/getOne`;
  const pushUrl = '/admin/dashboard/user-page';
  const createUrl = `/admin/api/users/create`;
  const editUrl = `/admin/api/users/edit`;

  useEffect(() => {
    let isMount = true;
    if (isMount) {
      if (location?.profile) {
        // location.profile is exist
        setProfileImage(location.profile.profileImage);
        delete location.profile.iat;
        delete location.profile.exp;
        location.profile.selfProfileUpdate = true;
        setValues((oldValues) => ({
          ...oldValues,
          ...location.profile,
        }));
      } else if (_id !== null) {
        // Search for user by _id
        setLoading(true);
        const getUser = async () => {
          const res = await fetch(getUserUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              token: `Brearer ${adminAccessToken}`,
            },
            body: JSON.stringify({ _id: _id }),
          });
          const { status } = res;
          const user = await res.json();
          const errorText =
            user?.ErrorCode == undefined ? user.Error : t(`${user?.ErrorCode}`);
          if (status !== 200 && !user.success) {
            alertCall('error', errorText, () => {
              setLoading(false);
              history.push(pushUrl);
            });
          } else {
            setProfileImage(user.data.profileImage);
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
            setLoading(false);
          }
        };

        getUser();
      }
    }
    return () => {
      isMount = false;
    };
  }, [location]);

  const deleteImage = () => {
    setProfileImage('');
    values.profileImage = '';
    values.profileImageKey = '';
    setValues((oldValue) => ({ ...oldValue }));
  };

  const formSubmit = async () => {
    delete values.showPassword;
    if (_id == null) {
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
        alertCall('error', errorText, () => {
          dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
        });
      } else {
        alertCall(
          'success',
          `${user.data.userName} ${t('userCreateSuccess')}`,
          () => {
            dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
            dispatch({ type: 'TOTAL_USERS', payload: user.totalUsersLength });
            setCookies('totalUsers', user.totalUsersLength);
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
        alertCall('error', errorText, () => {
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

  const alertCall = (type, message, callback) => {
    const backgroundColor =
      type == 'error' ? theme.palette.error.dark : theme.palette.secondary.main;
    Alert[type]('', {
      customFields: {
        message: `${message}`,
        styles: {
          backgroundColor: backgroundColor,
          color: 'black',
          zIndex: 9999,
        },
      },
      onClose: function () {
        callback();
      },
      timeout: 'none',
      position: 'bottom',
      effect: 'bouncyflip',
    });
  };

  return {
    values,
    handleChange,
    loading,
    profileImage,
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

export default useFormHook;
