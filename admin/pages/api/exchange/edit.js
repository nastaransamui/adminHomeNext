const nextConnect = require('next-connect');

import dbConnect from '../../../helpers/dbConnect';
import verifyToken from '../../../helpers/verifyToken';
import hazelCast from '../../../helpers/hazelCast';
import mongoose from 'mongoose';
import Currencies from '../../../models/Currencies';

const apiRoute = nextConnect({
  onNoMatch(req, res) {
    res
      .status(405)
      .json({ success: false, Error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.post(verifyToken, async (req, res, next) => {
  const dbConnected = await dbConnect();
  const { success } = dbConnected;
  if (!success) {
    res.status(500).json({ success: false, Error: dbConnected.error });
  } else {
    try {
      const body = JSON.parse(req.body);
      const { _id, modelName, dataType, country_id, state_id } = body;
      const collection = mongoose.model(modelName);

      await collection.findById(_id).then(async (oldData) => {
        for (var key in body) {
          if (typeof oldData[key] !== 'function' && body[key] !== undefined) {
            oldData[key] = body[key];
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
            const { hzErrorConnection, hz } = await hazelCast();

            const valuesList = await collection.find({});
            if (hzErrorConnection) {
              res.status(200).json({
                success: true,
                totalValuesLength: valuesList.length,
                data: result,
              });
            } else {
              // use Catch system with Hz
              const multiMap = await hz.getMultiMap('Currencies');
              await multiMap.destroy();
              await multiMap.put(`allCurrencies`, valuesList);
              res.status(200).json({
                success: true,
                totalValuesLength: valuesList.length,
                data: result,
              });
            }
          }
        });
      });
    } catch (error) {
      res.status(500).json({ success: false, Error: error.toString() });
    }
  }
});

export default apiRoute;
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '5mb',
    },
  },
};
