const nextConnect = require('next-connect');

import dbConnect from '../../../helpers/dbConnect';
import verifyToken from '../../../helpers/verifyToken';
import { MultifileMiddlewareDelete } from '../../../middleware/multifileMiddleware';
import hazelCast from '../../../helpers/hazelCast';
import mongoose from 'mongoose';
import Videos from '../../../models/Videos';
import Users from '../../../models/Users';
import Photos from '../../../models/Photos';
import Countries from '../../../models/Countries';
import Currencies from '../../../models/Currencies';
import Agencies from '../../../models/Agencies';
import Roles from '../../../models/Roles';

const apiRoute = nextConnect({
  onNoMatch(req, res) {
    res
      .status(405)
      .json({ success: false, Error: `Method '${req.method}' Not Allowed` });
  },
});

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

apiRoute.post(
  verifyToken,
  MultifileMiddlewareDelete,
  async (req, res, next) => {
    const dbConnected = await dbConnect();
    const { success } = dbConnected;
    if (!success) {
      res.status(500).json({ success: false, Error: dbConnected.error });
    } else {
      try {
        const { modelName } = req.body;
        var collection = mongoose.model(modelName);
        const { hzErrorConnection, hz } = await hazelCast();
        switch (modelName) {
          case 'Users':
            collection.findById(req.body._id, async (err, docs) => {
              const { Error, success } = userInvolvedError(docs);
              if (!success) {
                res.status(403).json({ success: false, Error: Error });
              } else {
                await deleteObjectsId(req, res, next, docs);
                await docs.remove();
                const totalValues = await collection.find();
                const { hzErrorConnection, hz } = await hazelCast();
                if (!hzErrorConnection) {
                  const multiMapu = await hz.getMultiMap('Users');
                  const multiMapc = await hz.getMultiMap('Countries');
                  const multiMapPr = await hz.getMultiMap('Provinces');
                  const multiMapCt = await hz.getMultiMap('Cities');
                  const multiMapCu = await hz.getMultiMap('Currencies');
                  const multiMapAg = await hz.getMultiMap('Agencies');
                  const multiMapRo = await hz.getMultiMap('Roles');
                  await multiMapu.destroy();
                  await multiMapc.destroy();
                  await multiMapPr.destroy();
                  await multiMapCt.destroy();
                  await multiMapCu.destroy();
                  await multiMapAg.destroy();
                  await multiMapRo.destroy();
                  await multiMapu.put(`all${modelName}`, totalValues);
                  await hz.shutdown();
                }
                res.status(200).json({
                  success: true,
                  totalValuesLength: totalValues.length,
                });
              }
            });
            break;
          case 'Roles':
            collection.findById(req.body._id, async (err, docs) => {
              const { Error, success } = roleInvolvedError(docs);
              if (!success) {
                res.status(403).json({ success: false, Error: Error });
              } else {
                await deleteObjectsId(req, res, next, docs);
                await docs.remove();
                const totalValues = await collection.find();
                if (!hzErrorConnection) {
                  const multiMapu = await hz.getMultiMap('Users');
                  const multiMapc = await hz.getMultiMap('Countries');
                  const multiMapPr = await hz.getMultiMap('Provinces');
                  const multiMapCt = await hz.getMultiMap('Cities');
                  const multiMapCu = await hz.getMultiMap('Currencies');
                  const multiMapAg = await hz.getMultiMap('Agencies');
                  const multiMapRo = await hz.getMultiMap('Roles');
                  await multiMapu.destroy();
                  await multiMapc.destroy();
                  await multiMapPr.destroy();
                  await multiMapCt.destroy();
                  await multiMapCu.destroy();
                  await multiMapAg.destroy();
                  await multiMapRo.destroy();
                  await multiMapRo.put(`all${modelName}`, totalValues);
                  await hz.shutdown();
                }
                res.status(200).json({
                  success: true,
                  totalValuesLength: totalValues.length,
                });
              }
            });
            break;
          case 'Hotels':
            const {
              valuesPerPage,
              valuesPageNumber,
              locale,
              valuesSortBySorting,
              modelName,
            } = req.body;
            await collection.updateOne(
              { _id: req.body?.data?._id },
              {
                $set: { isActive: !req.body?.data?.isActive },
              }
            );
            if (hzErrorConnection) {
              const hotelsValue = await collection.aggregate([
                {
                  $sort: {
                    [req.body['valuesSortByField']]: valuesSortBySorting,
                  },
                },
                {
                  $facet: {
                    paginatedResults: [
                      { $skip: valuesPerPage * (valuesPageNumber - 1) },
                      { $limit: valuesPerPage },
                    ],
                    totalCount: [
                      {
                        $count: 'count',
                      },
                    ],
                  },
                },
              ]);
              res.status(200).json({
                success: true,
                totalValuesLength: hotelsValue[0].totalCount[0].count,
                data: hotelsValue[0].paginatedResults,
              });
            } else {
              const multiMap = await hz.getMultiMap(modelName);
              const dataIsExist = await multiMap.containsKey(`all${modelName}`);
              if (dataIsExist) {
                const values = await multiMap.get(`all${modelName}`);
                for (const value of values) {
                  for (let index = 0; index < value.length; index++) {
                    const element = value[index];
                    if (element._id == req.body?.data?._id) {
                      element.isActive = !req.body?.data?.isActive;
                    }
                  }
                  await multiMap.destroy(`all${modelName}`, value);
                  await multiMap.put(`all${modelName}`, value);
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
                const hotelValue = await collection.aggregate([
                  { $match: {} },
                  {
                    $sort: {
                      [req.body['valuesSortByField']]: valuesSortBySorting,
                    },
                  },
                ]);
                await multiMap.put(`all${modelName}`, hotelValue);
                res.status(200).json({
                  success: true,
                  totalValuesLength: hotelValue.length,
                  data: paginate(hotelValue, valuesPerPage, valuesPageNumber),
                });
              }
            }
            break;
          default:
            collection.findByIdAndDelete(req.body._id, async (err, docs) => {
              if (err) {
                res.status(500).json({ success: false, Error: err.toString() });
              } else {
                if (modelName == 'Agencies') {
                  await deleteObjectsId(req, res, next, docs);
                }
                const totalValues = await collection.find();
                const { hzErrorConnection, hz } = await hazelCast();
                if (!hzErrorConnection) {
                  const multiMapu = await hz.getMultiMap('Users');
                  const multiMapc = await hz.getMultiMap('Countries');
                  const multiMapPr = await hz.getMultiMap('Provinces');
                  const multiMapCt = await hz.getMultiMap('Cities');
                  const multiMapCu = await hz.getMultiMap('Currencies');
                  const multiMapAg = await hz.getMultiMap('Agencies');
                  const multiMapRo = await hz.getMultiMap('Roles');
                  await multiMapu.destroy();
                  await multiMapc.destroy();
                  await multiMapPr.destroy();
                  await multiMapCt.destroy();
                  await multiMapCu.destroy();
                  await multiMapAg.destroy();
                  await multiMapRo.destroy();
                  const multiMap = await hz.getMultiMap(modelName);
                  await multiMap.destroy();
                  await multiMap.put(`all${modelName}`, totalValues);
                  await hz.shutdown();
                }
                res.status(200).json({
                  success: true,
                  totalValuesLength: totalValues.length,
                });
              }
            });
            break;
        }
      } catch (error) {
        res.status(500).json({ success: false, Error: error.toString() });
      }
    }
  }
);

function userInvolvedError(result) {
  //Check if user involved with agent
  const isUserInvolved = result?.agents_id?.length > 0;
  if (isUserInvolved) {
    return {
      success: false,
      Error: `${
        result?.agents_id?.length > 0
          ? `${result?.agents_id?.length} agent(s) is/are involved with ${result?.userName} `
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

export function roleInvolvedError(result) {
  //Check if user involved with agent
  const isRoleInvolved = result?.users_id?.length > 0;
  console.log(isRoleInvolved);
  if (isRoleInvolved) {
    return {
      success: false,
      Error: `${
        result?.users_id?.length > 0
          ? `${result?.users_id?.length} users(s) is/are involved with ${result?.roleName} `
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

export async function deleteObjectsId(req, res, next, result) {
  const { modelName } = req.body;
  switch (modelName) {
    case 'Users':
      console.log(result._id);
      console.log(result.role_id);
      if (result?.role_id.length > 0) {
        await Roles.updateOne(
          { _id: { $in: result.role_id } },
          {
            $pull: {
              users_id: result._id,
            },
          },
          { new: true }
        );
      }
      if (result?.country_id.length > 0) {
        await Countries.updateOne(
          { _id: { $in: result.country_id } },
          {
            $pull: {
              users_id: result._id,
            },
          },
          { new: true }
        );
      }
      if (result?.province_id.length > 0) {
        await Countries.updateOne(
          { 'states._id': { $in: result.province_id } },
          {
            $pull: {
              'states.$.users_id': result._id,
            },
          },
          { multi: true }
        );
      }

      if (result?.city_id.length > 0) {
        await Countries.updateOne(
          { 'states.cities._id': { $in: result.city_id } },
          {
            $pull: {
              'states.$[outer].cities.$[inner].users_id': result._id,
            },
          },
          {
            arrayFilters: [
              { 'outer._id': result.province_id },
              { 'inner._id': result.city_id },
            ],
            multi: true,
          }
        );
      }
      break;
    case 'Agencies':
      await Countries.updateOne(
        { _id: { $in: result.country_id } },
        {
          $pull: {
            agents_id: result._id,
            'states.$[outer].agents_id': result._id,
            'states.$[outer].cities.$[inner].agents_id': result._id,
          },
        },
        {
          arrayFilters: [
            { 'outer._id': result.province_id },
            { 'inner._id': result.city_id },
          ],
        }
      );
      await Currencies.updateOne(
        { _id: { $in: result.currencyCode_id } },
        {
          $pull: {
            agents_id: result._id,
          },
        },
        { multi: true }
      );
      await Users.updateOne(
        { _id: { $in: result.accountManager_id } },
        {
          $pull: {
            agents_id: result._id,
          },
        },
        { multi: true }
      );
      break;
    default:
      break;
  }
}

export default apiRoute;
