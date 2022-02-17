//Main dependencies
import { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

//Styles
import '../styles/globals.css';
import '../styles/top-loading-bar.css';
import '../styles/page-transition.css';
import '../styles/hamburger-menu.css';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/bouncyflip.css';
import 'video-react/dist/video-react.css';
import '../node_modules/react-animated-slider/build/horizontal.css';
import '../node_modules/animate.css/animate.min.css';
import '../styles/slick/slick.css';
import '../styles/slick/slick-theme.css';
import '../styles/animate-slider.css';
import '../styles/animate-extends.css';
import '../styles/animate-slider-extends.css';

// Theme and jss
import appTheme from '../theme/appTheme';
import { ThemeProvider } from '@mui/material/styles';
import { StylesProvider, jssPreset } from '@mui/styles';
import { create } from 'jss';
import CssBaseline from '@mui/material/CssBaseline';
import rtl from 'jss-rtl';
import LoadingBar from 'react-top-loading-bar';

//Translation
import { appWithTranslation } from 'next-i18next';
import i18next from 'i18next';
import { useTranslation } from 'next-i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';

//Redux
import { wrapper } from '../src/redux/store';
import { useSelector, useDispatch } from 'react-redux';

//Next
import Head from 'next/head';
import { setCookies } from 'cookies-next';
import Router from 'next/router';
import { PageTransition } from 'next-page-transitions';

i18next.use(initReactI18next);

function MyApp(props) {
  const {
    Component,
    router,
    pageProps: { session, ...pageProps },
  } = props;

  const { t, i18n } = useTranslation('common');
  const { themeType, themeName, loadingBar } = useSelector((state) => state);
  const dispatch = useDispatch();

  const [theme, setTheme] = useState({
    ...appTheme(themeName, themeType, i18n.language === 'fa' ? 'rtl' : 'ltr'),
    direction: i18n.language === 'fa' ? 'rtl' : 'ltr',
  });

  useEffect(() => {
    let isMount = true;
    if (isMount) {
      // Set layout direction
      document.dir = i18n.language === 'fa' ? 'rtl' : 'ltr';
      setCookies('lang', router.locale);
      // Remove preloader
      const preloader = document.getElementById('preloader');
      if (preloader !== null || undefined) {
        preloader.remove();
      }

      // Remove loading bar
      dispatch({
        type: 'LOADINGBAR',
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
    }
    return () => {
      isMount = false;
    };
  }, [i18n.language]);

  useEffect(() => {
    let isMount = true;
    if (isMount) {
      setTheme({
        ...appTheme(
          (typeof window !== 'undefined' &&
            localStorage.getItem('themeName')) ||
            themeName,
          (typeof window !== 'undefined' &&
            localStorage.getItem('themeType')) ||
            themeType,
          i18n.language === 'fa' ? 'rtl' : 'ltr'
        ),
        direction: i18n.language === 'fa' ? 'rtl' : 'ltr',
      });
    }
    return () => {
      isMount = false;
    };
  }, [themeType, themeName]);

  const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

  return (
    <Fragment>
      <Head>
        <meta name='viewport' content='initial-scale=1, width=device-width' />
      </Head>
      <StylesProvider jss={jss}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <LoadingBar
            height={5}
            color={theme.palette.primary.light}
            progress={loadingBar}
            className='top-loading-bar'
          />

          <div id='main-wrap'>
            <PageTransition timeout={300} classNames='page-fade-transition'>
              <Component {...pageProps} router={router} key={router.route} />
            </PageTransition>
          </div>
        </ThemeProvider>
      </StylesProvider>
    </Fragment>
  );
}
MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};

export default wrapper.withRedux(appWithTranslation(MyApp));
