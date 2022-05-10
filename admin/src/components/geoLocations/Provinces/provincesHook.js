import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import usePerRowHook from '../../Hooks/usePerRowHook';
import useSearch from '../../Hooks/useSearch';
import useAllResults from '../../Hooks/useAllResults';
import { getAllUrl } from './provincesStatic';

const provincesHook = () => {
  const { provincesStore } = useSelector((state) => state);
  const { dataArray, dataArrayLengh, pageNumber, SortBy, PerPage } =
    provincesStore;
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation('geoLocations.Province');
  const perRow = usePerRowHook(provincesStore);
  const { searchText, requestSearch, setSearchText, rows } =
    useSearch(dataArray);
  const allResults = useAllResults({
    state: provincesStore,
    modelName: 'Countries',
    t: t,
    i18n: i18n,
    getAllUrl: getAllUrl,
    dispatchType: 'PROVINCES_STORE',
    cookieName: 'provincesStore',
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
        type: 'PROVINCES_STORE',
        payload: { ...provincesStore, GridView: perRow },
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

export default provincesHook;
