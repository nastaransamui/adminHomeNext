import { useTheme } from '@mui/material';
import { setCookies } from 'cookies-next';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import Alert from 'react-s-alert';
import Swal from 'sweetalert2';
import usePerRowHook from '../Hooks/usePerRowHook';
import useSearch from '../Hooks/useSearch';
import { getAllUserUrl, deleteUserUrl, exportCsvUrl } from './usersStatic';

export function escapeRegExp(value) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

const usersHook = () => {
  const {
    usersPerPage,
    totalUsers,
    usersPageNumber,
    adminAccessToken,
    users,
    usersSortBy,
    usersCardView
  } = useSelector((state) => state);

  const dispatch = useDispatch();
  const theme = useTheme();
  const { t, i18n } = useTranslation('users');
  const perRow = usePerRowHook('usersGrid');
  const{searchText, requestSearch, setSearchText, rows} = useSearch(users)

  useEffect(() => {
    const abortController = new AbortController();
    let isMout = true;
    dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: true });
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
              modelName: 'Users',
              valuesPerPage: usersPerPage,
              valuesPageNumber: usersPageNumber,
              valuesSortByField: usersSortBy[`field`],
              valuesSortBySorting: usersSortBy[`sorting`],
              locale: i18n.language !== 'fa' ? 'en' : 'fa',
            }),
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
            //Fixed last page if after delete number of page is wrong
            if (
              usersPageNumber > Math.ceil(user.totalValuesLength / usersPerPage)
            ) {
              dispatch({
                type: 'USERS_PAGE_NUMBER',
                payload: Math.ceil(user.totalValuesLength / usersPerPage),
              });
              setCookies(
                'usersPageNumber',
                Math.ceil(user.totalValuesLength / usersPerPage)
              );
            }
            dispatch({ type: 'USERS', payload: user.data });
            dispatch({ type: 'TOTAL_USERS', payload: user.totalValuesLength });
            setCookies('totalUsers', user.totalValuesLength);
            dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
          }
        } catch (e) {
          abortController.abort();
          alertCall('error', e.toString(), () => {
            dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
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
    if(perRow !== undefined){
      dispatch({
        type: 'USERS_GRID',
        payload: perRow,
      });
    }
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
        user.modelName = "Users"
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
              payload: response.totalValuesLength,
            });
            setCookies('totalUsers', user.totalValuesLength);
            Swal.fire({
              title: t('deleted'),
              ext: t('deleteSuccess'),
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

  const paginationChange = (value) => {
    dispatch({ type: 'USERS_PAGE_NUMBER', payload: value });
    setCookies('usersPageNumber', value);
  };

  const perPageFunc = (list) => {
    if (Math.ceil(totalUsers / list) < usersPageNumber) {
      dispatch({
        type: 'USERS_PAGE_NUMBER',
        payload: Math.ceil(totalUsers / list),
      });
      setCookies('usersPageNumber', Math.ceil(totalUsers / list));
    }
    dispatch({
      type: 'USERS_PER_PAGE',
      payload: list,
    });
    localStorage.setItem('usersPerPage', list);
    setCookies('usersPerPage', list);
  };

  const sortByFunc = (field, listNumber) => {
    dispatch({
      type: 'USERS_SORT_BY',
      payload: {
        field: field,
        sorting: listNumber,
      },
    });
    setCookies('usersSortBy', {
      field: field,
      sorting: listNumber,
    });
  };

  const exportCsv = async () => {
    dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: true });
    try {
      const res = await fetch(exportCsvUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token: `Brearer ${adminAccessToken}`,
        },
        body: JSON.stringify({
          download: '',
          downloadKey: '',
          finalFolder: 'download',
        }),
      });
      const { status, ok } = res;
      console.log(res);
      if (status !== 200 && !ok) {
        alertCall('error', res.Error, () => {});
      }
      dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
      const { fileLink } = await res.json();
      var link = document.createElement('a');
      link.href = fileLink;
      link.download = 'Users.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      alertCall('error', error.toString(), () => {});
    }
  };

  const cardViewsFunc = () =>{
    dispatch({
      type: 'USERS_CARD_VIEW',
      payload: !usersCardView,
    });
    setCookies('usersCardView', !usersCardView);
  }

  const gridNumberFunc = (list)=>{
    dispatch({
      type: 'USERS_GRID',
      payload: list,
    });
    localStorage.setItem('usersGrid', list);
  }

  return {
    alertCall,
    sweetAlert,
    searchText,
    requestSearch,
    setSearchText,
    rows,
    paginationChange,
    perPageFunc,
    sortByFunc,
    exportCsv,
    cardViewsFunc,
    gridNumberFunc
  };
};

export default usersHook;
