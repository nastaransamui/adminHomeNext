import { useTheme } from '@mui/material';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import usePerRowHook from '../../Hooks/usePerRowHook';
import usePageSearch from '../../Hooks/usePageSearch';
import { getAllUrl, exportCsvUrl } from './agenciesStatic';
import alertCall from '../../Hooks/useAlert';
import useAllResults from '../../Hooks/useAllResults';

export function escapeRegExp(value) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

const agenciesHook = () => {
  const { Agencies, adminAccessToken } = useSelector((state) => state);
  const { dataArray, dataArrayLengh, pageNumber, SortBy,  PerPage } =
    Agencies;

  const dispatch = useDispatch();
  const theme = useTheme();
  const { t, i18n } = useTranslation('agencies');
  const perRow = usePerRowHook(Agencies);
  const { searchText, requestSearch, setSearchText, rows } =
    usePageSearch(dataArray);

  const allResults = useAllResults({
    state: Agencies,
    modelName: 'Agencies',
    t: t,
    i18n: i18n,
    getAllUrl: getAllUrl,
    dispatchType: 'AGENCIES',
    cookieName: 'agencies',
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
        type: 'AGENCIES',
        payload: { ...Agencies, GridView: perRow },
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
      link.download = 'Agencies.csv';
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

export default agenciesHook;
