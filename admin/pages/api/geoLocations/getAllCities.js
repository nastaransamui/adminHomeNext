const nextConnect = require('next-connect');
import dbConnect from '../../../helpers/dbConnect';
import verifyToken from '../../../helpers/verifyToken';
import hazelCast from '../../../helpers/hazelCast';
import mongoose from 'mongoose';
import Countries from '../../../models/Countries';
// Pagination function
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
      const {
        valuesPerPage,
        valuesPageNumber,
        locale,
        valuesSortBySorting,
        modelName,
      } = req.body;
      const { hzErrorConnection, hz } = await hazelCast();
      var collection = mongoose.model(modelName);
      if (hzErrorConnection) {
        const valuesList = await collection.aggregate([
          { $unwind: '$states' },
          { $unwind: '$states.cities' },
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
          { $group: { _id: null, cities: { $push: '$states.cities' } } },
          { $project: { _id: 1, cities: '$cities' } },
        ]);
        if (valuesList.length > 0) {
          const cities = valuesList[0].cities;
          res.status(200).json({
            success: true,
            totalValuesLength: cities.length,
            data: paginate(
              cities.sort(
                sort_by(
                  [req.body['valuesSortByField']],
                  valuesSortBySorting > 0 ? false : true,
                  (a) =>
                    typeof a == 'boolean' || typeof a == 'number'
                      ? a
                      : a.toUpperCase()
                )
              ),
              valuesPerPage,
              valuesPageNumber
            ),
          });
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
            res.status(200).json({
              success: true,
              totalValuesLength: value.length,
              data: paginate(
                value.sort(
                  sort_by(
                    [req.body['valuesSortByField']],
                    valuesSortBySorting > 0 ? false : true,
                    (a) =>
                      typeof a == 'boolean' || typeof a == 'number'
                        ? a
                        : a.toUpperCase()
                  )
                ),
                valuesPerPage,
                valuesPageNumber
              ),
            });
          }
        } else {
          const valuesList = await collection.aggregate([
            { $unwind: '$states' },
            { $unwind: '$states.cities' },
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
            { $group: { _id: null, cities: { $push: '$states.cities' } } },
            { $project: { _id: 1, cities: '$cities' } },
          ]);
          if (valuesList.length > 0) {
            const cities = valuesList[0].cities;
            await multiMap.put(`allCities`, cities);
            res.status(200).json({
              success: true,
              totalValuesLength: cities.length,
              data: paginate(
                cities.sort(
                  sort_by(
                    [req.body['valuesSortByField']],
                    valuesSortBySorting > 0 ? false : true,
                    (a) =>
                      typeof a == 'boolean' || typeof a == 'number'
                        ? a
                        : a.toUpperCase()
                  )
                ),
                valuesPerPage,
                valuesPageNumber
              ),
            });
          } else {
            res
              .status(200)
              .json({ success: true, totalValuesLength: 0, data: [] });
          }
        }
        await hz.shutdown();
      }
    } catch (error) {
      res.status(500).json({ success: false, Error: error.toString() });
    }
  }
});

export default apiRoute;
