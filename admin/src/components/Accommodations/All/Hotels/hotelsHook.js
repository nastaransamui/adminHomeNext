import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import usePerRowHook from '../../../Hooks/usePerRowHook';
import usePageSearch from '../../../Hooks/usePageSearch';
import useAllResults from '../../../Hooks/useAllResults';
import { getAllListUrl } from './hotelsStatic';
import Pusher from 'pusher-js';

const hotelsHook = (socket) => {
  const { hotelsGStore } = useSelector((state) => state);
  const isVercel = process.env.NEXT_PUBLIC_SERVERLESS == 'true' ? true : false;
  const { dataArray, dataArrayLengh, pageNumber, SortBy, PerPage } =
    hotelsGStore;
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation('hotels');
  const perRow = usePerRowHook(hotelsGStore);
  const { searchText, requestSearch, setSearchText, rows } =
    usePageSearch(dataArray);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertText, setAlertText] = useState(t('durationAlert'));

  useEffect(() => {
    let isMount = true;
    if (isMount && isVercel) {
      // Pusher.logToConsole = true;

      var pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
        cluster: 'ap1',
        encrypted: true,
      });
      var channel = pusher.subscribe('hotelsImport');
      channel.bind('hotelsImportDone', function (data) {
        setAlertText(data.done);
        setOpenAlert(true);
      });
      channel.bind('hotelsImportNull', function (data) {
        setAlertText(data.done);
        setOpenAlert(true);
      });
      channel.bind('pusher:subscription_succeeded', function (members) {
        console.log('successfully subscribed!');
      });
    }
    return () => {
      isMount = false;
      pusher?.disconnect();
    };
  }, []);

  useEffect(() => {
    let isMount = true;
    if (isMount && !isVercel && socket !== undefined) {
      socket.on('hotelsImportCount', function (data) {
        if (data.percentage == 1) {
          setOpenAlert(true);
        }
        setAlertText(`${data.percentage} %`);
      });
    }
    return () => {
      isMount = false;
    };
  }, [socket]);

  useEffect(() => {
    let isMount = true;
    if (isMount && !isVercel && socket !== undefined) {
      socket.on('hotelsImportDone', (data) => {
        setOpenAlert(true);
        setAlertText(data.done);
      });
    }
    return () => {
      isMount = false;
    };
  }, [socket]);

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

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenAlert(false);
  };

  return {
    searchText,
    requestSearch,
    setSearchText,
    rows,
    exportCsv,
    t,
    openAlert,
    handleCloseAlert,
    alertText,
    dispatch,
  };
};

export default hotelsHook;
