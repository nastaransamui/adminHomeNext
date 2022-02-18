import { Fragment } from 'react';
import { checkCookies, getCookies } from 'cookies-next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { wrapper } from '../src/redux/store';
import HeadComponent from '../src/components/head';
import brand from '../public/text/brand';
import AuthPage from '../src/pages/auth/AuthPage';
import { useTranslation } from 'next-i18next';

function Register(props) {
  const { router } = props;
  const { locale } = router;
  const { t } = useTranslation('auth');
  return (
    <Fragment>
      <HeadComponent title={t('title_register')} />
      <AuthPage {...props} />
    </Fragment>
  );
}
export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    const { locale } = ctx;
    if (checkCookies('accessToken', ctx)) {
      return {
        props: {
          accessToken: getCookies(ctx).accessToken,
          ...(await store.dispatch({
            type: 'ACCESS_TOKEN',
            payload: getCookies(ctx).accessToken,
          })),
          ...(await serverSideTranslations(locale, ['auth'])),
          ...(checkCookies('themeName', ctx) &&
            (await store.dispatch({
              type: 'THEMENAME',
              payload: getCookies(ctx).themeName,
            }))),
          ...(checkCookies('themeType', ctx) &&
            (await store.dispatch({
              type: 'THEMETYPE',
              payload: getCookies(ctx).themeType,
            }))),
        },
        redirect: {
          permanent: false,
          source: `${locale}/register`,
          destination: `/${locale}`,
        },
      };
    } else {
      return {
        props: {
          accessToken: null,
          ...(await store.dispatch({ type: 'ACCESS_TOKEN', payload: null })),
          ...(await serverSideTranslations(locale, ['auth'])),
          ...(checkCookies('themeName', ctx) &&
            (await store.dispatch({
              type: 'THEMENAME',
              payload: getCookies(ctx).themeName,
            }))),
          ...(checkCookies('themeType', ctx) &&
            (await store.dispatch({
              type: 'THEMETYPE',
              payload: getCookies(ctx).themeType,
            }))),
        },
      };
    }
  }
);
export default Register;
