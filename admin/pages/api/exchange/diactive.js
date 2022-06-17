const nextConnect = require('next-connect');
import dbConnect from '../../../helpers/dbConnect';
import verifyToken from '../../../helpers/verifyToken';
import hazelCast from '../../../helpers/hazelCast';
import mongoose from 'mongoose';
import Currencies from '../../../models/Currencies';
import fs from 'fs';

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
  const {
    valuesPerPage,
    valuesPageNumber,
    valuesSortBySorting,
    modelName,
    fileName,
    data,
    country_id: currency_id,
  } = req.body;
  const { success } = dbConnected;
  if (!success) {
    res.status(500).json({ success: false, Error: dbConnected.error });
  } else {
    try {
      var collection = mongoose.model(modelName);
      const { hzErrorConnection, hz } = await hazelCast();
      collection.findById(currency_id, async (err, docs) => {
        const { Error, success } = involvedError(docs);
        // if involved return from function send error to client
        if (!success) {
          res.status(403).json({ success: false, Error: Error });
        } else {
          // Request come from all currencies
          await docs.remove();
          if (typeof data._id == 'number') {
            // Request come from all Currencies
            const fileToRead = `${process.cwd()}/public/locationsData/${fileName}`;
            let rawdata = fs.readFileSync(fileToRead);
            let data = JSON.parse(rawdata);
            var activesIds = await collection.find({}, { _id: true, id: true });
            let orderCurrencyByActivation = data.sort((a, b) => {
              return (
                activesIds.findIndex((p) => p.id === b.id) -
                activesIds.findIndex((p) => p.id === a.id)
              );
            });
            if (!hzErrorConnection) {
              const multiMap = await hz.getMultiMap(modelName);
              await multiMap.destroy();
              const valuesList = await collection.find({});
              await multiMap.put(`all${modelName}`, valuesList);
              await hz.shutdown();
            }
            res.status(200).json({
              success: true,
              totalValuesLength: orderCurrencyByActivation.length,
              activesId: activesIds,
              data: paginate(
                orderCurrencyByActivation.sort(
                  sort_by(
                    [req.body['valuesSortByField']],
                    valuesSortBySorting > 0 ? false : true,
                    (a) => (typeof a == 'boolean' ? a : a.toUpperCase()),
                    activesIds
                  )
                ),
                valuesPerPage,
                valuesPageNumber
              ),
            });
          } else {
            // Request come from Active Currencies
            if (hzErrorConnection) {
              const valuesList = await collection.find({});
              res.status(200).json({
                success: true,
                totalValuesLength: valuesList.length,
                data: paginate(
                  valuesList.sort(
                    sort_by(
                      [req.body['valuesSortByField']],
                      valuesSortBySorting > 0 ? false : true,
                      (a) => (typeof a == 'boolean' ? a : a.toUpperCase())
                    )
                  ),
                  valuesPerPage,
                  valuesPageNumber
                ),
              });
            } else {
              // use Catch system with Hz
              const multiMap = await hz.getMultiMap(modelName);
              await multiMap.destroy();
              const valuesList = await collection.find({});

              await multiMap.put(`all${modelName}`, valuesList);
              res.status(200).json({
                success: true,
                totalValuesLength: valuesList.length,
                data: paginate(
                  valuesList.sort(
                    sort_by(
                      [req.body['valuesSortByField']],
                      valuesSortBySorting > 0 ? false : true,
                      (a) => (typeof a == 'boolean' ? a : a.toUpperCase())
                    )
                  ),
                  valuesPerPage,
                  valuesPageNumber
                ),
              });
              await hz.shutdown();
            }
          }
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, Error: error.toString() });
    }
  }
});

function involvedError(result) {
  //Check if currency involve in user and agent
  const isCurrencyInvolved = result?.agents_id?.length > 0;

  if (isCurrencyInvolved) {
    return {
      success: false,
      Error: `${
        result?.agents_id?.length > 0
          ? `${result?.agents_id?.length} agent(s) is/are involved with ${result?.currency_name} `
          : ''
      }`,
    };
  } else {
    return {
      success: true,
      Error: null,
    };
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb', // Set desired value here
    },
  },
};

export default apiRoute;
