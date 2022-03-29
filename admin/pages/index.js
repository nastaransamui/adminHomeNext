import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import HeadComponent from '../src/components/head';
import Login from '../src/pages/login/Login';
import { wrapper } from '../src/redux/store';
import { withTranslation, useTranslation } from 'react-i18next';
import { checkCookies, getCookies } from 'cookies-next';
import { Fragment } from 'react';
import Cookies from 'cookies';
// import dbConnect from '../helpers/dbConnect';
import Alert from 'react-s-alert';
import CustomAlert from '../src/components/Alert/CustomAlert';
import { useTheme } from '@mui/material';

function Admin(props) {
  const { t, ready, i18n } = useTranslation('common');
  // const { dbConectSuccess, dbConectError, isVercel } = props;
  // const theme = useTheme();
  // console.log(props);
  // useEffect(() => {
  //   let isMount = true;
  //   if (isMount && !dbConectSuccess && !isVercel) {
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
  // }, [dbConectSuccess, dbConectError, isVercel]);

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
    const isVercel = process.env.SERVER_TYPE == 'vercel';
    // const res = isVercel ? null : await dbConnect();
    // const { success } = res;
    // console.log(success);
    const cookies = new Cookies(ctx.req, ctx.res);
    if (checkCookies('adminAccessToken', ctx)) {
      return {
        props: {
          // dbConectSuccess: success,
          // dbConectError: res?.error == undefined ? null : res?.error,
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
        redirect: {
          permanent: false,
          source: '/',
          destination: '/dashboard',
        },
      };
    } else {
      return {
        props: {
          // dbConectSuccess: success,
          // dbConectError: res?.error == undefined ? null : res?.error,
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
