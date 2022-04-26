import { createStore } from 'redux';
import { createWrapper, HYDRATE } from 'next-redux-wrapper';

const initialState = {
  themeName: 'cloud',
  themeType: 'light',
  loadingBar: 0,
  showMovie: false,
  youTubeBanner: false,
  accessToken: null,
  formSubmit: false,
};

const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case HYDRATE:
      return { ...state, ...payload };
    case 'THEMENAME':
      return { ...state, themeName: payload };
    case 'THEMETYPE':
      return { ...state, themeType: payload };
    case 'YOUTUBE_BANNER':
      return { ...state, youTubeBanner: payload };
    case 'SHOWMOVIE':
      return { ...state, showMovie: payload };
    case 'LOADINGBAR':
      return { ...state, loadingBar: payload };
    case 'ACCESS_TOKEN':
      return { ...state, accessToken: payload };
    case 'FORM_SUBMIT':
      return { ...state, formSubmit: payload };
    default:
      return state;
  }
};

const makeStore = (context) => createStore(reducer);

export const wrapper = createWrapper(makeStore, {
  debug: process.env.NODE_ENV == 'development' ? false : false,
});
