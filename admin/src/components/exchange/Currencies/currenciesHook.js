import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import usePerRowHook from '../../Hooks/usePerRowHook';
import usePageSearch from '../../Hooks/usePageSearch';
import useAllResults from '../../Hooks/useAllResults';
import { getAllUrl, exportCsvUrl } from './currenciesStatic';
import alertCall from '../../Hooks/useAlert';
import { useTheme } from '@mui/material';

const currenciesHook = (componentView) => {
  const theme = useTheme();
  const { currenciesGStore, currenciesAStore, adminAccessToken } = useSelector(
    (state) => state
  );
  const { dataArray, dataArrayLengh, pageNumber, SortBy, PerPage } =
    componentView == 'global_currencies' ? currenciesGStore : currenciesAStore;
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation('exchange');
  const perRow = usePerRowHook(
    componentView == 'global_currencies' ? currenciesGStore : currenciesAStore
  );
  const { searchText, requestSearch, setSearchText, rows } =
    usePageSearch(dataArray);
  const allResults = useAllResults({
    state:
      componentView == 'global_currencies'
        ? currenciesGStore
        : currenciesAStore,
    fileName:
      componentView == 'global_currencies' ? 'currencies.json' : undefined,
    modelName: 'Currencies',
    t: t,
    i18n: i18n,
    getAllUrl: getAllUrl,
    dispatchType:
      componentView == 'global_currencies'
        ? 'CURRENCIES_G_STORE'
        : 'CURRENCIES_A_STORE',
    cookieName:
      componentView == 'global_currencies'
        ? 'currenciesGStore'
        : 'currenciesAStore',
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
      if (componentView == 'global_currencies') {
        dispatch({
          type: 'CURRENCIES_G_STORE',
          payload: { ...currenciesGStore, GridView: perRow },
        });
      } else {
        dispatch({
          type: 'CURRENCIES_A_STORE',
          payload: { ...currenciesAStore, GridView: perRow },
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
            componentView == 'global_currencies'
              ? 'currencies.json'
              : undefined,
          modelName: 'Currencies',
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
        componentView == 'global_currencies'
          ? 'global_currencies.csv'
          : 'Active_Currencies.csv';
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

export default currenciesHook;
