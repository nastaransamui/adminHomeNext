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
  const { city_id, modelName } = req.body;
  if (!success) {
    res.status(500).json({ success: false, Error: dbConnected.error });
  } else {
    try {
      const { hzErrorConnection, hz } = await hazelCast();
      var collection = mongoose.model(modelName);
      if (hzErrorConnection) {
        const valuesList = await collection.aggregate([
          { $unwind: '$states' },
          { $unwind: '$states.cities' },
          { $match: { 'states.cities.id': Number(city_id) } },
          {
            $addFields: {
              'states.cities.country': '$name',
              'states.cities.emoji': '$emoji',
              'states.cities.iso2': '$iso2',
              'states.cities.country_id': '$id',
              'states.cities.state_id': '$states.id',
              'states.cities.state_name': '$states.name',
            },
          },
          { $group: { _id: null, city: { $push: '$states.cities' } } },
          { $project: { _id: 0, city: '$city' } },
        ]);
        if (valuesList.length > 0) {
          const city = valuesList[0].city[0];
          res.status(200).json({ success: true, data: city });
        } else {
          res.status(500).json({ success: false, Error: 'noResult' });
        }
      } else {
        // use Catch system with Hz
        const multiMap = await hz.getMultiMap('Cities');
        const dataIsExist = await multiMap.containsKey(`allCities`);
        if (dataIsExist) {
          const values = await multiMap.get(`allCities`);
          for (const value of values) {
            const valuesList = value.filter((a) => a.id == Number(city_id));
            const city = valuesList[0];
            res.status(200).json({ success: true, data: city });
          }
        } else {
          const valuesList = await collection.aggregate([
            { $unwind: '$states' },
            { $unwind: '$states.cities' },
            { $match: { 'states.cities.id': Number(city_id) } },
            {
              $addFields: {
                'states.cities.country': '$name',
                'states.cities.emoji': '$emoji',
                'states.cities.iso2': '$iso2',
                'states.cities.country_id': '$id',
                'states.cities.state_id': '$states.id',
                'states.cities.state_name': '$states.name',
              },
            },
            { $group: { _id: null, city: { $push: '$states.cities' } } },
            { $project: { _id: 0, city: '$city' } },
          ]);
          if (valuesList.length > 0) {
            const city = valuesList[0].city[0];
            res.status(200).json({ success: true, data: city });
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
