import { Fragment, useEffect } from 'react';
import { checkCookies, getCookies } from 'cookies-next';
import { wrapper } from '../../../src/redux/store';
import { withTranslation, useTranslation } from 'react-i18next';

import HeadComponent from '../../../src/components/head';
import Dashboard from '../../../src/pages/dashboard/Dashboard';
import Cookies from 'cookies';
import { useRouter } from 'next/router';
// import dbConnect from '../../../helpers/dbConnect';
import Alert from 'react-s-alert';
import CustomAlert from '../../../src/components/Alert/CustomAlert';
// import { useTheme } from '@mui/material';

function index(props) {
  const { t, ready, i18n } = useTranslation('dashboard');
  // const theme = useTheme();
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

  // const { dbConectSuccess, dbConectError } = props;
  // useEffect(() => {
  //   let isMount = true;
  //   if (isMount && !dbConectSuccess) {
  //     Alert.error('', {
  //       customFields: {
  //         message: `${dbConectError}`,
  //         styles: {
  //           backgroundColor: theme.palette.secondary.dark,
  //           zIndex: 9999,
  //         },
  //       },
  //       onClose: function () {
  //         document.body.innerHTML = '';
  //       },
  //       timeout: 'none',
  //       position: 'bottom',
  //       effect: 'bouncyflip',
  //     });
  //   }
  //   return () => {
  //     isMount = false;
  //   };
  // }, [dbConectSuccess, dbConectError]);

  return (
    <Fragment>
      <Alert contentTemplate={CustomAlert} />
      <HeadComponent title={ready && t('title')} />
      <Dashboard {...props} i18n={i18n} />
    </Fragment>
  );
}

export default withTranslation(['dashboard'])(index);

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    // Request come from Home page
    const cookies = new Cookies(ctx.req, ctx.res);
    // const res = await dbConnect();
    if (checkCookies('adminAccessToken', ctx)) {
      return {
        props: {
          // dbConectSuccess: res.success == undefined ? true : false,
          // dbConectError: res.error == undefined ? null : res.error,
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
        },
      };
    } else {
      return {
        props: {
          // dbConectSuccess: res.success == undefined ? true : false,
          // dbConectError: res.error == undefined ? null : res.error,
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
