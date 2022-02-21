import { checkCookies, getCookies } from 'cookies-next';
import { wrapper } from '../../src/redux/store';
import { withTranslation, useTranslation } from 'react-i18next';
import { Fragment, useEffect } from 'react';
import HeadComponent from '../../src/components/head';
import Dashboard from '../../src/pages/dashboard/Dashboard';
import Cookies from 'cookies';
import ReactDOM from 'react-dom';
import Loading from '../../src/components/Loading/Loading';
function index(props) {
  const { t, ready, i18n } = useTranslation('dashboard');
  const { router } = props;
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

  const { router } = props;
  useEffect(() => {
    let isMount = true;
    if (isMount && typeof window !== 'undefined') {
      document.body.classList.add('body-page-transition');
      ReactDOM.render(<Loading />, document.getElementById('page-transition'));
      //
      if (!localStorage.getItem('adminAccessToken')) {
        // Not login yet
        router.push('/');
      } else {
        ReactDOM.unmountComponentAtNode(
          document.getElementById('page-transition')
        );
        document.body.classList.remove('body-page-transition');
      }
    }
  }, []);
  return (
    <Fragment>
      <HeadComponent title={ready && t('title')} />
      <Dashboard {...props} i18n={i18n} />
    </Fragment>
  );
}

export default withTranslation(['dashboard'])(index);

// export const getServerSideProps = wrapper.getServerSideProps(
//   (store) => async (ctx) => {
//     // Request come from Home page
//     const cookies = new Cookies(ctx.req, ctx.res);
//     if (checkCookies('adminAccessToken', ctx)) {
//       return {
//         props: {
//           adminAccessToken: getCookies(ctx).adminAccessToken,
//           ...(await store.dispatch({
//             type: 'ADMIN_ACCESS_TOKEN',
//             payload: getCookies(ctx).adminAccessToken,
//           })),
//         },
//       };
//     } else {
//       return {
//         props: {
//           adminAccessToken: null,
//           ...(await store.dispatch({
//             type: 'ADMIN_ACCESS_TOKEN',
//             payload: null,
//           })),
//         },
//         redirect: {
//           permanent: false,
//           source: '/admin',
//           destination: '/',
//         },
//       };
//     }
//     // if (ctx.req.rawHeaders.includes('x-forwarded-host')) {
//     //   if (
//     //     checkCookies('adminAccessToken', ctx) &&
//     //     checkCookies('accessToken', ctx) &&
//     //     checkCookies('accessToken', ctx) ===
//     //       checkCookies('adminAccessToken', ctx)
//     //   ) {
//     //     return {
//     //       props: {
//     //         adminAccessToken: getCookies(ctx).adminAccessToken,
//     //         ...(await store.dispatch({
//     //           type: 'ADMIN_ACCESS_TOKEN',
//     //           payload: getCookies(ctx).adminAccessToken,
//     //         })),
//     //       },
//     //     };
//     //   } else {
//     //     return {
//     //       props: {
//     //         adminAccessToken: null,
//     //         ...(await store.dispatch({
//     //           type: 'ADMIN_ACCESS_TOKEN',
//     //           payload: null,
//     //         })),
//     //       },
//     //       redirect: {
//     //         permanent: false,
//     //         source: '/admin',
//     //         destination: '/',
//     //       },
//     //     };
//     //   }
//     // } else {
//     //   if (checkCookies('adminAccessToken', ctx)) {
//     //     return {
//     //       props: {
//     //         adminAccessToken: getCookies(ctx).adminAccessToken,
//     //         ...(await store.dispatch({
//     //           type: 'ADMIN_ACCESS_TOKEN',
//     //           payload: getCookies(ctx).adminAccessToken,
//     //         })),
//     //       },
//     //     };
//     //   } else {
//     //     return {
//     //       props: {
//     //         adminAccessToken: null,
//     //         ...(await store.dispatch({
//     //           type: 'ADMIN_ACCESS_TOKEN',
//     //           payload: null,
//     //         })),
//     //       },
//     //       redirect: {
//     //         permanent: false,
//     //         source: '/admin',
//     //         destination: '/',
//     //       },
//     //     };
//     //   }
//     // }
//   }
// );
