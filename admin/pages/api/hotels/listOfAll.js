const nextConnect = require('next-connect');
import dbConnect from '../../../helpers/dbConnect';
import verifyToken from '../../../helpers/verifyToken';
import hazelCast from '../../../helpers/hazelCast';
import mongoose from 'mongoose';
import fs from 'fs';
import axios from 'axios';
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
        fileName,
      } = req.body;
      //Initiate catch HZ adn if Error continue with MONGO DB
      const { hzErrorConnection, hz } = await hazelCast();
      if (hzErrorConnection) {
        axios
          .get(`${process.env.NEXT_PUBLIC_API_LINK}/hotels/list`)
          .then((resp) => {
            res.status(200).json({
              success: true,
              totalValuesLength: resp.data.data.length,
              activesId: [],
              data: paginate(
                resp.data.data.sort(
                  sort_by(
                    [req.body['valuesSortByField']],
                    valuesSortBySorting > 0 ? false : true,
                    (a) => {
                      if (a !== undefined) {
                        return typeof a == 'boolean' || typeof a == 'number'
                          ? a
                          : a.toUpperCase();
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
            res.status(200).json({
              success: true,
              totalValuesLength: value.length,
              activesId: [],
              data: paginate(
                value.sort(
                  sort_by(
                    [req.body['valuesSortByField']],
                    valuesSortBySorting > 0 ? false : true,
                    (a) => {
                      if (a !== undefined) {
                        return typeof a == 'boolean' || typeof a == 'number'
                          ? a
                          : a.toUpperCase();
                      }
                    }
                  )
                ),
                valuesPerPage,
                valuesPageNumber
              ),
            });
          }
        } else {
          axios
            .get(`${process.env.NEXT_PUBLIC_API_LINK}/hotels/list`)
            .then(async (resp) => {
              await multiMap.put(`all${modelName}`, resp.data.data);
              res.status(200).json({
                success: true,
                totalValuesLength: resp.data.data.length,
                activesId: [],
                data: paginate(
                  resp.data.data.sort(
                    sort_by(
                      [req.body['valuesSortByField']],
                      valuesSortBySorting > 0 ? false : true,
                      (a) => {
                        if (a !== undefined) {
                          return typeof a == 'boolean' || typeof a == 'number'
                            ? a
                            : a.toUpperCase();
                        }
                      }
                    )
                  ),
                  valuesPerPage,
                  valuesPageNumber
                ),
              });
            });
        }
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, Error: error.toString() });
    }
  }
});

export default apiRoute;
