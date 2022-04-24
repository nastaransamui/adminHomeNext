import hazelCast from '../../helpers/hazelCast';
const nextConnect = require('next-connect');

const apiRoute = nextConnect({
  onNoMatch(req, res) {
    res
      .status(405)
      .json({ success: false, Error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.get(async (req, res, next) => {
  const { hzErrorConnection, hz } = await hazelCast();
  if (!hzErrorConnection) {
    const multiMapu = await hz.getMultiMap('Users');
    const multiMapv = await hz.getMultiMap('Videos');
    await multiMapu.destroy();
    await multiMapv.destroy();
    console.log('clear all catch');
    await hz.shutdown();
    res.status(200).redirect('/admin/dashboard');
  } else {
    res.status(200).redirect('/admin/dashboard');
  }
});

export default apiRoute;
