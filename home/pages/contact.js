import { Fragment } from 'react';
import { checkCookies, getCookies } from 'cookies-next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { wrapper } from '../src/redux/store';
import HeadComponent from '../src/components/head';
import brand from '../public/text/brand';
import Contactpage from '../src/pages/contact/Contactpage';
// import { useTranslation } from "next-i18next";
function Contact(props) {
  const { router } = props;
  const { locale } = router;

  return (
    <Fragment>
      <HeadComponent title={brand[`contactUs_${locale}`]} />
      <Contactpage {...props} />
    </Fragment>
  );
}
export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
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
        ...(await serverSideTranslations(ctx.locale, ['contact'])),
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
export default Contact;
