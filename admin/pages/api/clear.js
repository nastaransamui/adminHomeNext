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
    const multiMapf = await hz.getMultiMap('Features');
    const multiMapp = await hz.getMultiMap('Photos');
    const multiMapc = await hz.getMultiMap('Countries');
    console.log(multiMapc);
    await multiMapu.destroy();
    await multiMapv.destroy();
    await multiMapf.destroy();
    await multiMapp.destroy();
    await multiMapc.destroy();

    console.log('clear all catch');
    await hz.shutdown();
    res.status(200).redirect('/admin/dashboard');
  } else {
    res.status(200).redirect('/admin/dashboard');
  }
});

export default apiRoute;
