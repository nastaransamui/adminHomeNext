const nextConnect = require('next-connect');
import dbConnect from '../../../helpers/dbConnect';
import verifyToken from '../../../helpers/verifyToken';
import hazelCast from '../../../helpers/hazelCast';
import mongoose from 'mongoose';
import Countries from '../../../models/Countries';

const apiRoute = nextConnect({
  onNoMatch(req, res) {
    res
      .status(405)
      .json({ success: false, Error: `Method '${req.method}' Not Allowed` });
  },
});

export function escapeRegExp(value) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

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
          { $project: { _id: 0 } },
          { $unwind: '$states' },
          { $match: { 'states.name': searchRegex } },
          {
            $addFields: {
              'states.country': '$name',
              'states.emoji': '$emoji',
              'states.iso2': '$iso2',
            },
          },
          {
            $unset: [
              'states.cities',
              'states.latitude',
              'states.longitude',
              'states.state_code',
              'states.type',
            ],
          },
          { $sort: { 'states.name': 1 } },
          { $limit: 50 },
          { $group: { _id: null, provinces: { $push: '$states' } } },
          { $project: { _id: 0, provinces: '$provinces' } },
        ]);
        if (valuesList.length > 0) {
          const provinces = valuesList[0].provinces;
          res.status(200).json({ success: true, data: provinces });
        } else {
          res.status(200).json({ success: true, data: [] });
        }
      } else {
        const multiMap = await hz.getMultiMap('Provinces');
        const dataIsExist = await multiMap.containsKey('allProvinces');
        if (dataIsExist) {
          const values = await multiMap.get(`allProvinces`);
          for (const value of values) {
            const filterProvincesItem = value.map((a) => {
              return {
                id: a.id,
                name: a.name,
                country: a.country,
                _id: a._id,
                emoji: a.emoji,
                iso2: a.iso2,
              };
            });
            const filterdData = filterProvincesItem.filter((row) => {
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
            { $project: { _id: 0 } },
            { $unwind: '$states' },
            { $match: { 'states.name': searchRegex } },
            {
              $addFields: {
                'states.country': '$name',
                'states.emoji': '$emoji',
                'states.iso2': '$iso2',
              },
            },
            {
              $unset: [
                'states.cities',
                'states.latitude',
                'states.longitude',
                'states.state_code',
                'states.type',
              ],
            },
            { $sort: { 'states.name': 1 } },
            { $limit: 150 },
            { $group: { _id: null, provinces: { $push: '$states' } } },
            { $project: { _id: 0, provinces: '$provinces' } },
          ]);
          if (valuesList.length > 0) {
            const provinces = valuesList[0].provinces;
            res.status(200).json({ success: true, data: provinces });
          } else {
            res.status(200).json({ success: true, data: [] });
          }
        }
      }
    } catch (error) {
      res.status(500).json({ success: false, Error: error.toString() });
    }
  }
});

export default apiRoute;
