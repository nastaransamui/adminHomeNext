import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link
            rel='stylesheet'
            href='//cdn.jsdelivr.net/chartist.js/latest/chartist.min.css'
          />
          <script src='//cdn.jsdelivr.net/chartist.js/latest/chartist.min.js'></script>
          <link
            rel='stylesheet'
            href='https://cdnjs.cloudflare.com/ajax/libs/jvectormap/2.0.4/jquery-jvectormap.css'
            type='text/css'
            media='screen'
          />
          <link
            rel='stylesheet'
            href='//cdn.datatables.net/1.10.16/css/jquery.dataTables.min.css'
            type='text/css'
            media='screen'
          />
          <link
            href='https://use.fontawesome.com/releases/v5.0.7/css/all.css'
            rel='stylesheet'
          />
          <link
            rel='stylesheet'
            type='text/css'
            href='https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons'
          />
          <link
            href='https://fonts.googleapis.com/icon?family=Material+Icons'
            rel='stylesheet'
          />
        </Head>
        <body>
          <div
            id='preloader'
            style={{
              position: 'fixed',
              zIndex: 10000,
              background: '#fafafa',
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <noscript>
              <p>Please enabled javascript to continue</p>
            </noscript>
            <img
              style={{
                opacity: 0.5,
                position: 'fixed',
                top: 'calc(50% - 50px)',
                left: 'calc(50% - 50px)',
              }}
              src='/admin/images/loading.gif'
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

export default MyDocument;
