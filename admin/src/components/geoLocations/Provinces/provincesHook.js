import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import usePerRowHook from '../../Hooks/usePerRowHook';
import usePageSearch from '../../Hooks/usePageSearch';
import useAllResults from '../../Hooks/useAllResults';
import { getAllUrl, exportCsvUrl } from './provincesStatic';
import alertCall from '../../Hooks/useAlert';
import { useTheme } from '@mui/material';
import { checkCookies } from 'cookies-next';
import { useRouter } from 'next/router';

const provincesHook = () => {
  const theme = useTheme();
  const router = useRouter();
  const { provincesStore, adminAccessToken } = useSelector((state) => state);
  const { dataArray, dataArrayLengh, pageNumber, SortBy, PerPage } =
    provincesStore;
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation('geoLocations.Province');
  const perRow = usePerRowHook(provincesStore);
  const { searchText, requestSearch, setSearchText, rows } =
    usePageSearch(dataArray);
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
          modelName: 'Provinces',
          download: '',
          downloadKey: '',
          finalFolder: 'download',
          folderId: 'provinces',
        }),
      });
      const { status, ok } = res;
      if (status !== 200 && !ok) {
        const { Error } = await res.json();
        alertCall(theme, 'error', t(`${Error}`), () => {
          dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
          if (!checkCookies('adminAccessToken')) {
            router.push('/', undefined, { shallow: true });
          }
        });
      } else {
        dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
        const { fileLink } = await res.json();
        var link = document.createElement('a');
        link.href = fileLink;
        link.download = 'Provinces.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
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

export default provincesHook;
