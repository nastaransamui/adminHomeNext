// Tell Next.js these files will be read at runtime by the below code:
const path = require('path');
path.resolve('./public/locales/');
module.exports = {
  basePath: '/admin',
  react: {
    useSuspense: false,
    wait: true,
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/admin',
        permanent: true,
        basePath: false,
      },
    ];
  },
};
