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
