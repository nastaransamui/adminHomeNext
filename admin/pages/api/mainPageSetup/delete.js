const nextConnect = require('next-connect');

import dbConnect from '../../../helpers/dbConnect';
import verifyToken from '../../../helpers/verifyToken';
import { MultifileMiddlewareDelete } from '../../../middleware/multifileMiddleware';
import hazelCast from '../../../helpers/hazelCast';
import mongoose from 'mongoose';

const apiRoute = nextConnect({
  onNoMatch(req, res) {
    res
      .status(405)
      .json({ success: false, Error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.post(
  verifyToken,
  MultifileMiddlewareDelete,
  async (req, res, next) => {
    const dbConnected = await dbConnect();
    const { success } = dbConnected;
    if (!success) {
      res.status(500).json({ success: false, Error: dbConnected.error });
    } else {
      try {
        const { modelName } = req.body;
        var collection = mongoose.model(modelName);
        collection.findByIdAndDelete(req.body._id, async (err, docs) => {
          if (err) {
            res.status(500).json({ success: false, Error: err.toString() });
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
            });
          }
        });
      } catch (error) {
        res.status(500).json({ success: false, Error: error.toString() });
      }
    }
  }
);

export default apiRoute;
