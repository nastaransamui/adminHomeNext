import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import usePerRowHook from '../../Hooks/usePerRowHook';
import useSearch from '../../Hooks/useSearch';
import useAllResults from '../../Hooks/useAllResults';
import { getAllUrl } from './countriesStatic';

const countriesHook = (componentView) => {
  const { countriesGStore, countriesAStore } = useSelector((state) => state);
  const { dataArray, dataArrayLengh, pageNumber, SortBy, PerPage } =
    componentView == 'global_countries' ? countriesGStore : countriesAStore;
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation('geoLocations');
  const perRow = usePerRowHook(
    componentView == 'global_countries' ? countriesGStore : countriesAStore
  );
  const { searchText, requestSearch, setSearchText, rows } =
    useSearch(dataArray);
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

  return {
    searchText,
    requestSearch,
    setSearchText,
    rows,
  };
};

export default countriesHook;
