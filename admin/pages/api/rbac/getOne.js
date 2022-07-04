const nextConnect = require('next-connect');

import dbConnect from '../../../helpers/dbConnect';
import verifyToken from '../../../helpers/verifyToken';
import mongoose from 'mongoose';
import Roles from '../../../models/Roles';
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
        const roleValue = await collection.aggregate([
          { $match: { _id: ObjectId(_id) } },
          { $unwind: { path: '$users_id', preserveNullAndEmptyArrays: true } },
          {
            $lookup: {
              from: 'users',
              localField: 'users_id',
              pipeline: [
                {
                  $project: {
                    _id: 1,
                    profileImage: 1,
                    userName: 1,
                  },
                },
              ],
              foreignField: '_id',
              as: 'usersData',
            },
          },
        ]);
        if (roleValue.length > 0) {
          res.status(200).json({
            success: true,
            data: roleValue[0],
          });
        } else {
          res.status(403).json({ success: false, Error: 'Notfind' });
        }
      } else {
        const multiMap = await hz.getMultiMap(modelName);
        const dataIsExist = await multiMap.containsKey(`all${modelName}`);
        if (dataIsExist) {
          const values = await multiMap.get(`all${modelName}`);
          for (const value of values) {
            const role = value.filter((a) => a._id == _id);
            if (role.length > 0) {
              res.status(200).json({
                success: true,
                data: role[0],
              });
            } else {
              res.status(500).json({ success: false, Error: 'Notfind' });
            }
          }
        } else {
          const roleValue = await collection.aggregate([
            { $match: { _id: ObjectId(_id) } },
            { $unwind: '$users_id' },
            {
              $lookup: {
                from: 'users',
                localField: 'users_id',
                pipeline: [
                  {
                    $project: {
                      _id: 1,
                      profileImage: 1,
                      userName: 1,
                    },
                  },
                ],
                foreignField: '_id',
                as: 'usersData',
              },
            },
          ]);
          if (roleValue.length > 0) {
            res.status(200).json({
              success: true,
              data: roleValue[0],
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
