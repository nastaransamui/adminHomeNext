import { Fragment, useEffect } from 'react';
import { wrapper } from '../src/redux/store';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import HeadComponent from '../src/components/head';
import Mainlayout from '../src/pages/MainLayout';
import { getCookies, checkCookies } from 'cookies-next';
import Error from '../src/components/Error/Error';
import brand from '../public/text/brand';
import { useSelector, useDispatch } from 'react-redux';

function Custom404(props) {
  const { t, ready } = useTranslation('404');
  const dispatch = useDispatch();
  const errorCode = props.router.route.substring(1);

  useEffect(() => {
    let isMount = true;
    if (isMount) {
      if (getCookies().themeType !== undefined) {
        dispatch({ type: 'THEMETYPE', payload: getCookies().themeType });
      }
      if (getCookies().themeName !== undefined) {
        dispatch({ type: 'THEMENAME', payload: getCookies().themeName });
      }
      if (getCookies().accessToken) {
        dispatch({ type: 'ACCESS_TOKEN', payload: getCookies().accessToken });
      }
    }
    return () => {
      isMount = false;
    };
  }, []);

  return (
    <Fragment>
      <HeadComponent title={ready && t('title')} />
      <Mainlayout {...props}>
        <Error
          errorCode={errorCode}
          text={ready && t('title')}
          t={t}
          {...props}
        />
      </Mainlayout>
    </Fragment>
  );
}

export const getStaticProps = wrapper.getStaticProps((store) => async (ctx) => {
  const { router, locale } = ctx;

  return {
    props: {
      session: null,
      ...(await serverSideTranslations(locale, ['common', 'home', '404'])),
      locale: locale,
    },
  };
});

export default Custom404;
