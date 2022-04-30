
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import usePerRowHook from '../../Hooks/usePerRowHook';
import useSearch from '../../Hooks/useSearch';
import { getAllUrl } from './featuresStatic';
import useAllResults from '../../Hooks/useAllResults';

const featuresHook = () => {
  const { Features } = useSelector((state) => state);
  const { dataArray, dataArrayLengh, pageNumber, SortBy, CardView, PerPage } =
    Features;

  const dispatch = useDispatch();
  const { t, i18n } = useTranslation('feature');
  const perRow = usePerRowHook('featuresGrid');
  const { searchText, requestSearch, setSearchText, rows } =
    useSearch(dataArray);

  const allResults = useAllResults({
    state: Features,
    modelName: 'Features',
    t: t,
    i18n: i18n,
    getAllUrl: getAllUrl,
    dispatchType: 'FEATURES',
    cookieName: 'features',
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
        type: 'FEATURES',
        payload: { ...Features, GridView: perRow },
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

export default featuresHook;
