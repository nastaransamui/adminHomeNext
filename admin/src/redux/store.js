import { createStore } from 'redux';
import { createWrapper, HYDRATE } from 'next-redux-wrapper';

const initialState = {
  adminAccessToken: null,
  adminThemeName: 'cloud',
  adminThemeType: 'light',
  adminLoadingBar: 0,
  adminFormSubmit: false,
  stringLimit: 15,
  profile: {},
};

const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case HYDRATE:
      return { ...state, ...payload };
    case 'ADMIN_ACCESS_TOKEN':
      return { ...state, adminAccessToken: payload };
    case 'ADMIN_THEMENAME':
      return { ...state, adminThemeName: payload };
    case 'ADMIN_THEMETYPE':
      return { ...state, adminThemeType: payload };
    case 'ADMIN_LOADINGBAR':
      return { ...state, adminLoadingBar: payload };
    case 'ADMIN_FORM_SUBMIT':
      return { ...state, adminFormSubmit: payload };
    case 'STRING_LIMIT':
      return { ...state, stringLimit: payload };
    case 'ADMIN_PROFILE':
      return { ...state, profile: payload };
    default:
      return state;
  }
};

const makeStore = (context) => createStore(reducer);

export const wrapper = createWrapper(makeStore, {
  debug: process.env.NODE_ENV == 'development' ? false : false,
});
