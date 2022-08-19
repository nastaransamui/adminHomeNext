const nextConnect = require('next-connect');

import dbConnect from '../../../helpers/dbConnect';
import verifyToken from '../../../helpers/verifyToken';
import mongoose from 'mongoose';
import Hotels from '../../../models/Hotels';
import { ObjectId } from 'mongodb';
import hazelCast from '../../../helpers/hazelCast';

const apiRoute = nextConnect({
  onNoMatch(req, res) {
    console.log('Error api rout');
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
      const { _id, modelName } = req.body;
      const collection = mongoose.model(modelName);
      const { hzErrorConnection, hz } = await hazelCast();
      if (hzErrorConnection) {
        const hotelValue = await collection.aggregate([
          { $match: { _id: ObjectId(_id) } },
        ]);
        if (hotelValue.length > 0) {
          res.status(200).json({
            success: true,
            data: hotelValue[0],
          });
        } else {
          res.status(500).json({ success: false, Error: 'Notfind' });
        }
      } else {
        const multiMap = await hz.getMultiMap(modelName);
        const dataIsExist = await multiMap.containsKey(`all${modelName}`);
        if (dataIsExist) {
          const values = await multiMap.get(`all${modelName}`);
          for (const value of values) {
            const hotel = value.filter((a) => a._id == _id);
            if (hotel.length > 0) {
              res.status(200).json({
                success: true,
                data: hotel[0],
              });
            } else {
              res.status(500).json({ success: false, Error: 'Notfind' });
            }
          }
          await hz.shutdown();
        } else {
          const hotelValue = await collection.aggregate([
            { $match: { _id: ObjectId(_id) } },
          ]);
          if (hotelValue.length > 0) {
            res.status(200).json({
              success: true,
              data: hotelValue[0],
            });
          } else {
            res.status(500).json({ success: false, Error: 'Notfind' });
          }
        }
      }
    } catch (error) {
      let errorText = error.toString();
      error?.kind == 'ObjectId' ? (errorText = 'Notfind') : errorText;
      res.status(500).json({ success: false, Error: errorText });
    }
  }
});

export default apiRoute;
