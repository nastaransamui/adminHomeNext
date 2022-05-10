import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import usePerRowHook from '../../Hooks/usePerRowHook';
import useSearch from '../../Hooks/useSearch';
import useAllResults from '../../Hooks/useAllResults';
import { getAllUrl } from './citiesStatic';

const citiesHook = () => {
  const { citiesStore } = useSelector((state) => state);
  const { dataArray, dataArrayLengh, pageNumber, SortBy, PerPage } =
    citiesStore;
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation('geoLocations');
  const perRow = usePerRowHook(citiesStore);
  const { searchText, requestSearch, setSearchText, rows } =
    useSearch(dataArray);
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

  return {
    searchText,
    requestSearch,
    setSearchText,
    rows,
  };
};

export default citiesHook;
