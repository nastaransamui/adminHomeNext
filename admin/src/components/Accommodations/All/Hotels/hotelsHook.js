import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import usePerRowHook from '../../../Hooks/usePerRowHook';
import usePageSearch from '../../../Hooks/usePageSearch';
import useAllResults from '../../../Hooks/useAllResults';
import { getAllListUrl } from './hotelsStatic';

import alertCall from '../../../Hooks/useAlert';
import { useTheme } from '@mui/material';
import { checkCookies } from 'cookies-next';
import { useRouter } from 'next/router';

const hotelsHook = () => {
  const theme = useTheme();
  const router = useRouter();
  const { hotelsGStore, adminAccessToken } = useSelector((state) => state);

  const { dataArray, dataArrayLengh, pageNumber, SortBy, PerPage } =
    hotelsGStore;

  const dispatch = useDispatch();
  const { t, i18n } = useTranslation('hotels');
  const perRow = usePerRowHook(hotelsGStore);
  const { searchText, requestSearch, setSearchText, rows } =
    usePageSearch(dataArray);
  const allResults = useAllResults({
    state: hotelsGStore,
    fileName: undefined,
    modelName: 'HotelsList',
    t: t,
    i18n: i18n,
    getAllUrl: getAllListUrl,
    dispatchType: 'HOTELS_G_STORE',
    cookieName: 'hotelsGStore',
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
        type: 'HOTELS_G_STORE',
        payload: { ...hotelsGStore, GridView: perRow },
      });
    }
  }, [perRow]);

  const exportCsv = async () => {
    dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: true });
    setTimeout(() => {
      dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
    }, 500);
  };

  return {
    searchText,
    requestSearch,
    setSearchText,
    rows,
    exportCsv,
    t,
  };
};

export default hotelsHook;
