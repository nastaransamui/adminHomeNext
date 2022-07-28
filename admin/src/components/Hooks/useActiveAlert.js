import { useTheme } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import alertCall from './useAlert';
import { checkCookies, setCookies } from 'cookies-next';
import { useRouter } from 'next/router';

const useActiveAlert = ({
  state,
  modelName,
  fileName,
  t,
  Url,
  dispatchType,
  activesId,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { adminAccessToken } = useSelector((state) => state);
  const theme = useTheme();
  const sweetActiveAlert = (data) => {
    Swal.fire({
      title: `${t('activeTitle', { ns: 'common' })}`,
      text: `${t('confirmActive', { ns: 'common' })}`,
      showCancelButton: true,
      background: theme.palette.background.default,
      confirmButtonColor: theme.palette.secondary.main,
      cancelButtonColor: theme.palette.primary.main,
      confirmButtonText: `<i class="fa fa-thumbs-up" ></i> <span style="color:${
        theme.palette.primary.contrastText
      }">${t('confirmActiveButton', { ns: 'common' })}<span>`,
      cancelButtonText: `<i class="fa fa-thumbs-down" ></i> <span style="color:${
        theme.palette.primary.contrastText
      }">${t('cancelActiveButton', { ns: 'common' })}<span>`,
      color: theme.palette.text.color,
      icon: 'question',
      showClass: {
        popup: 'animate__animated animate__zoomInDown',
      },
      hideClass: {
        popup: 'animate__animated animate__zoomOutDown',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: true });
        const activate = async () => {
          try {
            const res = await fetch(Url, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                token: `Brearer ${adminAccessToken}`,
              },
              body: JSON.stringify({
                modelName: modelName,
                fileName: fileName,
                valuesPerPage: state.PerPage,
                valuesPageNumber: state.pageNumber,
                valuesSortByField: state.SortBy[`field`],
                valuesSortBySorting: state.SortBy[`sorting`],
                country_id: data.id,
                iso2: data.iso2,
              }),
            });
            const { status } = res;
            if (status !== 200 && !res.ok) {
              alertCall(theme, 'error', res.statusText, () => {
                dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
                if (!checkCookies('adminAccessToken')) {
                  router.push('/', undefined, { shallow: true });
                }
              });
            } else {
              const response = await res.json();
              dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
              dispatch({
                type: dispatchType,
                payload: {
                  ...state,
                  dataArrayLengh: response.totalValuesLength,
                  activesId: response.activesId,
                },
              });
              Swal.fire({
                title: t('activated', { ns: 'common' }),
                text: t('activeSuccess', { ns: 'common' }),
                icon: 'success',
                confirmButtonColor: theme.palette.primary.main,
                background: theme.palette.background.default,
                color: theme.palette.text.color,
                showClass: {
                  popup: 'animate__animated animate__fadeInDown',
                },
                hideClass: {
                  popup: 'animate__animated animate__zoomOutDown',
                },
              });
            }
          } catch (error) {
            alertCall(theme, 'error', error.toString(), () => {
              dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
              if (!checkCookies('adminAccessToken')) {
                router.push('/', undefined, { shallow: true });
              }
            });
          }
        };
        activate();
      }
    });
  };
  const sweetDiactiveAlert = (data) => {
    Swal.fire({
      title: `${t('diActiveTitle', { ns: 'common' })}`,
      text: `${t('confirmDiActive', { ns: 'common' })}`,
      showCancelButton: true,
      background: theme.palette.background.default,
      confirmButtonColor: theme.palette.secondary.main,
      cancelButtonColor: theme.palette.primary.main,
      confirmButtonText: `<i class="fa fa-thumbs-up" ></i> <span style="color:${
        theme.palette.primary.contrastText
      }">${t('confirmDiActiveButton', { ns: 'common' })}<span>`,
      cancelButtonText: `<i class="fa fa-thumbs-down" ></i> <span style="color:${
        theme.palette.primary.contrastText
      }">${t('cancelDiActiveButton', { ns: 'common' })}<span>`,
      color: theme.palette.text.color,
      icon: 'question',
      showClass: {
        popup: 'animate__animated animate__zoomInDown',
      },
      hideClass: {
        popup: 'animate__animated animate__zoomOutDown',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: true });
        const activeCountry_id =
          activesId !== undefined
            ? activesId.filter((s) => s.id == data.id)[0]._id
            : data._id;
        const diActivate = async () => {
          try {
            const res = await fetch(Url, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                token: `Brearer ${adminAccessToken}`,
              },
              body: JSON.stringify({
                modelName: modelName,
                fileName: fileName,
                valuesPerPage: state.PerPage,
                valuesPageNumber: state.pageNumber,
                valuesSortByField: state.SortBy[`field`],
                valuesSortBySorting: state.SortBy[`sorting`],
                country_id: activeCountry_id,
                data: data,
              }),
            });
            const { status } = res;
            const response = await res.json();
            if (status !== 200 && !res.ok) {
              alertCall(theme, 'error', response.Error, () => {
                dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
                if (!checkCookies('adminAccessToken')) {
                  router.push('/', undefined, { shallow: true });
                }
              });
            } else {
              dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
              dispatch({
                type: dispatchType,
                payload: {
                  ...state,
                  dataArray: response.data,
                  dataArrayLengh: response.totalValuesLength,
                  activesId: response.activesId,
                },
              });
              Swal.fire({
                title: t('diActivated', { ns: 'common' }),
                text: t('diActiveSuccess', { ns: 'common' }),
                icon: 'success',
                confirmButtonColor: theme.palette.primary.main,
                background: theme.palette.background.default,
                color: theme.palette.text.color,
                showClass: {
                  popup: 'animate__animated animate__fadeInDown',
                },
                hideClass: {
                  popup: 'animate__animated animate__zoomOutDown',
                },
              });
            }
          } catch (error) {
            alertCall(theme, 'error', error.toString(), () => {
              dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
              if (!checkCookies('adminAccessToken')) {
                router.push('/', undefined, { shallow: true });
              }
            });
          }
        };
        diActivate();
      }
    });
  };
  return { sweetActiveAlert, sweetDiactiveAlert };
};

export default useActiveAlert;
