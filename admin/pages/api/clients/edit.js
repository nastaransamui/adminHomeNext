const nextConnect = require('next-connect');

import dbConnect from '../../../helpers/dbConnect';
import verifyToken from '../../../helpers/verifyToken';
import middleware from '../../../middleware/multiparty';
import Agencies from '../../../models/Agencies';
import { setCookies } from 'cookies-next';
import { editMiddleware } from '../../../middleware/userMiddleware';
import { deleteFsAwsError } from '../../../helpers/aws';
import hazelCast from '../../../helpers/hazelCast';
import { findAgentById } from '../../../helpers/auth';

const apiRoute = nextConnect({
  onNoMatch(req, res) {
    res
      .status(405)
      .json({ success: false, Error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(middleware);

apiRoute.post(verifyToken, editMiddleware, async (req, res, next) => {
  const dbConnected = await dbConnect();
  const { success } = dbConnected;
  if (!success) {
    res.status(500).json({ success: false, Error: dbConnected.error });
  } else {
    try {
      const { _id } = req.body;
      delete req.body._id;
      req.body.phones = JSON.parse(req?.body?.phones);
      findAgentById(_id).then(async (oldAgent) => {
        for (var key in req.body) {
          if (
            typeof oldAgent[key] !== 'function' &&
            req.body[key] !== undefined
          ) {
            oldAgent[key] = req.body[key];
          }
        }
        oldAgent.save(async (err, result) => {
          if (err) {
            res.status(403).json({
              success: false,
              Error: err.toString(),
              keyPattern: err?.keyPattern,
              ErrorCode: err?.code,
            });
          } else {
            const totalAgent = await Agencies.aggregate([
              { $match: {} },
              // { $unwind: '$accountManager_id' },
              // {
              //   $lookup: {
              //     from: 'users',
              //     localField: 'accountManager_id',
              //     pipeline: [
              //       {
              //         $project: {
              //           _id: 1,
              //           profileImage: 1,
              //           userName: 1,
              //         },
              //       },
              //     ],
              //     foreignField: '_id',
              //     as: 'accountManagerData',
              //   },
              // },
              // { $unwind: '$currencyCode_id' },
              // {
              //   $lookup: {
              //     from: 'currencies',
              //     localField: 'currencyCode_id',
              //     pipeline: [
              //       {
              //         $project: {
              //           iso2: 1,
              //           currency_symbol: 1,
              //           currency: 1,
              //           _id: 1,
              //           currency_name: 1,
              //         },
              //       },
              //     ],
              //     foreignField: '_id',
              //     as: 'currencyCodeData',
              //   },
              // },
              // { $unwind: '$userCreated' },
              // {
              //   $lookup: {
              //     from: 'users',
              //     localField: 'userCreated',
              //     pipeline: [
              //       {
              //         $project: {
              //           _id: 1,
              //           profileImage: 1,
              //           userName: 1,
              //         },
              //       },
              //     ],
              //     foreignField: '_id',
              //     as: 'userCreatedData',
              //   },
              // },
              // { $unwind: '$userUpdated' },
              // {
              //   $lookup: {
              //     from: 'users',
              //     localField: 'userUpdated',
              //     pipeline: [
              //       {
              //         $project: {
              //           _id: 1,
              //           profileImage: 1,
              //           userName: 1,
              //         },
              //       },
              //     ],
              //     foreignField: '_id',
              //     as: 'userUpdatedData',
              //   },
              // },
              // { $unwind: '$country_id' },
              // {
              //   $lookup: {
              //     from: 'countries',
              //     localField: 'country_id',
              //     pipeline: [
              //       {
              //         $project: {
              //           _id: 1,
              //           name: 1,
              //           iso2: 1,
              //         },
              //       },
              //     ],
              //     foreignField: '_id',
              //     as: 'countryData',
              //   },
              // },
              // { $unwind: '$province_id' },
              // {
              //   $lookup: {
              //     from: 'countries',
              //     let: { province_id: '$province_id' },
              //     as: 'provinceData',
              //     pipeline: [
              //       { $unwind: '$states' },
              //       {
              //         $match: {
              //           $expr: {
              //             $and: [
              //               {
              //                 $eq: ['$states._id', '$$province_id'],
              //               },
              //             ],
              //           },
              //         },
              //       },
              //       {
              //         $addFields: {
              //           'states.country': '$name',
              //           'states.emoji': '$emoji',
              //           'states.iso2': '$iso2',
              //           'states.countryId': '$id',
              //           'states.country_id': '$_id',
              //         },
              //       },
              //       {
              //         $unset: [
              //           'states.cities',
              //           'states.latitude',
              //           'states.longitude',
              //           'states.type',
              //         ],
              //       },
              //       {
              //         $group: {
              //           _id: null,
              //           province: { $push: '$states' },
              //         },
              //       },
              //       { $project: { province: '$province' } },
              //       {
              //         $unwind: {
              //           path: '$province',
              //           preserveNullAndEmptyArrays: true,
              //         },
              //       },
              //     ],
              //   },
              // },
              // { $unwind: '$city_id' },
              // {
              //   $lookup: {
              //     from: 'countries',
              //     let: { city_id: '$city_id' },
              //     as: 'cityData',
              //     pipeline: [
              //       { $unwind: '$states' },
              //       { $unwind: '$states.cities' },
              //       {
              //         $match: {
              //           $expr: {
              //             $and: [
              //               {
              //                 $eq: ['$states.cities._id', '$$city_id'],
              //               },
              //             ],
              //           },
              //         },
              //       },
              //       {
              //         $addFields: {
              //           'states.cities.country': '$name',
              //           'states.cities.emoji': '$emoji',
              //           'states.cities.iso2': '$iso2',
              //           'states.cities.countryId': '$id',
              //           'states.cities.country_id': '$_id',
              //           'states.cities.stateId': '$states.id',
              //           'states.cities.state_name': '$states.name',
              //           'states.cities.state_id': '$states._id',
              //         },
              //       },
              //       {
              //         $unset: [
              //           'states.cities.latitude',
              //           'states.cities.longitude',
              //         ],
              //       },
              //       {
              //         $group: {
              //           _id: null,
              //           cities: { $push: '$states.cities' },
              //         },
              //       },
              //       { $project: { cities: '$cities' } },
              //       {
              //         $unwind: {
              //           path: '$cities',
              //           preserveNullAndEmptyArrays: true,
              //         },
              //       },
              //     ],
              //   },
              // },
              // {
              //   $unwind: {
              //     path: '$province_id',
              //     preserveNullAndEmptyArrays: true,
              //   },
              // },
              // {
              //   $unwind: {
              //     path: '$city_id',
              //     preserveNullAndEmptyArrays: true,
              //   },
              // },
            ]);
            res.status(200).json({
              success: true,
              totalAgentLength: totalAgent.length,
              data: result,
            });
            const { hzErrorConnection, hz } = await hazelCast();
            if (!hzErrorConnection) {
              const multiMap = await hz.getMultiMap('Agencies');
              await multiMap.destroy();
              await multiMap.put('allAgencies', totalAgent);
              await hz.shutdown();
            }
          }
        });
      });
    } catch (error) {
      deleteFsAwsError(req, res, next);
      res.status(500).json({ success: false, Error: error.toString() });
    }
  }
});

export default apiRoute;
export const config = {
  api: {
    bodyParser: false,
  },
};
