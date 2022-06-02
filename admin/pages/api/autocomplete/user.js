const nextConnect = require('next-connect');
import dbConnect from '../../../helpers/dbConnect';
import verifyToken from '../../../helpers/verifyToken';
import hazelCast from '../../../helpers/hazelCast';
import mongoose from 'mongoose';
import Users from '../../../models/Users';

export function escapeRegExp(value) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

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
      const { modelName, filter } = req.body;
      const { hzErrorConnection, hz } = await hazelCast();
      var collection = mongoose.model(modelName);
      const searchRegex = new RegExp(escapeRegExp(filter), 'i');
      if (hzErrorConnection) {
        const valuesList = await collection.aggregate([
          { $sort: { userName: 1 } },
          { $match: { userName: searchRegex } },
          { $limit: 50 },
          { $project: { _id: 1, userName: 1, profileImage: 1 } },
        ]);
        if (valuesList.length > 0) {
          res.status(200).json({ success: true, data: valuesList });
        } else {
          res.status(200).json({
            success: true,
            data: [],
          });
        }
      } else {
        const multiMap = await hz.getMultiMap(modelName);
        const dataIsExist = await multiMap.containsKey(`all${modelName}`);
        if (dataIsExist) {
          const values = await multiMap.get(`all${modelName}`);
          for (const value of values) {
            const filterUsersItem = value.map((a) => {
              return {
                _id: a._id,
                userName: a.userName,
                profileImage: a.profileImage,
              };
            });
            const filterdData = filterUsersItem.filter((row) => {
              return Object.keys(row).some((field) => {
                if (row[field] !== null) {
                  return searchRegex.test(row[field].toString());
                }
              });
            });
            if (filterdData.length > 0) {
              res.status(200).json({ success: true, data: filterdData });
            } else {
              res.status(200).json({
                success: true,
                data: [],
              });
            }
          }
        } else {
          const valuesList = await collection.aggregate([
            { $sort: { userName: 1 } },
            { $match: { userName: searchRegex } },
            { $limit: 50 },
            { $project: { _id: 1, userName: 1, profileImage: 1 } },
          ]);
          if (valuesList.length > 0) {
            res.status(200).json({ success: true, data: valuesList });
          } else {
            res.status(200).json({
              success: true,
              data: [],
            });
          }
        }
      }
    } catch (error) {
      res.status(500).json({ success: false, Error: error.toString() });
    }
  }
});

export default apiRoute;
