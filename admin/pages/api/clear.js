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
    const multiMapv = await hz.getMultiMap('Videos');
    const multiMapf = await hz.getMultiMap('Features');
    const multiMapp = await hz.getMultiMap('Photos');
    const multiMapu = await hz.getMultiMap('Users');
    const multiMapc = await hz.getMultiMap('Countries');
    const multiMapPr = await hz.getMultiMap('Provinces');
    const multiMapCt = await hz.getMultiMap('Cities');
    const multiMapCu = await hz.getMultiMap('Currencies');
    const multiMapAg = await hz.getMultiMap('Agencies');
    const multiMapRo = await hz.getMultiMap('Roles');
    const multiMapHl = await hz.getMultiMap('HotelsList');
    const hotelNullMap = await hz.getMultiMap('NullHotels');
    const hotelMap = await hz.getMultiMap('Hotels');
    await multiMapv.destroy();
    await multiMapf.destroy();
    await multiMapp.destroy();
    await multiMapu.destroy();
    await multiMapc.destroy();
    await multiMapPr.destroy();
    await multiMapCt.destroy();
    await multiMapCu.destroy();
    await multiMapAg.destroy();
    await multiMapRo.destroy();
    await multiMapHl.destroy();
    await hotelNullMap.destroy();
    await hotelMap.destroy();

    console.log('clear all catch');
    res.status(200).redirect('/admin/dashboard');
    await hz.shutdown();
  } else {
    res.status(200).redirect('/admin/dashboard');
    if (!hzErrorConnection) {
      await hz.shutdown();
    }
  }
});

export default apiRoute;
