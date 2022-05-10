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
import { Users } from '../../src/components/Users/usersStatic';
import { sliderImage } from '../../src/components/mainPageSetup/Photos/photosStatic';
import { sliderVideo } from '../../src/components/mainPageSetup/Videos/videosStatic';
import { Features } from '../../src/components/mainPageSetup/Features/featuresStatic';
import {
  countriesGStore,
  countriesAStore,
} from '../../src/components/geoLocations/Countries/countriesStatic';
import { provincesStore } from '../../src/components/geoLocations/Provinces/provincesStatic';
import { citiesStore } from '../../src/components/geoLocations/Cities/citiesStatic';

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
          ...(await store.dispatch({
            type: 'FEATURES',
            payload: checkCookies('features', ctx)
              ? JSON.parse(getCookies(ctx).features)
              : { ...Features },
          })),
          ...(await store.dispatch({
            type: 'COUNTRIES_G_STORE',
            payload: checkCookies('countriesGStore', ctx)
              ? JSON.parse(getCookies(ctx).countriesGStore)
              : { ...countriesGStore },
          })),
          ...(await store.dispatch({
            type: 'COUNTRIES_A_STORE',
            payload: checkCookies('countriesAStore', ctx)
              ? JSON.parse(getCookies(ctx).countriesAStore)
              : { ...countriesAStore },
          })),
          ...(await store.dispatch({
            type: 'PROVINCES_STORE',
            payload: checkCookies('provincesStore', ctx)
              ? JSON.parse(getCookies(ctx).provincesStore)
              : { ...provincesStore },
          })),
          ...(await store.dispatch({
            type: 'CITIES_STORE',
            payload: checkCookies('citiesStore', ctx)
              ? JSON.parse(getCookies(ctx).citiesStore)
              : { ...citiesStore },
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
