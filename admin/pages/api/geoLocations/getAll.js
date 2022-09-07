const nextConnect = require('next-connect');
import fs from 'fs';
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

const sort_by = (field, reverse, primer, activesIds) => {
  if (activesIds !== undefined) {
    const key = primer
      ? function (x) {
          return primer(x[field]);
        }
      : function (x) {
          return x[field];
        };

    reverse = !reverse ? 1 : -1;
    return function (a, b) {
      if (
        activesIds.findIndex((p) => p.id === b.id) == -1 ||
        activesIds.findIndex((p) => p.id === a.id) == -1
      )
        return 1;
      return (a = key(a)), (b = key(b)), reverse * ((a > b) - (b > a));
    };
  } else {
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
  }
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
    //Initiate catch HZ adn if Error continue with MONGO DB
    const { hzErrorConnection, hz } = await hazelCast();
    try {
      const {
        valuesPerPage,
        valuesPageNumber,
        locale,
        valuesSortBySorting,
        modelName,
        fileName,
      } = req.body;
      if (fileName !== undefined) {
        try {
          const fileToRead = `${process.cwd()}/public/locationsData/${fileName}`;
          let rawdata = fs.readFileSync(fileToRead);
          let data = JSON.parse(rawdata);
          data.map((doc) => {
            doc.totalStates = doc.states.length;
            doc.totalActiveHotels = 0;
            doc.totalUsers = 0;
            doc.totalAgents = 0;
            doc.isHotelsActive = false;
            doc.isCountryActive = false;
            delete doc.states;
            return doc;
          });
          var collection = mongoose.model(modelName);
          var activesIds = await collection.find(
            { isCountryActive: true },
            { _id: true, id: true, isHotelsActive: true }
          );
          let orderCountryByActivation = data.sort((a, b) => {
            if (activesIds.findIndex((p) => p.id === b.id) !== -1) {
              b.isCountryActive = true;
              b.isHotelsActive =
                activesIds[
                  activesIds.findIndex((p) => p.id === b.id)
                ].isHotelsActive;
            }

            if (activesIds.findIndex((p) => p.id === a.id) !== -1) {
              a.isCountryActive = true;
              a.isHotelsActive =
                activesIds[
                  activesIds.findIndex((p) => p.id === a.id)
                ].isHotelsActive;
            }
            return (
              activesIds.findIndex((p) => p.id === b.id) -
              activesIds.findIndex((p) => p.id === a.id)
            );
          });
          res.status(200).json({
            success: true,
            totalValuesLength: orderCountryByActivation.length,
            activesId: activesIds,
            data: paginate(
              orderCountryByActivation.sort(
                sort_by(
                  [req.body['valuesSortByField']],
                  valuesSortBySorting > 0 ? false : true,
                  (a) =>
                    typeof a == 'boolean' || typeof a == 'number'
                      ? a
                      : a.toUpperCase(),
                  activesIds
                )
              ),
              valuesPerPage,
              valuesPageNumber
            ),
          });
          if (!hzErrorConnection) {
            await hz.shutdown();
          }
        } catch (error) {
          if (!hzErrorConnection) {
            await hz.shutdown();
          }
          res.status(500).json({ success: false, Error: error.toString() });
        }
      } else {
        try {
          var collection = mongoose.model(modelName);
          if (hzErrorConnection) {
            const valuesList = await collection.aggregate([
              { $match: { isCountryActive: true } },
              {
                $addFields: {
                  totalStates: { $size: '$states' },
                  totalActiveHotels: { $size: '$hotels_id' },
                  totalUsers: { $size: '$users_id' },
                  totalAgents: { $size: '$agents_id' },
                },
              },
              { $unset: ['states'] },
            ]);
            res.status(200).json({
              success: true,
              totalValuesLength: valuesList.length,
              data: paginate(
                valuesList.sort(
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
            // use Catch system with Hz
            const multiMap = await hz.getMultiMap(modelName);
            // await multiMap.destroy();
            const dataIsExist = await multiMap.containsKey(`all${modelName}`);
            if (dataIsExist) {
              const values = await multiMap.get(`all${modelName}`);
              for (const value of values) {
                const activeCountry = value.filter((a) => a.isCountryActive);
                res.status(200).json({
                  success: true,
                  totalValuesLength: activeCountry.length,
                  data: paginate(
                    activeCountry.sort(
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
              await hz.shutdown();
            } else {
              const valuesList = await collection.aggregate([
                { $match: { isCountryActive: true } },
                {
                  $addFields: {
                    totalStates: { $size: '$states' },
                    totalActiveHotels: { $size: '$hotels_id' },
                    totalUsers: { $size: '$users_id' },
                    totalAgents: { $size: '$agents_id' },
                  },
                },
                { $unset: ['states'] },
              ]);
              await multiMap.put(`all${modelName}`, valuesList);
              res.status(200).json({
                success: true,
                totalValuesLength: valuesList.length,
                data: paginate(
                  valuesList.sort(
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
            await hz.shutdown();
          }
        } catch (error) {
          if (!hzErrorConnection) {
            await hz.shutdown();
          }
          res.status(500).json({ success: false, Error: error.toString() });
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
