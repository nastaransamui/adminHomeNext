const { initReactI18next } = require('react-i18next');
// Tell Next.js these files will be read at runtime by the below code:
const path = require('path');
path.resolve('./public/locales/');
module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fa'],
  },
  react: {
    useSuspense: false,
  },
};
