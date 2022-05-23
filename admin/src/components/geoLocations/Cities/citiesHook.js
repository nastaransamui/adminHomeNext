import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import usePerRowHook from '../../Hooks/usePerRowHook';
import usePageSearch from '../../Hooks/usePageSearch';
import useAllResults from '../../Hooks/useAllResults';
import { getAllUrl, exportCsvUrl } from './citiesStatic';
import alertCall from '../../Hooks/useAlert';
import { useTheme } from '@mui/material';

const citiesHook = () => {
  const theme = useTheme();
  const { citiesStore, adminAccessToken } = useSelector((state) => state);
  const { dataArray, dataArrayLengh, pageNumber, SortBy, PerPage } =
    citiesStore;
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation('geoLocations');
  const perRow = usePerRowHook(citiesStore);
  const { searchText, requestSearch, setSearchText, rows } =
    usePageSearch(dataArray);
  const allResults = useAllResults({
    state: citiesStore,
    modelName: 'Countries',
    t: t,
    i18n: i18n,
    getAllUrl: getAllUrl,
    dispatchType: 'CITIES_STORE',
    cookieName: 'citiesStore',
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
        type: 'CITIES_STORE',
        payload: { ...citiesStore, GridView: perRow },
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
          modelName: 'Cities',
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
      link.download = 'Cities.csv';
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

export default citiesHook;
