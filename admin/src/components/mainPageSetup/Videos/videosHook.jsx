import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import usePageSearch from '../../Hooks/usePageSearch';
import { getAllUrl } from './videosStatic';
import useAllResults from '../../Hooks/useAllResults';

const videosHook = () => {
  const { sliderVideo } = useSelector((state) => state);
  const { dataArray, dataArrayLengh, pageNumber, SortBy, PerPage } =
    sliderVideo;

  const dispatch = useDispatch();
  const { t, i18n } = useTranslation('video');

  const { searchText, requestSearch, setSearchText, rows } =
    usePageSearch(dataArray);

  const allResults = useAllResults({
    state: sliderVideo,
    modelName: 'Videos',
    t: t,
    i18n: i18n,
    getAllUrl: getAllUrl,
    dispatchType: 'SLIDER_VIDEO',
    cookieName: 'sliderVideo',
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



  return {
    searchText,
    requestSearch,
    setSearchText,
    rows,
  };
};

export default videosHook;
