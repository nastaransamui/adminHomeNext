import HeadComponent from '../src/components/head';
import Login from '../src/pages/login/Login';
import { wrapper } from '../src/redux/store';
import { withTranslation, useTranslation } from 'react-i18next';
import { checkCookies, getCookies } from 'cookies-next';
import { Fragment } from 'react';

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

// export const getServerSideProps = wrapper.getServerSideProps(
//   (store) => async (ctx) => {
//     // Request come from Home page
//     if (ctx.req.rawHeaders.includes('x-forwarded-host')) {
//       if (
//         checkCookies('adminAccessToken', ctx) &&
//         checkCookies('accessToken', ctx) &&
//         checkCookies('accessToken', ctx) ===
//           checkCookies('adminAccessToken', ctx)
//       ) {
//         return {
//           props: {
//             adminAccessToken: getCookies(ctx).adminAccessToken,
//             ...(await store.dispatch({
//               type: 'ADMIN_ACCESS_TOKEN',
//               payload: getCookies(ctx).adminAccessToken,
//             })),
//           },
//           redirect: {
//             permanent: false,
//             source: '/',
//             destination: '/dashboard',
//           },
//         };
//       } else {
//         return {
//           props: {
//             adminAccessToken: null,
//             ...(await store.dispatch({
//               type: 'ADMIN_ACCESS_TOKEN',
//               payload: null,
//             })),
//           },
//         };
//       }
//     } else {
//       if (checkCookies('adminAccessToken', ctx)) {
//         return {
//           props: {
//             adminAccessToken: getCookies(ctx).adminAccessToken,
//             ...(await store.dispatch({
//               type: 'ADMIN_ACCESS_TOKEN',
//               payload: getCookies(ctx).adminAccessToken,
//             })),
//           },
//           redirect: {
//             permanent: false,
//             source: '/',
//             destination: '/dashboard',
//           },
//         };
//       } else {
//         return {
//           props: {
//             adminAccessToken: null,
//             ...(await store.dispatch({
//               type: 'ADMIN_ACCESS_TOKEN',
//               payload: null,
//             })),
//           },
//         };
//       }
//     }
//   }
// );
