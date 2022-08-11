const nextConnect = require('next-connect');

import dbConnect from '../../../helpers/dbConnect';
import verifyToken from '../../../helpers/verifyToken';
import hazelCast from '../../../helpers/hazelCast';
import mongoose from 'mongoose';
import Countries from '../../../models/Countries';

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
  const { state_id, modelName } = req.body;
  if (!success) {
    res.status(500).json({ success: false, Error: dbConnected.error });
  } else {
    try {
      const { hzErrorConnection, hz } = await hazelCast();
      var collection = mongoose.model(modelName);
      if (hzErrorConnection) {
        const valuesList = await collection.aggregate([
          { $unwind: '$states' },
          { $match: { 'states.id': Number(state_id) } },
          {
            $addFields: {
              'states.country': '$name',
              'states.emoji': '$emoji',
              'states.iso2': '$iso2',
              'states.iso3': '$iso3',
              'states.countryId': '$id',
              'states.country_id': '$_id',
              'states.totalCities': { $size: '$states.cities' },
            },
          },
          { $group: { _id: null, province: { $push: '$states' } } },
          { $project: { _id: 1, province: '$province' } },
        ]);
        if (valuesList.length > 0) {
          const province = valuesList[0].province[0];
          res.status(200).json({ success: true, data: province });
        } else {
          res.status(500).json({ success: false, Error: 'noResult' });
        }
      } else {
        const multiMap = await hz.getMultiMap('Provinces');
        const dataIsExist = await multiMap.containsKey(`allProvinces`);
        if (dataIsExist) {
          const values = await multiMap.get(`allProvinces`);
          for (const value of values) {
            const valuesList = value.filter((a) => a.id == state_id);
            const province = valuesList[0];
            res.status(200).json({ success: true, data: province });
          }
          await hz.shutdown();
        } else {
          const valuesList = await collection.aggregate([
            { $unwind: '$states' },
            { $match: { 'states.id': Number(state_id) } },
            {
              $addFields: {
                'states.country': '$name',
                'states.emoji': '$emoji',
                'states.iso2': '$iso2',
                'states.iso3': '$iso3',
                'states.countryId': '$id',
                'states.country_id': '$_id',
                'states.totalCities': { $size: '$states.cities' },
              },
            },
            { $group: { _id: null, province: { $push: '$states' } } },
            { $project: { _id: 1, province: '$province' } },
          ]);
          if (valuesList.length > 0) {
            const province = valuesList[0].province[0];
            res.status(200).json({ success: true, data: province });
            await hz.shutdown();
          } else {
            res.status(500).json({ success: false, Error: 'noResult' });
          }
        }
      }
    } catch (error) {
      res.status(500).json({ success: false, Error: error.toString() });
    }
  }
});

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb',
    },
  },
};

export default apiRoute;
