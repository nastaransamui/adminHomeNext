import { useDispatch, useSelector } from 'react-redux';
import alertCall from './useAlert';
import { useTheme } from '@mui/material';
import { checkCookies, setCookies } from 'cookies-next';
import { useRouter } from 'next/router';

const useAllResults = ({
  state,
  modelName,
  fileName,
  t,
  i18n,
  getAllUrl,
  dispatchType,
  cookieName,
}) => {
  const abortController = new AbortController();
  const dispatch = useDispatch();
  const theme = useTheme();
  const router = useRouter();
  const { adminAccessToken } = useSelector((state) => state);
  const { pageNumber, SortBy, PerPage } = state;
  const allResults = async () => {
    dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: true });
    try {
      const res = await fetch(getAllUrl, {
        signal: abortController.signal,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token: `Brearer ${adminAccessToken}`,
        },
        body: JSON.stringify({
          modelName: modelName,
          fileName: fileName,
          valuesPerPage: PerPage,
          valuesPageNumber: pageNumber,
          valuesSortByField: SortBy[`field`],
          valuesSortBySorting: SortBy[`sorting`],
          locale: i18n.language !== 'fa' ? 'en' : 'fa',
        }),
      });

      const { status } = res;
      const response = await res.json();
      const errorText =
        response?.ErrorCode == undefined
          ? response.Error
          : t(`${response?.ErrorCode}`);
      if (status !== 200 && !response.success) {
        alertCall(theme, 'error', errorText, () => {
          dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
          if (!checkCookies('adminAccessToken')) {
            router.push('/', undefined, { shallow: true });
          }
        });
      } else {
        //Fixe last page if after delete number of page is wrong
        if (
          pageNumber > Math.ceil(response.totalValuesLength / PerPage) &&
          response.totalValuesLength !== 0
        ) {
          dispatch({
            type: dispatchType,
            payload: {
              ...state,
              pageNumber: Math.ceil(response.totalValuesLength / PerPage),
            },
          });

          state.dataArray = [];
          setCookies(
            cookieName,
            JSON.stringify({
              ...state,
              pageNumber: Math.ceil(response.totalValuesLength / PerPage),
            })
          );
        }
        dispatch({
          type: dispatchType,
          payload: {
            ...state,
            dataArray: response.data,
            dataArrayLengh: response.totalValuesLength,
            activesId: response?.activesId,
          },
        });

        dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
      }
    } catch (e) {
      abortController.abort();
      alertCall(theme, 'error', e.toString(), () => {
        dispatch({ type: 'ADMIN_FORM_SUBMIT', payload: false });
      });
    }
  };

  return allResults;
};

export default useAllResults;
