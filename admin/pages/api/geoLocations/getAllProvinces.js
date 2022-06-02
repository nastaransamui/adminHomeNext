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

          {
            $addFields: {
              'states.country': '$name',
              'states.emoji': '$emoji',
              'states.iso2': '$iso2',
              'states.countryId': '$id',
              'states.country_id': '$_id',
              'states.totalCities': { $size: '$states.cities' },
            },
          },
          { $unset: 'states.cities' },
          { $group: { _id: null, provinces: { $push: '$states' } } },
          { $project: { _id: 1, provinces: '$provinces' } },
        ]);
        if (valuesList.length > 0) {
          const provinces = valuesList[0].provinces;
          console.log(provinces);
          res.status(200).json({
            success: true,
            totalValuesLength: provinces.length,
            data: paginate(
              provinces.sort(
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
        const multiMap = await hz.getMultiMap('Provinces');
        // await multiMap.destroy();
        const dataIsExist = await multiMap.containsKey(`allProvinces`);

        if (dataIsExist) {
          const values = await multiMap.get(`allProvinces`);
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

            {
              $addFields: {
                'states.country': '$name',
                'states.emoji': '$emoji',
                'states.iso2': '$iso2',
                'states.countryId': '$id',
                'states.country_id': '$_id',
                'states.totalCities': { $size: '$states.cities' },
              },
            },
            { $unset: 'states.cities' },
            { $group: { _id: null, provinces: { $push: '$states' } } },
            { $project: { _id: 1, provinces: '$provinces' } },
          ]);
          if (valuesList.length > 0) {
            const provinces = valuesList[0].provinces;
            await multiMap.put(`allProvinces`, provinces);
            res.status(200).json({
              success: true,
              totalValuesLength: provinces.length,
              data: paginate(
                provinces.sort(
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
