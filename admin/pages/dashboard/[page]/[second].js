import { Fragment, useEffect } from 'react';
import { checkCookies, getCookies, removeCookies } from 'cookies-next';
import { wrapper } from '../../../src/redux/store';
import { withTranslation, useTranslation } from 'react-i18next';

import HeadComponent from '../../../src/components/head';
import Dashboard from '../../../src/pages/dashboard/Dashboard';
import Cookies from 'cookies';
import { useRouter } from 'next/router';
import Alert from 'react-s-alert';
import CustomAlert from '../../../src/components/Alert/CustomAlert';
import jwt from 'jsonwebtoken';
import { Users } from '../../../src/components/Users/usersStatic';
import { sliderImage } from '../../../src/components/mainPageSetup/Photos/photosStatic';
import { sliderVideo } from '../../../src/components/mainPageSetup/Videos/videosStatic';
import { Features } from '../../../src/components/mainPageSetup/Features/featuresStatic';
import {
  countriesAStore,
  countriesGStore,
} from '../../../src/components/geoLocations/Countries/countriesStatic';
import { provincesStore } from '../../../src/components/geoLocations/Provinces/provincesStatic';
import { citiesStore } from '../../../src/components/geoLocations/Cities/citiesStatic';
import {
  currenciesGStore,
  currenciesAStore,
} from '../../../src/components/exchange/Currencies/currenciesStatic';
import { Agencies } from '../../../src/components/Clients/Agencies/agenciesStatic';
import { hotelsGStore } from '../../../src/components/Accommodations/All/Hotels/hotelsStatic';
import { Roles } from '../../../src/components/Rbac/Roles/rolesStatic';
import { Hotels } from '../../../src/components/Accommodations/Actives/Hotels/activeHotelsStatic';
import routes from '../../../routes';

function index(props) {
  const { t, ready, i18n } = useTranslation('dashboard');
  const accessRole = jwt.verify(
    localStorage.getItem('accessRole'),
    process.env.NEXT_PUBLIC_SECRET_KEY,
    (err, routes) => {
      if (!err) {
        return routes;
      } else {
        removeCookies('adminAccessToken', ctx);
      }
    }
  );
  const router = useRouter();
  // Rplace next router with current react router
  useEffect(() => {
    let isMount = true;
    if (isMount) {
      router.asPath = location.pathname;
    }
    return () => {
      isMount = false;
    };
  }, [router]);
  var copyRoutes = JSON.parse(JSON.stringify(routes));

  //Iritate in all routes
  let allRoutes = [];
  copyRoutes.map(function iter(a) {
    allRoutes.push(a);
    Array.isArray(a.views) && a.views.map(iter);
  });
  //iritate in all access role
  let allAccess = [];
  accessRole?.routes.map(function iter(a) {
    allAccess.push(a);
    Array.isArray(a.views) && a.views.map(iter);
  });
  //Add crud from accessrole to routes
  allRoutes.map((r) => {
    r.crud = [];
    allAccess.map((a) => {
      if (r['name_en-US'] === a['name_en-US']) {
        r.crud.push(...a.crud);
      }
    });
  });

  let reactRoutes = [];
  accessRole?.routes.map(function iter(a) {
    a.path =
      a.path !== undefined && a.path.startsWith('/admin')
        ? a.path
        : `/admin${a.path}`;
    const lastPartOfPath = a.path.substring(a.path.lastIndexOf('/') + 1);
    const pathArray = a.path.split('/');
    //remove dashboard(/admin/dashboard) and errorpage(/adminundefined)
    const purePathArray = pathArray.slice(3);

    if (purePathArray.length !== 0) {
      switch (lastPartOfPath) {
        case 'user-page':
        case 'rbac-data':
          var index = lastPartOfPath.indexOf('-');
          var n = lastPartOfPath.replace(
            '-',
            lastPartOfPath[index + 1].toUpperCase()
          );
          var d = n.charAt(0).toUpperCase() + n.slice(1);
          var last = d.slice(0, index + 1) + d.slice(index + 2);
          a.componentName = last;
          a.componentView = undefined;
          break;
        case 'currencies':
        case 'countries':
        case 'allhotels':
          if (purePathArray[0].includes('g-')) {
            a.componentView = `global_${lastPartOfPath}`;
            a.componentName =
              lastPartOfPath.charAt(0).toUpperCase() + lastPartOfPath.slice(1);
          }
          if (purePathArray[0].includes('a-')) {
            a.componentView = 'view';
            a.componentName =
              lastPartOfPath.charAt(0).toUpperCase() + lastPartOfPath.slice(1);
          }
          break;
        default:
          // add single page component name
          a.componentName =
            lastPartOfPath.charAt(0).toUpperCase() + lastPartOfPath.slice(1);
          a.componentView = undefined;
          break;
      }
    }

    if (a.views == undefined || a?.views?.length == 0) {
      reactRoutes.push(a);
    }

    Array.isArray(a.views) && a.views.map(iter);
  });

  return (
    <Fragment>
      <Alert contentTemplate={CustomAlert} />
      <HeadComponent title={ready && t('title')} />
      <Dashboard
        routes={routes}
        reactRoutes={reactRoutes}
        accessRole={accessRole?.routes}
        {...props}
        i18n={i18n}
      />
    </Fragment>
  );
}

export default withTranslation(['dashboard'])(index);

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    const cookies = new Cookies(ctx.req, ctx.res);
    const isVercel =
      process.env.NEXT_PUBLIC_SERVERLESS == 'true' ? true : false;
    async function call() {
      await fetch(`${process.env.NEXT_PUBLIC_ADMIN_URL}/api/socket`);
    }
    if (!isVercel) {
      call();
    }
    const profile = jwt.verify(
      getCookies(ctx).adminAccessToken,
      process.env.NEXT_PUBLIC_SECRET_KEY,
      (err, user) => {
        if (!err) {
          return user;
        } else {
          removeCookies('adminAccessToken', ctx);
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
              : 'dark',
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
          ...(await store.dispatch({
            type: 'CURRENCIES_G_STORE',
            payload: checkCookies('currenciesGStore', ctx)
              ? JSON.parse(getCookies(ctx).currenciesGStore)
              : { ...currenciesGStore },
          })),
          ...(await store.dispatch({
            type: 'CURRENCIES_A_STORE',
            payload: checkCookies('currenciesAStore', ctx)
              ? JSON.parse(getCookies(ctx).currenciesAStore)
              : { ...currenciesAStore },
          })),
          ...(await store.dispatch({
            type: 'AGENCIES',
            payload: checkCookies('agencies', ctx)
              ? JSON.parse(getCookies(ctx).agencies)
              : { ...Agencies },
          })),
          ...(await store.dispatch({
            type: 'ROLES',
            payload: checkCookies('roles', ctx)
              ? JSON.parse(getCookies(ctx).roles)
              : { ...Roles },
          })),
          ...(await store.dispatch({
            type: 'HOTELS_G_STORE',
            payload: checkCookies('hotelsGStore', ctx)
              ? JSON.parse(getCookies(ctx).hotelsGStore)
              : { ...hotelsGStore },
          })),
          ...(await store.dispatch({
            type: 'HOTELS',
            payload: checkCookies('hotels', ctx)
              ? JSON.parse(getCookies(ctx).hotels)
              : { ...Hotels },
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
              : 'dark',
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
