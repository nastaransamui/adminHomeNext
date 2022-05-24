import { useTheme } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import alertCall from './useAlert';

const useActiveAlert = ({
  state,
  modelName,
  fileName,
  t,
  Url,
  dispatchType,
}) => {
  const dispatch = useDispatch();
  const { adminAccessToken } = useSelector((state) => state);
  const theme = useTheme();
  const sweetActiveAlert = (data) => {
    Swal.fire({
      title: `${t('activeTitle')}`,
      text: `${t('confirmActive')}`,
      showCancelButton: true,
      background: theme.palette.background.default,
      confirmButtonColor: theme.palette.secondary.main,
      cancelButtonColor: theme.palette.primary.main,
      confirmButtonText: `<i class="fa fa-thumbs-up" ></i> <span style="color:${
        theme.palette.primary.contrastText
      }">${t('confirmActiveButton')}<span>`,
      cancelButtonText: `<i class="fa fa-thumbs-down" ></i> <span style="color:${
        theme.palette.primary.contrastText
      }">${t('cancelActiveButton')}<span>`,
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
              }),
            });
            const { status } = res;
            const response = await res.json();
            if (status !== 200 && !res.ok) {
              alertCall(theme, 'error', response.Error, () => {
                dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
              });
            } else {
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
                title: t('activated'),
                text: t('activeSuccess'),
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
            });
          }
        };
        activate();
      }
    });
  };
  const sweetDiactiveAlert = (data) => {
    Swal.fire({
      title: `${t('diActiveTitle')}`,
      text: `${t('confirmDiActive')}`,
      showCancelButton: true,
      background: theme.palette.background.default,
      confirmButtonColor: theme.palette.secondary.main,
      cancelButtonColor: theme.palette.primary.main,
      confirmButtonText: `<i class="fa fa-thumbs-up" ></i> <span style="color:${
        theme.palette.primary.contrastText
      }">${t('confirmDiActiveButton')}<span>`,
      cancelButtonText: `<i class="fa fa-thumbs-down" ></i> <span style="color:${
        theme.palette.primary.contrastText
      }">${t('cancelDiActiveButton')}<span>`,
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
                data: data,
              }),
            });
            const { status } = res;
            const response = await res.json();
            if (status !== 200 && !res.ok) {
              alertCall(theme, 'error', response.Error, () => {
                dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
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
                title: t('diActivated'),
                text: t('diActiveSuccess'),
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
