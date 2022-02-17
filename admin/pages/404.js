import HeadComponent from '../src/components/head';
import { wrapper } from '../src/redux/store';
import { Fragment } from 'react';
import ErrorPage from '../src/pages/ErrorPage';
import { withTranslation, useTranslation } from 'react-i18next';

function Custom404(props) {
  const { t, ready, i18n } = useTranslation('404');
  const errorCode = props.router.route.substring(1);
  return (
    <Fragment>
      <HeadComponent title={ready && t('title')} />
      <ErrorPage
        {...props}
        t={t}
        i18n={i18n}
        errorCode={errorCode}
        text={ready && t('title')}
      />
    </Fragment>
  );
}

export default withTranslation('404')(Custom404);

export const getStaticProps = wrapper.getStaticProps((store) => async (ctx) => {
  return {
    props: {
      adminAccessToken: null,
    },
  };
});
