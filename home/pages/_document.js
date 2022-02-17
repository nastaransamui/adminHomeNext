import Document, { Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheets } from '@mui/styles';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Children } from 'react';
import { getCookies, checkCookies } from 'cookies-next';
import palette from '../theme/palette';

class MyDocument extends Document {
  render() {
    const { cookies } = this.props;
    const { themeName } = cookies;

    const primaryColor = checkCookies('themeName')
      ? palette[themeName].palette.primary.main
      : '#fff';
    return (
      <Html lang='en' dir='ltr'>
        <Head>
          <link rel='preconnect' href='https://fonts.googleapis.com' />
          <link
            rel='preconnect'
            href='https://fonts.gstatic.com'
            crossOrigin='true'
          />
          <link
            href='https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,400;0,500;1,900&display=swap'
            rel='stylesheet'
          />
          <link
            rel='stylesheet'
            href='https://fonts.googleapis.com/icon?family=Material+Icons'
          />
          <link
            href='https://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css'
            rel='stylesheet'
          />
          <link rel='shortcut icon' href='/favicons/favicon.ico' />
          <link
            rel='apple-touch-icon'
            sizes='57x57'
            href='/favicons/apple-icon-57x57.png'
          />
          <link
            rel='apple-touch-icon'
            sizes='60x60'
            href='/favicons/apple-icon-60x60.png'
          />
          <link
            rel='apple-touch-icon'
            sizes='72x72'
            href='/favicons/apple-icon-72x72.png'
          />
          <link
            rel='apple-touch-icon'
            sizes='76x76'
            href='/favicons/apple-icon-76x76.png'
          />
          <link
            rel='apple-touch-icon'
            sizes='114x114'
            href='/favicons/apple-icon-114x114.png'
          />
          <link
            rel='apple-touch-icon'
            sizes='120x120'
            href='/favicons/apple-icon-120x120.png'
          />
          <link
            rel='apple-touch-icon'
            sizes='144x144'
            href='/favicons/apple-icon-144x144.png'
          />
          <link
            rel='apple-touch-icon'
            sizes='152x152'
            href='/favicons/apple-icon-152x152.png'
          />
          <link
            rel='apple-touch-icon'
            sizes='180x180'
            href='/favicons/apple-icon-180x180.png'
          />
          <link
            rel='icon'
            type='image/png'
            sizes='192x192'
            href='/favicons/android-icon-192x192.png'
          />
          <link
            rel='icon'
            type='image/png'
            sizes='32x32'
            href='/favicons/favicon-32x32.png'
          />
          <link
            rel='icon'
            type='image/png'
            sizes='96x96'
            href='/favicons/favicon-96x96.png'
          />
          <link
            rel='icon'
            type='image/png'
            sizes='16x16'
            href='/favicons/favicon-16x16.png'
          />
          <link rel='manifest' href='/favicons/manifest.json' />
          <link
            href='https://fonts.googleapis.com/css?family=Open+Sans:400,600,700'
            rel='stylesheet'
          />
          <link
            rel='stylesheet'
            href='https://fonts.googleapis.com/icon?family=Material+Icons'
          />
          <link
            href='https://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css'
            rel='stylesheet'
          />
          <meta name='msapplication-TileColor' content='#ffffff' />
          <meta
            name='msapplication-TileImage'
            content='/admin/favicons/ms-icon-144x144.png'
          />
          <meta name='theme-color' content='#303030' />
        </Head>
        <body>
          <div
            id='preloader'
            style={{
              position: 'fixed',
              zIndex: 10000,
              background: primaryColor,
              width: '100%',
              height: '100%',
              top: 0,
            }}>
            <img
              style={{
                opacity: 0.5,
                position: 'fixed',
                top: 'calc(50% - 50px)',
                left: 'calc(50% - 50px)',
              }}
              src='/images/loading.gif'
              alt='loading'
            />
          </div>
          <div id='page-transition'></div>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

MyDocument.getInitialProps = async (ctx) => {
  const cookies = getCookies(ctx);
  // Resolution order
  //
  // On the server:
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. document.getInitialProps
  // 4. app.render
  // 5. page.render
  // 6. document.render
  //
  // On the server with error:
  // 1. document.getInitialProps
  // 2. app.render
  // 3. page.render
  // 4. document.render
  //
  // On the client
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. app.render
  // 4. page.render

  // Render app and page and get the context of the page with collected side effects.
  const sheets = new ServerStyleSheets();
  const originalRenderPage = ctx.renderPage;

  ctx.renderPage = () =>
    originalRenderPage({
      // eslint-disable-line
      enhanceApp: (App) => (props) => sheets.collect(<App {...props} />), // eslint-disable-line
    });

  const initialProps = await Document.getInitialProps(ctx);

  return {
    ...initialProps,
    ...(await serverSideTranslations(ctx.locale, ['common', '404', 'home'])),
    styles: [
      ...Children.toArray(initialProps.styles),
      process.env.NODE_ENV === 'development' && sheets.getStyleElement(),
    ],
    cookies: cookies,
  };
};
export default MyDocument;
