const nextConnect = require('next-connect');
import dbConnect from '../../../helpers/dbConnect';
import verifyToken from '../../../helpers/verifyToken';
import multiparty from '../../../middleware/multiparty';
import hazelCast from '../../../helpers/hazelCast';
import { multifileMiddlewareCreate } from '../../../middleware/multifileMiddleware';
import { fsDeleteObjectsFolder } from '../../../helpers/aws';
import mongoose from 'mongoose';
import Hotels from '../../../models/Hotels';
const apiRoute = nextConnect({
  onNoMatch(req, res) {
    res
      .status(405)
      .json({ success: false, Error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(multiparty);
apiRoute.post(
  verifyToken,
  multifileMiddlewareCreate,
  async (req, res, next) => {
    const dbConnected = await dbConnect();
    const { success } = dbConnected;
    if (!success) {
      res.status(500).json({ success: false, Error: dbConnected.error });
    } else {
      try {
        const { modelName } = req.body;
        var collection = mongoose.model(modelName);
        delete req.body._id;
        req.body.country_id = JSON.parse(req?.body?.country_id);
        req.body.province_id = JSON.parse(req?.body?.province_id);
        req.body.city_id = JSON.parse(req?.body?.city_id);
        req.body.facilities_id = JSON.parse(req?.body?.facilities_id);
        req.body.hotelImages = JSON.parse(req?.body?.hotelImages);
        req.body.userCreated = JSON.parse(req?.body?.userCreated);
        req.body.userUpdated = JSON.parse(req?.body?.userUpdated);
        req.body.imageKey = JSON.parse(req?.body?.imageKey);
        req.body.rooms_id = JSON.parse(req?.body?.rooms_id);
        const newValue = await new collection(req.body);
        await newValue.save(async (err, result) => {
          console.log(result);
          if (err) {
            console.log(err);
            res.status(403).json({
              success: false,
              Error: err.toString(),
              keyPattern: err?.keyPattern,
              ErrorCode: err?.code,
            });
          }
          const { hzErrorConnection, hz } = await hazelCast();
          if (!hzErrorConnection) {
            const multiMap = await hz.getMultiMap(modelName);
            const dataIsExist = await multiMap.containsKey(`all${modelName}`);
            if (dataIsExist) {
              const values = await multiMap.get(`all${modelName}`);
              for (const value of values) {
                value.push(result);
                await multiMap.clear(`all${modelName}`);
                await multiMap.put(`all${modelName}`, value);
              }
            }
            await hz.shutdown();
          }
          res.status(200).json({
            success: true,
            totalValuesLength: 0,
            data: result,
          });
        });
      } catch (error) {
        console.log(error);
        fsDeleteObjectsFolder(req, res, next, req.body.folderId);
        res.status(500).json({ success: false, Error: error.toString() });
      }
    }
  }
);

export default apiRoute;
export const config = {
  api: {
    bodyParser: false,
  },
};
