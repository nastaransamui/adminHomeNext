const nextConnect = require('next-connect');
import dbConnect from '../../../helpers/dbConnect';
import verifyToken from '../../../helpers/verifyToken';
import hazelCast from '../../../helpers/hazelCast';
import mongoose from 'mongoose';
import Countries from '../../../models/Countries';
import fs from 'fs';
import { firstLevelSort } from '../hotels/active';

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
      let singleCountry = JSON.parse(rawdata).filter(function (entry) {
        delete entry._id;
        return entry.id === country_id;
      })[0];
      const newValue = await new collection(singleCountry);
      const { hzErrorConnection, hz } = await hazelCast();
      await newValue.save(async (err, result) => {
        if (err) {
          res.status(403).json({
            success: false,
            Error: err.toString(),
            ErrorCode: err?.code,
          });
        }
        let data = JSON.parse(rawdata);
        data.map((doc) => {
          doc.totalStates = doc.states.length;
          doc.totalActiveHotels = 0;
          doc.totalUsers = 0;
          doc.totalAgents = 0;
          doc.isHotelsActive = false;
          delete doc.states;
          return doc;
        });
        var activesIds = await collection.find({}, { _id: true, id: true });
        const firstSort = firstLevelSort(data, valuesSortBySorting, req);
        let orderCountryByActivation = firstSort.sort((a, b) => {
          return (
            activesIds.findIndex((p) => p.id === b.id) -
            activesIds.findIndex((p) => p.id === a.id)
          );
        });
        if (!hzErrorConnection) {
          const countryMultiMap = await hz.getMultiMap(modelName);
          const provinceMultiMap = await hz.getMultiMap('Provinces');
          const citiesMultiMap = await hz.getMultiMap('Cities');
          await countryMultiMap.destroy();
          await provinceMultiMap.destroy();
          await citiesMultiMap.destroy();
          const valuesList = await collection.aggregate([
            {
              $addFields: {
                totalStates: { $size: '$states' },
                totalActiveHotels: { $size: '$hotels_id' },
                totalUsers: { $size: '$users_id' },
                totalAgents: { $size: '$agents_id' },
              },
            },
            { $unset: ['states', 'hotels_id', 'users_id', 'agents_id'] },
          ]);
          await countryMultiMap.put(`all${modelName}`, valuesList);
          await hz.shutdown();
        }
        res.status(200).json({
          success: true,
          totalValuesLength: 1,
          activesId: [],
          data: [],
        });
        // res.status(200).json({
        //   success: true,
        //   totalValuesLength: data.length,
        //   activesId: activesIds,
        //   data: paginate(
        //     orderCountryByActivation.sort(
        //       sort_by(
        //         [req.body['valuesSortByField']],
        //         valuesSortBySorting > 0 ? false : true,
        //         (a) => (typeof a == 'boolean' ? a : a.toUpperCase()),
        //         activesIds
        //       )
        //     ),
        //     valuesPerPage,
        //     valuesPageNumber
        //   ),
        // });
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
