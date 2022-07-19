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
      if (dataType == 'Countries') {
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

              const valuesList = await collection.aggregate([
                {
                  $addFields: {
                    totalStates: { $size: '$states' },
                  },
                },
                { $unset: 'states' },
              ]);
              if (hzErrorConnection) {
                res.status(200).json({
                  success: true,
                  totalValuesLength: valuesList.length,
                  data: result,
                });
              } else {
                // use Catch system with Hz
                const multiMap = await hz.getMultiMap('Countries');
                const multiMapP = await hz.getMultiMap('Provinces');
                await multiMap.destroy();
                await multiMapP.destroy();
                await multiMap.put(`allCountries`, valuesList);
                res.status(200).json({
                  success: true,
                  totalValuesLength: valuesList.length,
                  data: result,
                });
              }
            }
          });
        });
      }
      if (dataType == 'Provinces') {
        await collection.findOne({ _id: country_id }).then(async (oldData) => {
          oldData.states.filter((a) => {
            if (a.id == body.id) {
              a.name = body.name;
              a.type = body.type;
              a.latitude = body.latitude;
              a.longitude = body.longitude;
              return a;
            }
          });
          oldData.save(async (err, result) => {
            if (err) {
              res.status(403).json({
                success: false,
                Error: err.toString(),
                ErrorCode: err?.code,
              });
            } else {
              const { hzErrorConnection, hz } = await hazelCast();
              const valuesList = await collection.aggregate([
                { $project: { _id: 0 } },
                { $unwind: '$states' },

                {
                  $addFields: {
                    'states.country': '$name',
                    'states.emoji': '$emoji',
                    'states.iso2': '$iso2',
                    'states.country_id': '$id',
                    'states.totalCities': { $size: '$states.cities' },
                  },
                },
                { $unset: 'states.cities' },
                { $group: { _id: null, provinces: { $push: '$states' } } },
                { $project: { _id: 0, provinces: '$provinces' } },
              ]);
              if (hzErrorConnection) {
                res.status(200).json({
                  success: true,
                  totalValuesLength: valuesList.length,
                  data: result,
                });
              } else {
                // use Catch system with Hz
                const multiMap = await hz.getMultiMap('Countries');
                const multiMapP = await hz.getMultiMap('Provinces');
                await multiMap.destroy();
                await multiMapP.destroy();
                await multiMap.put(`allProvinces`, valuesList);
                res.status(200).json({
                  success: true,
                  totalValuesLength: valuesList.length,
                  data: result,
                });
              }
            }
          });
        });
      }
      if (dataType == 'Cities') {
        console.log(body);

        await collection.findOne({ _id: country_id }).then(async (oldData) => {
          const state = oldData.states.filter((a) => a._id == state_id);
          state[0].cities.filter((a) => {
            if (a.id == body.id) {
              a.name = body.name;
              a.latitude = body.latitude;
              a.longitude = body.longitude;
              return a;
            }
          });
          oldData.save(async (err, result) => {
            if (err) {
              res.status(403).json({
                success: false,
                Error: err.toString(),
                ErrorCode: err?.code,
              });
            } else {
              const { hzErrorConnection, hz } = await hazelCast();
              const valuesList = await collection.aggregate([
                { $project: { _id: 0 } },
                { $unwind: '$states' },
                { $unwind: '$states.cities' },
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
                { $group: { _id: null, cities: { $push: '$states.cities' } } },
                { $project: { _id: 0, cities: '$cities' } },
              ]);
              if (hzErrorConnection) {
                res.status(200).json({
                  success: true,
                  totalValuesLength: valuesList.length,
                  data: result,
                });
              } else {
                const multiMap = await hz.getMultiMap('Countries');
                const multiMapP = await hz.getMultiMap('Provinces');
                const multiMapC = await hz.getMultiMap('Cities');
                await multiMap.destroy();
                await multiMapP.destroy();
                await multiMapC.destroy();
                await multiMap.put(`allCities`, valuesList);
                res.status(200).json({
                  success: true,
                  totalValuesLength: valuesList.length,
                  data: result,
                });
              }
            }
          });
        });
      }
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
