import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import usePerRowHook from '../../../Hooks/usePerRowHook';
import usePageSearch from '../../../Hooks/usePageSearch';
import useAllResults from '../../../Hooks/useAllResults';
import { getAllUrl, exportCsvUrl } from './activeHotelsStatic';
import alertCall from '../../../Hooks/useAlert';
import { useTheme } from '@mui/material';
import { checkCookies } from 'cookies-next';
import { useRouter } from 'next/router';

const activeHotelsHook = () => {
  const theme = useTheme();
  const router = useRouter();
  const { Hotels, adminAccessToken } = useSelector((state) => state);
  const { dataArray, dataArrayLengh, pageNumber, SortBy, PerPage } = Hotels;
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation('hotels');
  const perRow = usePerRowHook(Hotels);
  const { searchText, requestSearch, setSearchText, rows } =
    usePageSearch(dataArray);

  const allResults = useAllResults({
    state: Hotels,
    modelName: 'Hotels',
    t: t,
    i18n: i18n,
    getAllUrl: getAllUrl,
    dispatchType: 'HOTELS',
    cookieName: 'hotels',
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
        type: 'HOTELS',
        payload: { ...Hotels, GridView: perRow },
      });
    }
  }, [perRow]);

  const exportCsv = async () => {
    dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: true });
    try {
      console.log('exportCsv');
    } catch (error) {
      alertCall(theme, 'error', error.toString(), () => {
        if (!checkCookies('adminAccessToken')) {
          router.push('/', undefined, { shallow: true });
        }
      });
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

export default activeHotelsHook;
