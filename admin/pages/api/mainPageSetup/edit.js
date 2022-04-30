const nextConnect = require('next-connect');

import dbConnect from '../../../helpers/dbConnect';
import verifyToken from '../../../helpers/verifyToken';
import middleware from '../../../middleware/multiparty';
import hazelCast from '../../../helpers/hazelCast';
import { multifileMiddlewareEdit } from '../../../middleware/multifileMiddleware';
import verifySingleActive from '../../../helpers/verifySingleActive';
import mongoose from 'mongoose';
import Videos from '../../../models/Videos';
import Users from '../../../models/Users';
import Photos from '../../../models/Photos';

const apiRoute = nextConnect({
  onNoMatch(req, res) {
    res
      .status(405)
      .json({ success: false, Error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(middleware);

// apiRoute.use(verifySingleActive);

apiRoute.post(
  verifyToken,
  verifySingleActive,
  multifileMiddlewareEdit,
  async (req, res, next) => {
    const dbConnected = await dbConnect();
    const { success } = dbConnected;
    if (!success) {
      res.status(500).json({ success: false, Error: dbConnected.error });
    } else {
      try {
        const { _id, modelName } = req.body;
        //Check if Password change if not delete from object
        if (req.body.password == '') {
          delete req.body.password;
        }
        const collection = mongoose.model(modelName);
        await collection.findById(_id).then(async (oldData) => {
          for (var key in req.body) {
            if (
              typeof oldData[key] !== 'function' &&
              req.body[key] !== undefined
            ) {
              oldData[key] = req.body[key];
            }
          }
          oldData.save(async (err, result) => {
            if (err) {
              res.status(403).json({
                success: false,
                Error: err.toString(),
                ErrorCode: err?.code,
              });
            } else {
              const totalValue = await collection.find();
              const { hzErrorConnection, hz } = await hazelCast();
              if (!hzErrorConnection) {
                const multiMap = await hz.getMultiMap(modelName);
                await multiMap.destroy();
                await multiMap.put(`all${modelName}`, totalValue);
                await hz.shutdown();
              }
              res.status(200).json({
                success: true,
                totalValuesLength: totalValue.length,
                data: result,
              });
            }
          });
        });
      } catch (error) {
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
