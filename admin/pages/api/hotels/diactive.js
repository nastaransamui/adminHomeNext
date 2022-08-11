const nextConnect = require('next-connect');
import dbConnect from '../../../helpers/dbConnect';
import verifyToken from '../../../helpers/verifyToken';
import hazelCast from '../../../helpers/hazelCast';
import Hotels from '../../../models/Hotels';
import Countries from '../../../models/Countries';
import axios from 'axios';

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

const isVercel = process.env.NEXT_PUBLIC_SERVERLESS == 'true' ? true : false;

apiRoute.post(verifyToken, async (req, res, next) => {
  const dbConnected = await dbConnect();
  const {
    data,
    modelName,
    valuesPerPage,
    valuesPageNumber,
    valuesSortByField,
    valuesSortBySorting,
  } = req?.body;
  const { iso2, hotelReady, hotelNotComplete } = data;
  const hotelsUrl = `${process.env.NEXT_PUBLIC_API_LINK}/hotels/${iso2.charAt(
    0
  )}/${iso2}`;
  const { success } = dbConnected;
  if (!success) {
    res.status(500).json({ success: false, Error: dbConnected.error });
  } else {
    try {
      const { hzErrorConnection, hz } = await hazelCast();
      await updateCountry(iso2, false);
      await hotelsUpdateMany(iso2, false);
      const activesId = await findActiveIds();
      if (hzErrorConnection) {
        axios
          .get(`${process.env.NEXT_PUBLIC_API_LINK}/hotels/list`)
          // .get(`http://192.168.1.116:3000/api/hotels/list`)
          .then(async (resp) => {
            const firstSort = firstLevelSort(
              resp.data.data,
              valuesSortBySorting,
              req
            );
            let orderCountryByActivation = activeElementSort(
              firstSort,
              activesId,
              req
            );
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
        const hotelsListMap = await hz.getMultiMap(modelName);
        const hotelDataListIsExist = await hotelsListMap.containsKey(
          `all${modelName}`
        );
        const multiMapc = await hz.getMultiMap('Countries');
        const multiMapPr = await hz.getMultiMap('Provinces');
        const multiMapCt = await hz.getMultiMap('Cities');
        const hotelNullMap = await hz.getMultiMap('NullHotels');
        const hotelMap = await hz.getMultiMap('Hotels');

        await multiMapc.destroy();
        await multiMapPr.destroy();
        await multiMapCt.destroy();
        await hotelNullMap.destroy();
        await hotelMap.destroy();
        if (hotelDataListIsExist) {
          const values = await hotelsListMap.get(`all${modelName}`);
          for (const value of values) {
            const firstSort = firstLevelSort(value, valuesSortBySorting, req);
            let orderCountryByActivation = activeElementSort(
              firstSort,
              activesId,
              req
            );
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
        }
        await hz.shutdown();
      }
    } catch (error) {
      res.status(500).json({ success: false, Error: error.toString() });
    }
  }
});

async function findActiveIds() {
  const activesId = await Countries.aggregate([
    { $match: { $and: [{ isHotelsActive: true }] } },
    {
      $group: {
        _id: { iso2: '$iso2', title_en: '$name' },
      },
    },
  ]);
  return activesId;
}

async function hotelsUpdateMany(iso2, status) {
  await Hotels.updateMany({ countryIso2: iso2 }, { isActive: status });
}

async function updateCountry(iso2, status) {
  await Countries.updateOne(
    { iso2: iso2 },
    { $set: { isHotelsActive: status } }
  );
}

function firstLevelSort(arr, valuesSortBySorting, req) {
  arr.sort((a, b) => {
    if (valuesSortBySorting > 0) {
      return a[req.body['valuesSortByField']] > b[req.body['valuesSortByField']]
        ? 1
        : b[req.body['valuesSortByField']] > a[req.body['valuesSortByField']]
        ? -1
        : 0;
    } else {
      return b[req.body['valuesSortByField']] > a[req.body['valuesSortByField']]
        ? 1
        : a[req.body['valuesSortByField']] > b[req.body['valuesSortByField']]
        ? -1
        : 0;
    }
  });
  return arr;
}

function activeElementSort(arr, activesId, req) {
  arr.sort((a, b) => {
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
  return arr;
}

export default apiRoute;
