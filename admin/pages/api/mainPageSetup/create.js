const nextConnect = require('next-connect');
import dbConnect from '../../../helpers/dbConnect';
import verifyToken from '../../../helpers/verifyToken';
import verifySingleActive from '../../../helpers/verifySingleActive';
import multiparty from '../../../middleware/multiparty';
import hazelCast from '../../../helpers/hazelCast';
import { multifileMiddlewareCreate } from '../../../middleware/multifileMiddleware';
import { fsDeleteObjectsFolder } from '../../../helpers/aws';
import mongoose from 'mongoose';
import { hashPassword } from '../../../helpers/auth';
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

apiRoute.use(multiparty);

apiRoute.post(
  verifyToken,
  hashPassword,
  verifySingleActive,
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
        const newValue = await new collection(req.body);
        await newValue.save(async (err, result) => {
          if (err) {
            res.status(403).json({
              success: false,
              Error: err.toString(),
              ErrorCode: err?.code,
            });
          } else {
            const totalValues = await collection.find();
            const { hzErrorConnection, hz } = await hazelCast();
            if (!hzErrorConnection) {
              const multiMap = await hz.getMultiMap(modelName);
              await multiMap.destroy();
              await multiMap.put(`all${modelName}`, totalValues);
              await hz.shutdown();
            }
            res.status(200).json({
              success: true,
              totalValuesLength: totalValues.length,
              data: result,
            });
          }
        });
      } catch (error) {
        fsDeleteObjectsFolder(res, next, req.body.folderId);
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
