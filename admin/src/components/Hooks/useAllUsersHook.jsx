import { useTheme } from '@mui/material';
import { setCookies } from 'cookies-next';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import Alert from 'react-s-alert';
import Swal from 'sweetalert2';
import usePerRowHook from './usePerRowHook';

const getAllUserUrl = `/admin/api/users/getAll`;
const deleteUserUrl = `/admin/api/users/delete`;

export function escapeRegExp(value) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

const useAllUsersHook = () => {
  const [loading, setLoading] = useState(false);
  const {
    usersPerPage,
    totalUsers,
    usersPageNumber,
    adminAccessToken,
    users,
    usersSortBy,
  } = useSelector((state) => state);
  const dispatch = useDispatch();
  const theme = useTheme();
  const { t, i18n } = useTranslation('users');
  const perRow = usePerRowHook();
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState(users);
  const requestSearch = (searchValue) => {
    setSearchText(searchValue);
    const searchRegex = new RegExp(escapeRegExp(searchValue), 'i');
    const filterdData = users.filter((row) => {
      return Object.keys(row).some((field) => {
        return searchRegex.test(row[field].toString());
      });
    });
    setRows(filterdData);
  };

  useEffect(() => {
    setRows(users);
  }, [users]);

  useEffect(() => {
    const abortController = new AbortController();
    let isMout = true;
    setLoading(true);
    if (isMout) {
      const getAllUser = async () => {
        try {
          const res = await fetch(getAllUserUrl, {
            signal: abortController.signal,
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              token: `Brearer ${adminAccessToken}`,
            },
            body: JSON.stringify({
              usersPerPage: usersPerPage,
              usersPageNumber: usersPageNumber,
              usersSortByField: usersSortBy[`field`],
              usersSortBySorting: usersSortBy[`sorting`],
              locale: i18n.language !== 'fa' ? 'en' : 'fa',
            }),
          });

          const { status } = res;
          const user = await res.json();
          const errorText =
            user?.ErrorCode == undefined ? user.Error : t(`${user?.ErrorCode}`);
          if (status !== 200 && !user.success) {
            alertCall('error', errorText, () => {
              setLoading(false);
            });
          } else {
            //Fixe last page if after delete number of page is wrong
            if (
              usersPageNumber > Math.ceil(user.totalUsersLength / usersPerPage)
            ) {
              dispatch({
                type: 'USERS_PAGE_NUMBER',
                payload: Math.ceil(user.totalUsersLength / usersPerPage),
              });
              setCookies(
                'usersPageNumber',
                Math.ceil(user.totalUsersLength / usersPerPage)
              );
            }
            dispatch({ type: 'USERS', payload: user.data });
            dispatch({ type: 'TOTAL_USERS', payload: user.totalUsersLength });
            setCookies('totalUsers', user.totalUsersLength);
            setLoading(false);
          }
        } catch (e) {
          abortController.abort();
          alertCall('error', e.toString(), () => {
            setLoading(false);
          });
        }
      };

      getAllUser();
    }

    return () => {
      abortController.abort();
      isMout = false;
    };
  }, [totalUsers, usersPerPage, usersPageNumber, usersSortBy]);

  useEffect(() => {
    dispatch({
      type: 'USERS_GRID',
      payload: perRow,
    });
  }, [perRow]);

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

  const sweetAlert = (user) => {
    Swal.fire({
      title: `${t('deleteTitle')}`,
      text: `${t('confirmDelete')}`,
      showCancelButton: true,
      background: theme.palette.background.default,
      confirmButtonColor: theme.palette.secondary.main,
      cancelButtonColor: theme.palette.primary.main,
      confirmButtonText: `<i class="fa fa-thumbs-up" ></i> <span style="color:${
        theme.palette.primary.contrastText
      }">${t('confirmDeleteButton')}<span>`,
      cancelButtonText: `<i class="fa fa-thumbs-down" ></i> <span style="color:${
        theme.palette.primary.contrastText
      }">${t('cancelDeleteButton')}<span>`,
      color: theme.palette.text.color,
      icon: 'question',
      showClass: {
        popup: 'animate__animated animate__zoomInDown',
      },
      hideClass: {
        popup: 'animate__animated animate__zoomOutDown',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: true });
        const getAllUser = async () => {
          const res = await fetch(deleteUserUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              token: `Brearer ${adminAccessToken}`,
            },
            body: JSON.stringify(user),
          });
          const { status } = res;
          const response = await res.json();
          // const errorText =
          //   user?.ErrorCode == undefined ? user.Error : t(`${user?.ErrorCode}`);

          if (status !== 200 && !res.ok) {
            alertCall('error', res.statusText, () => {
              dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
            });
          } else {
            dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
            dispatch({
              type: 'TOTAL_USERS',
              payload: response.totalUsersLength,
            });
            setCookies('totalUsers', user.totalUsersLength);
            Swal.fire({
              title: t('deleted'),
              ext: t("deleteSuccess"),
              icon: 'success',
              confirmButtonColor: theme.palette.primary.main,
              background: theme.palette.background.default,
              color: theme.palette.text.color,
              showClass: {
                popup: 'animate__animated animate__fadeInDown',
              },
              hideClass: {
                popup: 'animate__animated animate__zoomOutDown',
              },
            });
          }
        };

        getAllUser();
      }
    });
  };

  return {
    loading,
    alertCall,
    sweetAlert,
    searchText,
    requestSearch,
    setSearchText,
    rows,
  };
};

export default useAllUsersHook;
