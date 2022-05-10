import { useTheme } from '@mui/material';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import usePerRowHook from '../Hooks/usePerRowHook';
import useSearch from '../Hooks/useSearch';
import { getAllUrl, exportCsvUrl } from './usersStatic';
import alertCall from '../Hooks/useAlert';
import useAllResults from '../Hooks/useAllResults';

export function escapeRegExp(value) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

const usersHook = () => {
  const { Users, adminAccessToken } = useSelector((state) => state);
  const { dataArray, dataArrayLengh, pageNumber, SortBy, CardView, PerPage } =
    Users;

  const dispatch = useDispatch();
  const theme = useTheme();
  const { t, i18n } = useTranslation('users');
  const perRow = usePerRowHook(Users);
  const { searchText, requestSearch, setSearchText, rows } =
    useSearch(dataArray);

  const allResults = useAllResults({
    state: Users,
    modelName: 'Users',
    t: t,
    i18n: i18n,
    getAllUrl: getAllUrl,
    dispatchType: 'USERS',
    cookieName: 'users',
  });

  useEffect(() => {
    let isMout = true;
    if (isMout) {
      allResults();
    }
    return () => {
      isMout = false;
    };
  }, [dataArrayLengh, PerPage, pageNumber, SortBy]);

  useEffect(() => {
    if (perRow !== undefined) {
      dispatch({
        type: 'USERS',
        payload: { ...Users, GridView: perRow },
      });
    }
  }, [perRow]);

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
      if (status !== 200 && !ok) {
        alertCall(theme, 'error', res.Error, () => {});
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
      alertCall(theme, 'error', error.toString(), () => {});
    }
  };


  return {
    searchText,
    requestSearch,
    setSearchText,
    rows,
    exportCsv,
  };
};

export default usersHook;
