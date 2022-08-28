const nextConnect = require('next-connect');

import dbConnect from '../../../helpers/dbConnect';
import verifyToken from '../../../helpers/verifyToken';
import middleware from '../../../middleware/multiparty';
import Hotels from '../../../models/Hotels';
import { editMiddleware } from '../../../middleware/userMiddleware';
import { deleteFsAwsError, fsDeleteObjectsFolder } from '../../../helpers/aws';
import hazelCast from '../../../helpers/hazelCast';
import { findHotelById } from '../../../helpers/auth';

const apiRoute = nextConnect({
  onNoMatch(req, res) {
    res
      .status(405)
      .json({ success: false, Error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(middleware);

apiRoute.post(verifyToken, editMiddleware, async (req, res, next) => {
  const dbConnected = await dbConnect();
  const { success } = dbConnected;
  if (!success) {
    res.status(500).json({ success: false, Error: dbConnected.error });
  } else {
    try {
      const { _id, modelName } = req.body;
      delete req.body._id;
      delete req.body.deletedImage;
      req.body.city_id = JSON.parse(req?.body?.city_id);
      req.body.country_id = JSON.parse(req?.body?.country_id);
      req.body.rooms_id = JSON.parse(req?.body?.rooms_id);
      req.body.facilities_id = JSON.parse(req?.body?.facilities_id);
      req.body.userCreated = JSON.parse(req?.body?.userCreated);
      req.body.userUpdated = JSON.parse(req?.body?.userUpdated);
      req.body.hotelImages = JSON.parse(req?.body?.hotelImages);
      req.body.imageKey = JSON.parse(req?.body?.imageKey);
      req.body.province_id = JSON.parse(req?.body?.province_id);
      findHotelById(_id).then(async (oldHotel) => {
        for (var key in req.body) {
          if (
            typeof oldHotel[key] !== 'function' &&
            req.body[key] !== undefined
          ) {
            oldHotel[key] = req.body[key];
          }
        }
        oldHotel.save(async (err, result) => {
          if (err) {
            // console.log(err);
            if (req.body.isVercel) {
              deleteFsAwsError(req, res, next);
            } else {
              fsDeleteObjectsFolder(req, res, next, req.body.folderId);
            }
            res.status(403).json({
              success: false,
              Error: err.toString(),
              keyPattern: err?.keyPattern,
              ErrorCode: err?.code,
            });
          } else {
            res.status(200).json({
              success: true,
              data: result,
            });
            const { hzErrorConnection, hz } = await hazelCast();
            if (!hzErrorConnection) {
              const multiMap = await hz.getMultiMap(modelName);
              const dataIsExist = await multiMap.containsKey(`all${modelName}`);
              if (dataIsExist) {
                const values = await multiMap.get(`all${modelName}`);
                for (const value of values) {
                  const objIndex = value.findIndex((obj) => obj._id == _id);
                  value[objIndex] = result;
                  await multiMap.clear(`all${modelName}`);
                  await multiMap.put(`all${modelName}`, value);
                }
              }
              await hz.shutdown();
            }
          }
        });
      });
    } catch (error) {
      if (req.body.isVercel) {
        deleteFsAwsError(req, res, next);
      } else {
        fsDeleteObjectsFolder(req, res, next, req.body.folderId);
      }
      res.status(500).json({ success: false, Error: error.toString() });
    }
  }
});

export default apiRoute;
export const config = {
  api: {
    bodyParser: false,
  },
};
