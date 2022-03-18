import mainStyles from './main-style';
import { useTranslation } from 'react-i18next';

import FirstRow from './FirstRow';
import SecondRow from './SecondRow';
import ThirdRow from './ThirdRow';
import ForthRow from './ForthRow';

export const tableValuesLocaleConvert = (value, rtlActive) => {
  if (rtlActive) {
    return value.replace(/[0-9]/g, (c) =>
      String.fromCharCode(c.charCodeAt(0) + 1728)
    );
  }
  return value;
};

const MainDashboard = (props) => {
  const classes = mainStyles();
  const { t, i18n } = useTranslation('dashboard');
  const rtlActive = i18n.language == 'fa';
  const showLang = i18n.language == 'en' ? 'en-US' : i18n.language;

  return (
    <div className={classes.MainDashboard}>
      <FirstRow rtlActive={rtlActive} showLang={showLang} />
      <SecondRow rtlActive={rtlActive} showLang={showLang} t={t} />
      <ThirdRow rtlActive={rtlActive} t={t} />
      <ForthRow rtlActive={rtlActive} showLang={showLang}  t={t} />
    </div>
  );
};

export default MainDashboard;
