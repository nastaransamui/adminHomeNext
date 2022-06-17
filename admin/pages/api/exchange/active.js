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
    valuesSortBySorting,
    modelName,
    fileName,
    country_id,
  } = req.body;
  const { success } = dbConnected;
  if (!success) {
    res.status(500).json({ success: false, Error: dbConnected.error });
  } else {
    try {
      var collection = mongoose.model(modelName);
      const fileToRead = `${process.cwd()}/public/locationsData/${fileName}`;
      let rawdata = fs.readFileSync(fileToRead);
      let data = JSON.parse(rawdata).filter(function (entry) {
        delete entry._id;
        return entry.id === country_id;
      })[0];
      const newValue = await new collection(data);
      const { hzErrorConnection, hz } = await hazelCast();
      await newValue.save(async (err, result) => {
        if (err) {
          res.status(403).json({
            success: false,
            Error: err.toString(),
            ErrorCode: err?.code,
          });
        } else {
          const fileToRead = `${process.cwd()}/public/locationsData/${fileName}`;
          let rawdata = fs.readFileSync(fileToRead);
          let data = JSON.parse(rawdata);
          var activesIds = await collection.find({}, { _id: true, id: true });
          if (!hzErrorConnection) {
            const multiMap = await hz.getMultiMap(modelName);
            await multiMap.destroy();
            const valuesList = await collection.find({});
            await multiMap.put(`all${modelName}`, valuesList);
            await hz.shutdown();
          }
          res.status(200).json({
            success: true,
            totalValuesLength: data.length,
            activesId: activesIds,
            data: paginate(
              data.sort(
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
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, Error: error.toString() });
    }
  }
});

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb', // Set desired value here
    },
  },
};

export default apiRoute;
