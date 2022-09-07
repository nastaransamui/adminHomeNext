const nextConnect = require('next-connect');
import dbConnect from '../../../helpers/dbConnect';
import verifyToken from '../../../helpers/verifyToken';
import hazelCast from '../../../helpers/hazelCast';
import mongoose from 'mongoose';
import Countries from '../../../models/Countries';
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
    country_id,
  } = req.body;
  const { success } = dbConnected;
  if (!success) {
    res.status(500).json({ success: false, Error: dbConnected.error });
  } else {
    const { hzErrorConnection, hz } = await hazelCast();
    try {
      var collection = mongoose.model(modelName);
      collection.findById(country_id, async (err, docs) => {
        const { Error, success } = involvedError(docs);
        // if involved return from function send error to client
        if (!success) {
          res.status(500).json({ success: false, Error: Error });
        } else {
          // Request come from all countries
          // await docs.remove();
          docs.isCountryActive = false;
          docs.save(async (err, result) => {
            if (err) {
              res.status(403).json({
                success: false,
                Error: err.toString(),
                ErrorCode: err?.code,
              });
            }
            if (typeof data._id == 'number') {
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
              var activesIds = await collection.find(
                { isCountryActive: true },
                { _id: true, id: true }
              );
              let orderCountryByActivation = data.sort((a, b) => {
                if (activesIds.findIndex((p) => p.id === b.id) !== -1)
                  b.isCountryActive = true;
                if (activesIds.findIndex((p) => p.id === a.id) !== -1)
                  a.isCountryActive = true;
                return (
                  activesIds.findIndex((p) => p.id === b.id) -
                  activesIds.findIndex((p) => p.id === a.id)
                );
              });
              if (!hzErrorConnection) {
                const multiMap = await hz.getMultiMap(modelName);
                const multiMapPr = await hz.getMultiMap('Provinces');
                await multiMap.destroy();
                await multiMapPr.destroy();
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
                  { $unset: ['states', 'hotels_id', 'users_id', 'agents_id'] },
                ]);
                await multiMap.put(`all${modelName}`, valuesList);
                await hz.shutdown();
              }
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
            } else {
              // Request come from Active countries
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
                  { $unset: ['states', 'hotels_id', 'users_id', 'agents_id'] },
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
                const multiMapPr = await hz.getMultiMap('Provinces');
                await multiMap.destroy();
                await multiMapPr.destroy();
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
                  { $unset: ['states', 'hotels_id', 'users_id', 'agents_id'] },
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
                await hz.shutdown();
              }
            }
          });
        }
      });
    } catch (error) {
      if (!hzErrorConnection) {
        await hz.shutdown();
      }

      res.status(500).json({ success: false, Error: error.toString() });
    }
  }
});

function involvedError(result) {
  //Check if country involve in user and agent
  const isCountryInvolved =
    result?.users_id?.length > 0 ||
    result?.agents_id?.length > 0 ||
    result?.hotels_id?.length > 0 ||
    result.isHotelsActive;

  // Check if state involve in user and agent
  const stateInvolved = result?.states.filter(
    (a) =>
      a.users_id?.length > 0 ||
      a.agents_id?.length > 0 ||
      a.hotels_id?.length > 0 ||
      result.isHotelsActive
  );
  const isStateInvolved = stateInvolved.length > 0;
  // Check if cities involve in user and agent
  const statesThatCitiesInvolve = result?.states.filter((s) => {
    let opt = s.cities.some(
      (a) =>
        a.users_id?.length > 0 ||
        a.agents_id?.length > 0 ||
        a.hotels_id?.length > 0 ||
        result.isHotelsActive
    );
    return opt;
  });
  const citiesInvolved = statesThatCitiesInvolve
    .map((a) =>
      a.cities.filter(
        (a) =>
          a.users_id?.length > 0 ||
          a.agents_id?.length > 0 ||
          a.hotels_id?.length > 0 ||
          result.isHotelsActive
      )
    )
    .flat(1);
  const isCitiesInvolved = citiesInvolved.length > 0;
  if (isCountryInvolved || isStateInvolved || isCitiesInvolved) {
    return {
      success: false,
      Error: `${
        result?.users_id?.length > 0
          ? `${result?.users_id?.length} uer(s) is/are involved with ${
              result?.name
            } ${
              isStateInvolved
                ? `, ${stateInvolved.map((a) =>
                    a.users_id?.length > 0
                      ? `${a.name} state is involved with ${a.users_id?.length} user(s) `
                      : ``
                  )}  `
                : ``
            } ${
              isCitiesInvolved
                ? ` ${citiesInvolved.map((a) =>
                    a.users_id?.length > 0
                      ? `${a.name} city is involved with ${a.users_id?.length} user(s)`
                      : ``
                  )} `
                : ``
            }`
          : ''
      } ${
        result?.agents_id?.length > 0
          ? `${result?.agents_id?.length} agent(s) is/are involved with ${
              result?.name
            } ${
              isStateInvolved
                ? `, ${stateInvolved.map((a) =>
                    a.agents_id?.length > 0
                      ? `${a.name} state is involved with ${a.agents_id?.length} agent(s) `
                      : ``
                  )}  `
                : ``
            } ${
              isCitiesInvolved
                ? ` ${citiesInvolved.map((a) =>
                    a.agents_id?.length > 0
                      ? `${a.name} city is involved with ${a.agents_id?.length} agent(s)`
                      : ``
                  )} `
                : ``
            }`
          : ''
      } ${
        result?.hotels_id?.length > 0
          ? `${result?.hotels_id?.length} hotel(s) is/are involved with ${
              result?.name
            } ${
              isStateInvolved
                ? `, ${stateInvolved.map((a) =>
                    a.hotels_id?.length > 0
                      ? `${a.name} state is involved with ${a.hotels_id?.length} hotel(s) `
                      : ``
                  )}  `
                : ``
            } ${
              isCitiesInvolved
                ? ` ${citiesInvolved.map((a) =>
                    a.hotels_id?.length > 0
                      ? `${a.name} city is involved with ${a.hotels_id?.length} hotel(s)`
                      : ``
                  )} `
                : ``
            }`
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
