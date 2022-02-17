import PropTypes from 'prop-types';
import Error from '../components/Error/Error';

const ErrorPage = (props) => {
  const { t, router, i18n,errorCode } = props;
  return (
    <Error
      {...props}
      t={t}
      i18n={i18n}
      errorCode={errorCode}
      text={ t('title')}
      type="next"
    />
  );
};

ErrorPage.propTypes = {
  t: PropTypes.func.isRequired,
  router: PropTypes.object.isRequired,
  i18n: PropTypes.object.isRequired,
};

export default ErrorPage;
