import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import usePerRowHook from '../../Hooks/usePerRowHook';
import { setCookies } from 'cookies-next';
import useSearch from '../../Hooks/useSearch';
import { getAllUrl } from './photosStatic';
import useAllResults from '../../Hooks/useAllResults';

const photosHook = () => {
  const { sliderImage } = useSelector((state) => state);
  const { dataArray, dataArrayLengh, pageNumber, SortBy, CardView, PerPage } =
    sliderImage;

  const dispatch = useDispatch();
  const { t, i18n } = useTranslation('photos');
  const perRow = usePerRowHook(sliderImage);
  const { searchText, requestSearch, setSearchText, rows } =
    useSearch(dataArray);

  const allResults = useAllResults({
    state: sliderImage,
    modelName: 'Photos',
    t: t,
    i18n: i18n,
    getAllUrl: getAllUrl,
    dispatchType: 'SLIDER_IMAGE',
    cookieName: 'sliderImage',
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
        type: 'SLIDER_IMAGE',
        payload: { ...sliderImage, GridView: perRow },
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

export default photosHook;
