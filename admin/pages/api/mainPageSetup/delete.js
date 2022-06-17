const nextConnect = require('next-connect');

import dbConnect from '../../../helpers/dbConnect';
import verifyToken from '../../../helpers/verifyToken';
import { MultifileMiddlewareDelete } from '../../../middleware/multifileMiddleware';
import hazelCast from '../../../helpers/hazelCast';
import mongoose from 'mongoose';
import Videos from '../../../models/Videos';
import Users from '../../../models/Users';
import Photos from '../../../models/Photos';
import Countries from '../../../models/Countries';

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
            if (modelName == 'Users') {
              await deleteLocations(req, res, next, docs);
            }
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

export async function deleteLocations(req, res, next, result) {
  const { modelName } = req.body;
  switch (modelName) {
    case 'Users':
      if (result?.country_id.length > 0) {
        await Countries.updateOne(
          { _id: { $in: result.country_id } },
          {
            $pull: {
              users_id: result._id,
            },
          },
          { new: true }
        );
      }
      if (result?.province_id.length > 0) {
        await Countries.updateOne(
          { 'states._id': { $in: result.province_id } },
          {
            $pull: {
              'states.$.users_id': result._id,
            },
          },
          { multi: true }
        );
      }

      if (result?.city_id.length > 0) {
        await Countries.updateOne(
          { 'states.cities._id': { $in: result.city_id } },
          {
            $pull: {
              'states.$[outer].cities.$[inner].users_id': result._id,
            },
          },
          {
            arrayFilters: [
              { 'outer._id': result.province_id },
              { 'inner._id': result.city_id },
            ],
            multi: true,
          }
        );
      }
      break;

    default:
      break;
  }
}

export default apiRoute;
