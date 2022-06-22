import { PropTypes } from 'prop-types';
import { useEffect, useState } from 'react';

// Translation
import { I18nextProvider, initReactI18next } from 'react-i18next';
import common_en from '../public/locales/en/common.json';
import common_fa from '../public/locales/fa/common.json';
import dashboard_en from '../public/locales/en/dashboard.json';
import dashboard_fa from '../public/locales/fa/dashboard.json';
import footer_en from '../public/locales/en/footer.json';
import footer_fa from '../public/locales/fa/footer.json';
import users_en from '../public/locales/en/users.json';
import users_fa from '../public/locales/fa/users.json';
import roles_en from '../public/locales/en/roles.json';
import roles_fa from '../public/locales/fa/roles.json';
import video_en from '../public/locales/en/video.json';
import video_fa from '../public/locales/fa/video.json';
import photos_en from '../public/locales/en/photos.json';
import photos_fa from '../public/locales/fa/photos.json';
import feature_en from '../public/locales/en/feature.json';
import feature_fa from '../public/locales/fa/feature.json';
import about_en from '../public/locales/en/about.json';
import about_fa from '../public/locales/fa/about.json';
import geoLocations_en from '../public/locales/en/geoLocations.json';
import geoLocations_fa from '../public/locales/fa/geoLocations.json';
import error_en from '../public/locales/en/404.json';
import error_fa from '../public/locales/fa/404.json';
import dataGridLocale_en from '../public/locales/en/dataGridLocale.json';
import dataGridLocale_fa from '../public/locales/fa/dataGridLocale.json';
import exchange_en from '../public/locales/en/exchange.json';
import exchange_fa from '../public/locales/fa/exchange.json';
import agencies_en from '../public/locales/en/agencies.json';
import agencies_fa from '../public/locales/fa/agencies.json';
import i18next from 'i18next';
import 'video-react/dist/video-react.css';
import { withTranslation, useTranslation } from 'react-i18next';
import detector from 'i18next-browser-languagedetector';

//Redux
import { wrapper } from '../src/redux/store';
import { useSelector, useDispatch } from 'react-redux';

//Styles
import '../styles/globals.css';
import '../styles/top-loading-bar.css';
import '../styles/nextjs-material-dashboard-pro.css';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/bouncyflip.css';
import 'animate.css';
import 'perfect-scrollbar/css/perfect-scrollbar.css';
import 'react-phone-input-material-ui/lib/style.css';

//Theme
import { ThemeProvider } from '@mui/material/styles';
import { StylesProvider, jssPreset } from '@mui/styles';
import { create } from 'jss';
import CssBaseline from '@mui/material/CssBaseline';
import rtl from 'jss-rtl';
import LoadingBar from 'react-top-loading-bar';
import appTheme from '../theme/appTheme';

//next
import Head from 'next/head';
import Router from 'next/router';
import { CacheProvider } from '@emotion/react';
import createEmotionCache from '../src/createEmotionCache';

import { checkCookies, getCookies } from 'cookies-next';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();
i18next
  .use(detector)
  .use(initReactI18next)
  .init({
    interpolation: { scapeValue: false },
    returnObjects: true,
    lng: checkCookies('i18nextLng') ? getCookies().i18nextLng : 'en-US',
    fallbackLng: 'en-US',
    keySeparator: false,
    defaultNS: 'common',
    resources: {
      en: {
        common: common_en,
        dashboard: dashboard_en,
        404: error_en,
        footer: footer_en,
        users: users_en,
        roles: roles_en,
        video: video_en,
        feature: feature_en,
        photos: photos_en,
        about: about_en,
        geoLocations: geoLocations_en,
        dataGridLocale: dataGridLocale_en,
        exchange: exchange_en,
        agencies: agencies_en,
      },
      fa: {
        common: common_fa,
        dashboard: dashboard_fa,
        404: error_fa,
        footer: footer_fa,
        users: users_fa,
        roles: roles_fa,
        video: video_fa,
        feature: feature_fa,
        about: about_fa,
        photos: photos_fa,
        geoLocations: geoLocations_fa,
        dataGridLocale: dataGridLocale_fa,
        exchange: exchange_fa,
        agencies: agencies_fa,
      },
    },
  });

const isVercel = process.env.NEXT_PUBLIC_SERVERLESS;
function MyApp(props) {
  const {
    Component,
    router,
    emotionCache = clientSideEmotionCache,
    pageProps: { session, ...pageProps },
  } = props;
  const { t, i18n } = useTranslation('common');
  const { adminThemeName, adminThemeType, adminLoadingBar } = useSelector(
    (state) => state
  );
  const dispatch = useDispatch();

  const [adminTheme, setAdminTheme] = useState({
    ...appTheme(
      adminThemeName,
      adminThemeType,
      i18n.language.startsWith('fa') ? 'rtl' : 'ltr'
    ),
    direction: i18n.language.startsWith('fa') ? 'rtl' : 'ltr',
  });

  useEffect(() => {
    // Remove preloader or show javascript disabled warning
    const preloader = document.getElementById('preloader');
    if (preloader !== null || undefined) {
      preloader.remove();
    }

    // Remove loading bar
    dispatch({
      type: 'ADMIN_LOADINGBAR',
      payload: 100,
    });

    // Refresh JSS in SSR
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentNode.removeChild(jssStyles);
    }

    if (!navigator.cookieEnabled) {
      let cookiesAlert = 'Please allow cookies';
      if (navigator?.language.substring(0, 2) == 'fa') {
        cookiesAlert = 'لطفا کوکی ها را مجاز کنید';
      }
      if (confirm(cookiesAlert)) {
        if (!navigator.cookieEnabled) {
          document.body.style.display = 'none';
        } else {
          location.reload();
        }
      } else {
        document.body.style.display = 'none';
      }
    } else {
      if (window.localStorage === undefined) {
        let localStorageAlert =
          'Your browser is outdated and not support localStorage!';
        if (navigator?.language.substring(0, 2) == 'cn') {
          localStorageAlert =
            'مرورگر شما قدیمی است و از localStorage پشتیبانی نمی کند!';
        }
        alert(localStorageAlert);
      } else {
        // localStorage.setItem('i18nextLng', navigator?.language);
      }
    }
  }, []);

  useEffect(() => {
    let isMount = true;
    if (isMount) {
      document.dir = i18n.language === 'fa' ? 'rtl' : 'ltr';
      dispatch({
        type: 'ADMIN_THEMENAME',
        payload: localStorage.getItem('adminThemeName') || adminThemeName,
      });
      dispatch({
        type: 'ADMIN_THEMETYPE',
        payload: localStorage.getItem('adminThemeType') || adminThemeType,
      });
      setAdminTheme({
        ...appTheme(
          (typeof window !== 'undefined' &&
            localStorage.getItem('adminThemeName')) ||
            adminThemeName,
          (typeof window !== 'undefined' &&
            localStorage.getItem('adminThemeType')) ||
            adminThemeType,
          i18n.language === 'fa' ? 'rtl' : 'ltr'
        ),
        direction: i18n.language.startsWith('fa') ? 'rtl' : 'ltr',
      });
    }
    return () => {
      isMount = false;
    };
  }, [adminThemeType, adminThemeName, i18n.language]);

  const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name='viewport' content='initial-scale=1, width=device-width' />
      </Head>
      <ThemeProvider theme={adminTheme}>
        <StylesProvider jss={jss}>
          <I18nextProvider i18n={i18next}>
            <CssBaseline />
            <LoadingBar
              height={5}
              color={adminTheme.palette.primary.light}
              progress={adminLoadingBar}
              className='top-loading-bar'
            />
            <div suppressHydrationWarning>
              {typeof window === 'undefined' ? null : (
                <Component
                  router={router}
                  {...pageProps}
                  key={router.route}
                  t={t}
                  i18n={i18n}
                  isVercel={isVercel}
                />
              )}
            </div>
          </I18nextProvider>
        </StylesProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};

export default wrapper.withRedux(withTranslation('common')(MyApp));
