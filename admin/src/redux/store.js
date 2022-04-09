import { createStore } from 'redux';
import { createWrapper, HYDRATE } from 'next-redux-wrapper';

const initialState = {
  adminAccessToken: null,
  adminThemeName: 'cloud',
  adminThemeType: 'light',
  adminLoadingBar: 0,
  adminFormSubmit: false,
  stringLimit: 35,
  profile: {},
  usersCardView: true,
  usersPerPage: 50,
  usersGrid: 4,
  usersPageNumber: 1,
  users: [],
  totalUsers: 0,
  usersSortBy: {
    field: 'createdAt',
    sorting: -1,
  },
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
    case 'USERS_CARD_VIEW':
      return { ...state, usersCardView: payload };
    case 'USERS_GRID':
      return { ...state, usersGrid: payload };
    case 'USERS_PER_PAGE':
      return { ...state, usersPerPage: payload };
    case 'USERS_PAGE_NUMBER':
      return { ...state, usersPageNumber: payload };
    case 'USERS':
      return { ...state, users: payload };
    case 'TOTAL_USERS':
      return { ...state, totalUsers: payload };
    case 'USERS_SORT_BY':
      return { ...state, usersSortBy: payload };
    default:
      return state;
  }
};

const makeStore = (context) => createStore(reducer);

export const wrapper = createWrapper(makeStore, {
  debug: process.env.NODE_ENV == 'development' ? false : false,
});
