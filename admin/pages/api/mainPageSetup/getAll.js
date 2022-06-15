const nextConnect = require('next-connect');

import dbConnect from '../../../helpers/dbConnect';
import verifyToken from '../../../helpers/verifyToken';
import hazelCast from '../../../helpers/hazelCast';
import mongoose from 'mongoose';
import Videos from '../../../models/Videos';
import Users from '../../../models/Users';
import Photos from '../../../models/Photos';
import Features from '../../../models/Features';
import Agencies from '../../../models/Agencies';

const { faker } = require('@faker-js/faker');
//Username case to lower case

var ObjectId = require('mongodb').ObjectID;
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
  const {
    valuesPerPage,
    valuesPageNumber,
    locale,
    valuesSortBySorting,
    modelName,
  } = req.body;
  const { success } = dbConnected;
  if (!success) {
    res.status(500).json({ success: false, Error: dbConnected.error });
  } else {
    const forwarded = req.headers['x-forwarded-for'];

    const ip =
      typeof forwarded === 'string'
        ? forwarded.split(/, /)[0]
        : req.socket.remoteAddress;

    console.log(ip);
    try {
      //Initiate catch HZ adn if Error continue with MONGO DB
      const { hzErrorConnection, hz } = await hazelCast();
      var collection = mongoose.model(modelName);
      if (hzErrorConnection) {
        switch (modelName) {
          case 'Agencies':
            const agentValue = await collection.aggregate([
              { $match: {} },
              {
                $sort: { [req.body['valuesSortByField']]: valuesSortBySorting },
              },
            ]);
            res.status(200).json({
              success: true,
              totalValuesLength: agentValue.length,
              data: paginate(agentValue, valuesPerPage, valuesPageNumber),
            });
            break;

          default:
            const defaultValuesList = await collection
              .find({})
              .select('-password')
              .collation({ locale: locale })
              .sort({ [req.body['valuesSortByField']]: valuesSortBySorting });
            res.status(200).json({
              success: true,
              totalValuesLength: defaultValuesList.length,
              data: paginate(
                defaultValuesList,
                valuesPerPage,
                valuesPageNumber
              ),
            });
            break;
        }
      } else {
        // use Catch system with Hz
        const multiMap = await hz.getMultiMap(modelName);
        // await multiMap.destroy();

        const dataIsExist = await multiMap.containsKey(`all${modelName}`);
        if (dataIsExist) {
          const values = await multiMap.get(`all${modelName}`);
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
          switch (modelName) {
            case 'Agencies':
              const agentValue = await collection.aggregate([
                { $match: {} },
                {
                  $sort: {
                    [req.body['valuesSortByField']]: valuesSortBySorting,
                  },
                },
              ]);
              await multiMap.put(`all${modelName}`, agentValue);
              res.status(200).json({
                success: true,
                totalValuesLength: agentValue.length,
                data: paginate(agentValue, valuesPerPage, valuesPageNumber),
              });
              break;
            default:
              const valuesList = await collection
                .find({})
                .select('-password')
                .collation({ locale: locale })
                .sort({ [req.body['valuesSortByField']]: valuesSortBySorting });
              await multiMap.put(`all${modelName}`, valuesList);
              res.status(200).json({
                success: true,
                totalValuesLength: valuesList.length,
                data: paginate(valuesList, valuesPerPage, valuesPageNumber),
              });
              break;
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
