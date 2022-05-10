import { useDispatch } from 'react-redux';
import { setCookies } from 'cookies-next';

const useDataHeaders = ({ state, dispatchType, cookieName }) => {
  const dispatch = useDispatch();
  const { CardView, dataArrayLengh, pageNumber } = state;
  const gridNumberFunc = (list) => {
    dispatch({
      type: dispatchType,
      payload: { ...state, GridView: list },
    });
    state.dataArray = [];
    setCookies(
      cookieName,
      JSON.stringify({
        ...state,
        GridView: list,
      })
    );
  };
  const cardViewsFunc = () => {
    dispatch({
      type: dispatchType,
      payload: { ...state, CardView: !CardView },
    });

    state.dataArray = [];
    setCookies(
      cookieName,
      JSON.stringify({
        ...state,
        CardView: !CardView,
      })
    );
  };
  const paginationChange = (value) => {
    dispatch({
      type: dispatchType,
      payload: { ...state, pageNumber: value },
    });

    state.dataArray = [];
    setCookies(
      cookieName,
      JSON.stringify({
        ...state,
        pageNumber: value,
      })
    );
  };
  const perPageFunc = (list) => {
    if (Math.ceil(dataArrayLengh / list) < pageNumber) {
      dispatch({
        type: dispatchType,
        payload: {
          ...state,
          pageNumber: Math.ceil(dataArrayLengh / list),
          PerPage: list,
        },
      });

      state.dataArray = [];
      setCookies(
        cookieName,
        JSON.stringify({
          ...state,
          pageNumber: Math.ceil(dataArrayLengh / list),
          PerPage: list,
        })
      );
    } else {
      dispatch({
        type: dispatchType,
        payload: { ...state, PerPage: list },
      });

      state.dataArray = [];
      setCookies(
        cookieName,
        JSON.stringify({
          ...state,
          PerPage: list,
        })
      );
    }
  };
  const sortByFunc = (field, listNumber) => {
    dispatch({
      type: dispatchType,
      payload: {
        ...state,
        SortBy: {
          field: field,
          sorting: listNumber,
        },
      },
    });

    state.dataArray = [];

    setCookies(
      cookieName,
      JSON.stringify({
        ...state,
        SortBy: {
          field: field,
          sorting: listNumber,
        },
      })
    );
  };

  return {
    gridNumberFunc,
    cardViewsFunc,
    paginationChange,
    perPageFunc,
    sortByFunc,
  };
};

export default useDataHeaders;
