import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import usePerRowHook from '../../Hooks/usePerRowHook';
import usePageSearch from '../../Hooks/usePageSearch';
import useAllResults from '../../Hooks/useAllResults';
import { getAllUrl, exportCsvUrl } from './countriesStatic';
import alertCall from '../../Hooks/useAlert';
import { useTheme } from '@mui/material';

const countriesHook = (componentView) => {
  const theme = useTheme();
  const { countriesGStore, countriesAStore, adminAccessToken } = useSelector(
    (state) => state
  );
  const { dataArray, dataArrayLengh, pageNumber, SortBy, PerPage } =
    componentView == 'global_countries' ? countriesGStore : countriesAStore;
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation('geoLocations');
  const perRow = usePerRowHook(
    componentView == 'global_countries' ? countriesGStore : countriesAStore
  );
  const { searchText, requestSearch, setSearchText, rows } =
    usePageSearch(dataArray);
  const allResults = useAllResults({
    state:
      componentView == 'global_countries' ? countriesGStore : countriesAStore,
    fileName:
      componentView == 'global_countries'
        ? 'countries+states+cities.json'
        : undefined,
    modelName: 'Countries',
    t: t,
    i18n: i18n,
    getAllUrl: getAllUrl,
    dispatchType:
      componentView == 'global_countries'
        ? 'COUNTRIES_G_STORE'
        : 'COUNTRIES_A_STORE',
    cookieName:
      componentView == 'global_countries'
        ? 'countriesGStore'
        : 'countriesAStore',
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
      if (componentView == 'global_countries') {
        dispatch({
          type: 'COUNTRIES_G_STORE',
          payload: { ...countriesGStore, GridView: perRow },
        });
      } else {
        dispatch({
          type: 'COUNTRIES_A_STORE',
          payload: { ...countriesAStore, GridView: perRow },
        });
      }
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
          fileName:
            componentView == 'global_countries'
              ? 'countries+states+cities.json'
              : undefined,
          modelName: 'Countries',
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
      link.download =
        componentView == 'global_countries'
          ? 'global_countries.csv'
          : 'Active_Countries.csv';
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

export default countriesHook;
