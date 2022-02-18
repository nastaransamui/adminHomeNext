import { Fragment } from 'react';
import { checkCookies, getCookies } from 'cookies-next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { wrapper } from '../src/redux/store';
import HeadComponent from '../src/components/head';
import Mainlayout from '../src/pages/MainLayout';
import brand from '../public/text/brand';
import Homepage from '../src/pages/home/HomePage';
import Link from 'next/link';

function Home(props) {
  const { router } = props;
  const { locale } = router;
  return (
    <Fragment>
      <HeadComponent title={brand[`name_${locale}`]} />
      <Mainlayout {...props}>
        <Homepage {...props} />
      </Mainlayout>
    </Fragment>
  );
}

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    const { locale } = ctx;
    return {
      props: {
        accessToken: checkCookies('accessToken', ctx)
          ? getCookies(ctx).accessToken
          : null,
        ...(await store.dispatch({
          type: 'ACCESS_TOKEN',
          payload: checkCookies('accessToken', ctx)
            ? getCookies(ctx).accessToken
            : null,
        })),
        ...(await serverSideTranslations(locale, ['common', 'home', '404'])),
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
);
export default Home;
