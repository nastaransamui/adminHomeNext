import { checkCookies, getCookies } from 'cookies-next';
import { wrapper } from '../../src/redux/store';
import { withTranslation, useTranslation } from 'react-i18next';
import { Fragment } from 'react';
import HeadComponent from '../../src/components/head';
import Dashboard from '../../src/pages/dashboard/Dashboard';
import Cookies from 'cookies';
function index(props) {
  const { t, ready, i18n } = useTranslation('dashboard');

  return (
    <Fragment>
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

    if (ctx.req.rawHeaders.includes('x-forwarded-host')) {
      if (
        checkCookies('adminAccessToken', ctx) &&
        checkCookies('accessToken', ctx) &&
        checkCookies('accessToken', ctx) ===
          checkCookies('adminAccessToken', ctx)
      ) {
        return {
          props: {
            adminAccessToken: getCookies(ctx).adminAccessToken,
            ...(await store.dispatch({
              type: 'ADMIN_ACCESS_TOKEN',
              payload: getCookies(ctx).adminAccessToken,
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
          },
          redirect: {
            permanent: false,
            source: '/admin',
            destination: '/',
          },
        };
      }
    } else {
      if (checkCookies('adminAccessToken', ctx)) {
        return {
          props: {
            adminAccessToken: getCookies(ctx).adminAccessToken,
            ...(await store.dispatch({
              type: 'ADMIN_ACCESS_TOKEN',
              payload: getCookies(ctx).adminAccessToken,
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
          },
          redirect: {
            permanent: false,
            source: '/admin',
            destination: '/',
          },
        };
      }
    }
  }
);
