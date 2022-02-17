
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Error from "../../components/Error/Error";

const NotFound = (props) => {
  const { t } = useTranslation("404");
  const {i18n} = props;
  return (
    <Error
      {...props}
      t={t}
      i18n={i18n}
      errorCode={404}
      text={ t('title')}
      type="react"
    />
  );
};

export default NotFound;
