import HeadComponent from '../src/components/head';
import Login from '../src/pages/login/Login';
import { wrapper } from '../src/redux/store';
import { withTranslation, useTranslation } from 'react-i18next';
import { checkCookies, getCookies } from 'cookies-next';
import { Fragment } from 'react';
import Cookies from 'cookies';
function Admin(props) {
  const { t, ready, i18n } = useTranslation('common');
  return (
    <Fragment>
      <HeadComponent title={ready && t('title_login')} />
      <Login t={t} i18n={i18n} {...props} />
    </Fragment>
  );
}

export default withTranslation(['common'])(Admin);

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    const cookies = new Cookies(ctx.req, ctx.res);
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
            type: 'USERS_PER_PAGE',
            payload: checkCookies('usersPerPage', ctx)
              ? parseInt(getCookies(ctx).usersPerPage)
              : 48,
          })),
          ...(await store.dispatch({
            type: 'USERS_CARD_VIEW',
            payload: checkCookies('usersCardView', ctx)
              ? JSON.parse(getCookies(ctx).usersCardView)
              : true,
          })),
          ...(await store.dispatch({
            type: 'VIDEOS_CARD_VIEW',
            payload: checkCookies('videosCardView', ctx)
              ? JSON.parse(getCookies(ctx).videosCardView)
              : true,
          })),
        },
        redirect: {
          permanent: false,
          source: '/',
          destination: '/dashboard',
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
              : 48,
          })),
          ...(await store.dispatch({
            type: 'USERS_CARD_VIEW',
            payload: checkCookies('usersCardView', ctx)
              ? JSON.parse(getCookies(ctx).usersCardView)
              : true,
          })),
          ...(await store.dispatch({
            type: 'VIDEOS_CARD_VIEW',
            payload: checkCookies('videosCardView', ctx)
              ? JSON.parse(getCookies(ctx).videosCardView)
              : true,
          })),
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
    //       redirect: {
    //         permanent: false,
    //         source: '/',
    //         destination: '/dashboard',
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
    //       redirect: {
    //         permanent: false,
    //         source: '/',
    //         destination: '/dashboard',
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
    //     };
    //   }
    // }
  }
);
