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

function paginate(array, valuesPerPage, valuesPageNumber) {
  // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
  return array.slice(
    (valuesPageNumber - 1) * valuesPerPage,
    valuesPageNumber * valuesPerPage
  );
}

const sort_by = (field, reverse, primer) => {
  const key = primer
    ? function (x) {
        return primer(x[field]);
      }
    : function (x) {
        return x[field];
      };

  reverse = !reverse ? 1 : -1;

  return function (a, b) {
    return (a = key(a)), (b = key(b)), reverse * ((a > b) - (b > a));
  };
};
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
          { $unwind: '$states' },
          { $unwind: '$states.cities' },
          { $match: { 'states.cities.name': searchRegex } },
          {
            $addFields: {
              'states.cities.country': '$name',
              'states.cities.emoji': '$emoji',
              'states.cities.iso2': '$iso2',
              'states.cities.countryId': '$id',
              'states.cities.country_id': '$_id',
              'states.cities.stateId': '$states.id',
              'states.cities.state_name': '$states.name',
              'states.cities.state_id': '$states._id',
            },
          },
          {
            $unset: ['states.cities.latitude', 'states.cities.longitude'],
          },
          { $sort: { 'states.cities.name': 1 } },
          { $limit: 50 },
          { $group: { _id: null, cities: { $push: '$states.cities' } } },
          { $project: { cities: 1, _id: 1 } },
        ]);
        if (valuesList.length > 0) {
          const cities = valuesList[0].cities;
          res.status(200).json({ success: true, data: cities });
        } else {
          res.status(200).json({ success: true, data: [] });
        }
      } else {
        const multiMap = await hz.getMultiMap('Cities');
        const dataIsExist = await multiMap.containsKey(`allCities`);
        if (dataIsExist) {
          const values = await multiMap.get(`allCities`);
          for (const value of values) {
            const filterCityItem = value.map((a) => {
              return {
                id: a.id,
                name: a.name,
                country: a.country,
                _id: a._id,
                emoji: a.emoji,
                iso2: a.iso2,
                countryId: a.countryId,
                country_id: a.country_id,
                stateId: a.stateId,
                state_name: a.state_name,
                state_id: a.state_id,
              };
            });
            const filterdData = filterCityItem.filter((row) => {
              return Object.keys(row).some((field) => {
                if (row[field] !== null) {
                  return searchRegex.test(row[field].toString());
                }
              });
            });
            if (filterdData.length > 0) {
              res.status(200).json({
                success: true,
                data: paginate(
                  filterdData.sort(
                    sort_by('name', false, (a) => a.toUpperCase())
                  ),
                  50,
                  1
                ),
              });
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
            { $unwind: '$states' },
            { $unwind: '$states.cities' },
            { $match: { 'states.cities.name': searchRegex } },
            {
              $addFields: {
                'states.cities.country': '$name',
                'states.cities.emoji': '$emoji',
                'states.cities.iso2': '$iso2',
                'states.cities.countryId': '$id',
                'states.cities.country_id': '$_id',
                'states.cities.stateId': '$states.id',
                'states.cities.state_name': '$states.name',
                'states.cities.state_id': '$states._id',
              },
            },
            {
              $unset: ['states.cities.latitude', 'states.cities.longitude'],
            },
            { $sort: { 'states.cities.name': 1 } },
            { $limit: 50 },
            { $group: { _id: null, cities: { $push: '$states.cities' } } },
            { $project: { cities: 1, _id: 1 } },
          ]);
          if (valuesList.length > 0) {
            const cities = valuesList[0].cities;
            res.status(200).json({ success: true, data: cities });
            await hz.shutdown();
          } else {
            res.status(200).json({ success: true, data: [] });
            await hz.shutdown();
          }
        }

        await hz.shutdown();
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
