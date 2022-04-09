import { useEffect, Fragment } from 'react';
import { checkCookies, getCookies } from 'cookies-next';
import { wrapper } from '../../src/redux/store';
import { withTranslation, useTranslation } from 'react-i18next';
import HeadComponent from '../../src/components/head';
import Dashboard from '../../src/pages/dashboard/Dashboard';
import Cookies from 'cookies';
import Alert from 'react-s-alert';
import CustomAlert from '../../src/components/Alert/CustomAlert';
import jwt from 'jsonwebtoken';

function index(props) {
  const { t, ready, i18n } = useTranslation('dashboard');

  return (
    <Fragment>
      <Alert contentTemplate={CustomAlert} />
      <HeadComponent title={ready && t('title')} />
      <Dashboard {...props} i18n={i18n} />
    </Fragment>
  );
}

export default withTranslation(['dashboard', 'footer', 'users'])(index);

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    const cookies = new Cookies(ctx.req, ctx.res);
    const profile = jwt.verify(
      getCookies(ctx).adminAccessToken,
      process.env.NEXT_PUBLIC_SECRET_KEY,
      (err, user) => {
        if (!err) {
          return user;
        }
      }
    );
    if (checkCookies('adminAccessToken', ctx)) {
      return {
        props: {
          adminAccessToken: getCookies(ctx).adminAccessToken,
          ...(await store.dispatch({
            type: 'ADMIN_ACCESS_TOKEN',
            payload: getCookies(ctx).adminAccessToken,
          })),
          ...(await store.dispatch({
            type: 'ADMIN_THEMETYPE',
            payload: checkCookies('adminThemeType', ctx)
              ? getCookies(ctx).adminThemeType
              : 'light',
          })),
          ...(await store.dispatch({
            type: 'ADMIN_PROFILE',
            payload: profile,
          })),
          ...(await store.dispatch({
            type: 'USERS_PER_PAGE',
            payload: checkCookies('usersPerPage', ctx)
              ? parseInt(getCookies(ctx).usersPerPage)
              : 50,
          })),
          ...(await store.dispatch({
            type: 'USERS_PAGE_NUMBER',
            payload: checkCookies('usersPageNumber', ctx)
              ? parseInt(getCookies(ctx).usersPageNumber)
              : 1,
          })),
          ...(await store.dispatch({
            type: 'USERS_CARD_VIEW',
            payload: checkCookies('usersCardView', ctx)
              ? JSON.parse(getCookies(ctx).usersCardView)
              : true,
          })),
          ...(await store.dispatch({
            type: 'USERS_SORT_BY',
            payload: checkCookies('usersSortBy', ctx)
              ? JSON.parse(getCookies(ctx).usersSortBy)
              : {
                  field: 'createdAt',
                  sorting: -1,
                },
          })),
        },
      };
    } else {
      return {
        props: {
          adminAccessToken: null,
          ...(await store.dispatch({
            type: 'ADMIN_ACCESS_TOKEN',
            payload: null,
          })),
          ...(await store.dispatch({
            type: 'ADMIN_THEMETYPE',
            payload: checkCookies('adminThemeType', ctx)
              ? getCookies(ctx).adminThemeType
              : 'light',
          })),
          ...(await store.dispatch({
            type: 'USERS_PER_PAGE',
            payload: checkCookies('usersPerPage', ctx)
              ? parseInt(getCookies(ctx).usersPerPage)
              : 50,
          })),
          ...(await store.dispatch({
            type: 'USERS_PAGE_NUMBER',
            payload: checkCookies('usersPageNumber', ctx)
              ? parseInt(getCookies(ctx).usersPageNumber)
              : 1,
          })),
          ...(await store.dispatch({
            type: 'USERS_CARD_VIEW',
            payload: checkCookies('usersCardView', ctx)
              ? JSON.parse(getCookies(ctx).usersCardView)
              : true,
          })),
          ...(await store.dispatch({
            type: 'USERS_SORT_BY',
            payload: checkCookies('usersSortBy', ctx)
              ? JSON.parse(getCookies(ctx).usersSortBy)
              : {
                  field: 'createdAt',
                  sorting: -1,
                },
          })),
        },
        redirect: {
          permanent: false,
          source: '/admin',
          destination: '/',
        },
      };
    }

    // if (ctx.req.rawHeaders.includes('x-forwarded-host')) {
    //   if (
    //     checkCookies('adminAccessToken', ctx) &&
    //     checkCookies('accessToken', ctx) &&
    //     checkCookies('accessToken', ctx) ===
    //       checkCookies('adminAccessToken', ctx)
    //   ) {
    //     return {
    //       props: {
    //         adminAccessToken: getCookies(ctx).adminAccessToken,
    //         ...(await store.dispatch({
    //           type: 'ADMIN_ACCESS_TOKEN',
    //           payload: getCookies(ctx).adminAccessToken,
    //         })),
    //       },
    //     };
    //   } else {
    //     return {
    //       props: {
    //         adminAccessToken: null,
    //         ...(await store.dispatch({
    //           type: 'ADMIN_ACCESS_TOKEN',
    //           payload: null,
    //         })),
    //       },
    //       redirect: {
    //         permanent: false,
    //         source: '/admin',
    //         destination: '/',
    //       },
    //     };
    //   }
    // } else {
    //   if (checkCookies('adminAccessToken', ctx)) {
    //     return {
    //       props: {
    //         adminAccessToken: getCookies(ctx).adminAccessToken,
    //         ...(await store.dispatch({
    //           type: 'ADMIN_ACCESS_TOKEN',
    //           payload: getCookies(ctx).adminAccessToken,
    //         })),
    //       },
    //     };
    //   } else {
    //     return {
    //       props: {
    //         adminAccessToken: null,
    //         ...(await store.dispatch({
    //           type: 'ADMIN_ACCESS_TOKEN',
    //           payload: null,
    //         })),
    //       },
    //       redirect: {
    //         permanent: false,
    //         source: '/admin',
    //         destination: '/',
    //       },
    //     };
    //   }
    // }
  }
);
