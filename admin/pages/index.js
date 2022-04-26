import HeadComponent from '../src/components/head';
import Login from '../src/pages/login/Login';
import { wrapper } from '../src/redux/store';
import { withTranslation, useTranslation } from 'react-i18next';
import { checkCookies, getCookies } from 'cookies-next';
import { Fragment } from 'react';
import Cookies from 'cookies';
import { Users } from '../src/components/Users/usersStatic';
import { sliderImage } from '../src/components/mainPageSetup/Photos/photosStatic';
import { sliderVideo } from '../src/components/mainPageSetup/Videos/videosStatic';

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
            type: 'USERS',
            payload: checkCookies('users', ctx)
              ? JSON.parse(getCookies(ctx).users)
              : { ...Users },
          })),
          ...(await store.dispatch({
            type: 'SLIDER_IMAGE',
            payload: checkCookies('sliderImage', ctx)
              ? JSON.parse(getCookies(ctx).sliderImage)
              : { ...sliderImage },
          })),
          ...(await store.dispatch({
            type: 'SLIDER_VIDEO',
            payload: checkCookies('sliderVideo', ctx)
              ? JSON.parse(getCookies(ctx).sliderVideo)
              : { ...sliderVideo },
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
