const nextConnect = require('next-connect');
import dbConnect from '../../../helpers/dbConnect';
import verifyToken from '../../../helpers/verifyToken';
import hazelCast from '../../../helpers/hazelCast';
import mongoose from 'mongoose';
import Countries from '../../../models/Countries';

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
    const { hzErrorConnection, hz } = await hazelCast();
    try {
      const { modelName, filter } = req.body;
      var collection = mongoose.model(modelName);
      const searchRegex = new RegExp(escapeRegExp(filter), 'i');
      if (hzErrorConnection) {
        const valuesList = await collection.aggregate([
          { $sort: { name: 1 } },
          { $match: { name: searchRegex } },
          { $limit: 50 },
          { $project: { _id: 1, name: 1, emoji: 1, id: 1, iso2: 1 } },
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
          const values = await multiMap.get(`allCountries`);
          for (const value of values) {
            const filterCountriesItem = value.map((a) => {
              return {
                _id: a._id,
                name: a.name,
                emoji: a.emoji,
                id: a.id,
                iso2: a.iso2,
              };
            });
            const filterdData = filterCountriesItem.filter((row) => {
              return Object.keys(row).some((field) => {
                if (row[field] !== null) {
                  return searchRegex.test(row[field].toString());
                }
              });
            });
            if (filterdData.length > 0) {
              res.status(200).json({ success: true, data: filterdData });
              await hz.shutdown();
            } else {
              res.status(200).json({
                success: true,
                data: [],
              });
              await hz.shutdown();
            }
          }
        } else {
          const valuesList = await collection.aggregate([
            { $sort: { name: 1 } },
            { $match: { name: searchRegex } },
            { $limit: 50 },
            { $project: { _id: 1, name: 1, emoji: 1, id: 1, iso2: 1 } },
          ]);
          if (valuesList.length > 0) {
            res.status(200).json({ success: true, data: valuesList });
            await hz.shutdown();
          } else {
            res.status(200).json({
              success: true,
              data: [],
            });
            await hz.shutdown();
          }
        }
      }
    } catch (error) {
      if (!hzErrorConnection) {
        await hz.shutdown();
      }
      res.status(500).json({ success: false, Error: error.toString() });
    }
  }
});

export default apiRoute;
