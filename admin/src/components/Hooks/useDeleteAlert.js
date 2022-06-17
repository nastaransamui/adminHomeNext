import { useTheme } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import alertCall from './useAlert';
import { checkCookies } from 'cookies-next';
import { useRouter } from 'next/router';

const useDeleteAlert = ({ state, modelName, t, deleteUrl, dispatchType }) => {
  const dispatch = useDispatch();
  const { adminAccessToken } = useSelector((state) => state);
  const theme = useTheme();
  const router = useRouter();
  const sweetDeleteAlert = (data) => {
    data.modelName = modelName;
    Swal.fire({
      title: `${t('deleteTitle')}`,
      text: `${t('confirmDelete')}`,
      showCancelButton: true,
      background: theme.palette.background.default,
      confirmButtonColor: theme.palette.secondary.main,
      cancelButtonColor: theme.palette.primary.main,
      confirmButtonText: `<i class="fa fa-thumbs-up" ></i> <span style="color:${
        theme.palette.primary.contrastText
      }">${t('confirmDeleteButton')}<span>`,
      cancelButtonText: `<i class="fa fa-thumbs-down" ></i> <span style="color:${
        theme.palette.primary.contrastText
      }">${t('cancelDeleteButton')}<span>`,
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
        const getAllUser = async () => {
          const res = await fetch(deleteUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              token: `Brearer ${adminAccessToken}`,
            },
            body: JSON.stringify(data),
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
                dataArrayLengh: response.totalValuesLength,
              },
            });
            Swal.fire({
              title: t('deleted'),
              text: t('deleteSuccess'),
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
        };
        getAllUser();
      }
    });
  };
  return sweetDeleteAlert;
};

export default useDeleteAlert;
