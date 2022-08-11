const nextConnect = require('next-connect');
import dbConnect from '../../../helpers/dbConnect';
import verifyToken from '../../../helpers/verifyToken';
import hazelCast from '../../../helpers/hazelCast';
import mongoose from 'mongoose';
import fs from 'fs';
import axios from 'axios';
import Hotels from '../../../models/Hotels';
import Accommodationnull from '../../../models/Accommodationnull';
import Countries from '../../../models/Countries';

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
        activesIds.findIndex((p) => p._id[field] === b[field]) == -1 ||
        activesIds.findIndex((p) => p._id[field] === a[field]) == -1
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
    try {
      const {
        valuesPerPage,
        valuesPageNumber,
        valuesSortBySorting,
        modelName,
      } = req.body;
      //Initiate catch HZ adn if Error continue with MONGO DB
      const { hzErrorConnection, hz } = await hazelCast();
      let activesId = await Countries.aggregate([
        { $match: { $and: [{ isHotelsActive: true }] } },
        {
          $group: {
            _id: { iso2: '$iso2', title_en: '$name' },
          },
        },
      ]);
      if (hzErrorConnection) {
        axios
          .get(`${process.env.NEXT_PUBLIC_API_LINK}/hotels/list`)
          // .get(`http://192.168.1.116:3000/api/hotels/list`)
          .then(async (resp) => {
            resp.data.data.sort((a, b) => {
              if (valuesSortBySorting > 0) {
                return a[req.body['valuesSortByField']] >
                  b[req.body['valuesSortByField']]
                  ? 1
                  : b[req.body['valuesSortByField']] >
                    a[req.body['valuesSortByField']]
                  ? -1
                  : 0;
              } else {
                return b[req.body['valuesSortByField']] >
                  a[req.body['valuesSortByField']]
                  ? 1
                  : a[req.body['valuesSortByField']] >
                    b[req.body['valuesSortByField']]
                  ? -1
                  : 0;
              }
            });
            let orderCountryByActivation = resp.data.data.sort((a, b) => {
              return (
                activesId.findIndex(
                  (p) =>
                    p._id[req.body['valuesSortByField']] ===
                    b[req.body['valuesSortByField']]
                ) -
                activesId.findIndex(
                  (p) =>
                    p._id[req.body['valuesSortByField']] ===
                    a[req.body['valuesSortByField']]
                )
              );
            });
            res.status(200).json({
              success: true,
              totalValuesLength: resp.data.data.length,
              activesId: activesId,
              data: paginate(
                orderCountryByActivation.sort(
                  sort_by(
                    [req.body['valuesSortByField']],
                    valuesSortBySorting > 0 ? false : true,
                    (a) => {
                      if (a !== undefined) {
                        return (
                          typeof a == 'boolean' || typeof a == 'number'
                            ? a
                            : a.toUpperCase(),
                          activesId
                        );
                      }
                    }
                  )
                ),
                valuesPerPage,
                valuesPageNumber
              ),
            });
          });
      } else {
        // use Catch system with Hz
        const multiMap = await hz.getMultiMap(modelName);
        const dataIsExist = await multiMap.containsKey(`all${modelName}`);
        if (dataIsExist) {
          const values = await multiMap.get(`all${modelName}`);
          for (const value of values) {
            value.sort((a, b) => {
              if (valuesSortBySorting > 0) {
                return a[req.body['valuesSortByField']] >
                  b[req.body['valuesSortByField']]
                  ? 1
                  : b[req.body['valuesSortByField']] >
                    a[req.body['valuesSortByField']]
                  ? -1
                  : 0;
              } else {
                return b[req.body['valuesSortByField']] >
                  a[req.body['valuesSortByField']]
                  ? 1
                  : a[req.body['valuesSortByField']] >
                    b[req.body['valuesSortByField']]
                  ? -1
                  : 0;
              }
            });
            let orderCountryByActivation = value.sort((a, b) => {
              return (
                activesId.findIndex(
                  (p) =>
                    p._id[req.body['valuesSortByField']] ===
                    b[req.body['valuesSortByField']]
                ) -
                activesId.findIndex(
                  (p) =>
                    p._id[req.body['valuesSortByField']] ===
                    a[req.body['valuesSortByField']]
                )
              );
            });

            res.status(200).json({
              success: true,
              totalValuesLength: value.length,
              activesId: activesId,
              data: paginate(
                orderCountryByActivation.sort(
                  sort_by(
                    [req.body['valuesSortByField']],
                    valuesSortBySorting > 0 ? false : true,
                    (a) => {
                      if (a !== undefined) {
                        return (
                          typeof a == 'boolean' || typeof a == 'number'
                            ? a
                            : a.toUpperCase(),
                          activesId
                        );
                      }
                    }
                  )
                ),
                valuesPerPage,
                valuesPageNumber
              ),
            });
          }
          await hz.shutdown();
        } else {
          axios
            .get(`${process.env.NEXT_PUBLIC_API_LINK}/hotels/list`)
            // .get(`http://192.168.1.116:3000/api/hotels/list`)
            .then(async (resp) => {
              await multiMap.put(`all${modelName}`, resp.data.data);
              resp.data.data.sort((a, b) => {
                if (valuesSortBySorting > 0) {
                  return a[req.body['valuesSortByField']] >
                    b[req.body['valuesSortByField']]
                    ? 1
                    : b[req.body['valuesSortByField']] >
                      a[req.body['valuesSortByField']]
                    ? -1
                    : 0;
                } else {
                  return b[req.body['valuesSortByField']] >
                    a[req.body['valuesSortByField']]
                    ? 1
                    : a[req.body['valuesSortByField']] >
                      b[req.body['valuesSortByField']]
                    ? -1
                    : 0;
                }
              });
              let orderCountryByActivation = resp.data.data.sort((a, b) => {
                return (
                  activesId.findIndex(
                    (p) =>
                      p._id[req.body['valuesSortByField']] ===
                      b[req.body['valuesSortByField']]
                  ) -
                  activesId.findIndex(
                    (p) =>
                      p._id[req.body['valuesSortByField']] ===
                      a[req.body['valuesSortByField']]
                  )
                );
              });

              res.status(200).json({
                success: true,
                totalValuesLength: resp.data.data.length,
                activesId: activesId,
                data: paginate(
                  orderCountryByActivation.sort(
                    sort_by(
                      [req.body['valuesSortByField']],
                      valuesSortBySorting > 0 ? false : true,
                      (a) => {
                        if (a !== undefined) {
                          return (
                            typeof a == 'boolean' || typeof a == 'number'
                              ? a
                              : a.toUpperCase(),
                            activesId
                          );
                        }
                      }
                    )
                  ),
                  valuesPerPage,
                  valuesPageNumber
                ),
              });
              await hz.shutdown();
            });
        }
      }
    } catch (error) {
      res.status(500).json({ success: false, Error: error.toString() });
    }
  }
});

export default apiRoute;
