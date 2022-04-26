import { createStore } from 'redux';
import { createWrapper, HYDRATE } from 'next-redux-wrapper';
import { sliderImage } from '../components/mainPageSetup/Photos/photosStatic';
import { sliderVideo } from '../components/mainPageSetup/Videos/videosStatic';
import { Users } from '../components/Users/usersStatic';
const initialState = {
  adminAccessToken: null,
  adminThemeName: 'cloud',
  adminThemeType: 'light',
  adminLoadingBar: 0,
  adminFormSubmit: false,
  stringLimit: 40,
  profile: {},
  perPageArray: [6, 12, 24, 48, 96],
  Users: { ...Users },
  sliderVideo: { ...sliderVideo },
  sliderImage: { ...sliderImage },
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
    case 'PER_PAGE_ARRAY':
      return { ...state, perPageArray: payload };
    case 'USERS':
      return {
        ...state,
        Users: { ...payload },
      };
    case 'SLIDER_VIDEO':
      return {
        ...state,
        sliderVideo: { ...payload },
      };
    case 'SLIDER_IMAGE':
      return {
        ...state,
        sliderImage: { ...payload },
      };
    default:
      return state;
  }
};

const makeStore = (context) => createStore(reducer);

export const wrapper = createWrapper(makeStore, {
  debug: process.env.NODE_ENV == 'development' ? false : false,
});
