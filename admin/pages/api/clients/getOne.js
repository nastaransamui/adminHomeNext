const nextConnect = require('next-connect');

import dbConnect from '../../../helpers/dbConnect';
import verifyToken from '../../../helpers/verifyToken';
import mongoose from 'mongoose';
import Agencies from '../../../models/Agencies';
import { ObjectId } from 'mongodb';
import hazelCast from '../../../helpers/hazelCast';

const apiRoute = nextConnect({
  onNoMatch(req, res) {
    console.log('Error api rout');
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
      const { _id, modelName } = req.body;
      const collection = mongoose.model(modelName);
      const { hzErrorConnection, hz } = await hazelCast();

      if (hzErrorConnection) {
        const agentValue = await collection.aggregate([
          { $match: { _id: ObjectId(_id) } },
          {
            $unwind: {
              path: '$accountManager_id',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'users',
              localField: 'accountManager_id',
              pipeline: [
                {
                  $project: {
                    _id: 1,
                    profileImage: 1,
                    userName: 1,
                  },
                },
              ],
              foreignField: '_id',
              as: 'accountManagerData',
            },
          },
          {
            $unwind: {
              path: '$currencyCode_id',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'currencies',
              localField: 'currencyCode_id',
              pipeline: [
                {
                  $project: {
                    iso2: 1,
                    currency_symbol: 1,
                    currency: 1,
                    _id: 1,
                    currency_name: 1,
                  },
                },
              ],
              foreignField: '_id',
              as: 'currencyCodeData',
            },
          },
          {
            $unwind: {
              path: '$userCreated',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'users',
              localField: 'userCreated',
              pipeline: [
                {
                  $project: {
                    _id: 1,
                    profileImage: 1,
                    userName: 1,
                  },
                },
              ],
              foreignField: '_id',
              as: 'userCreatedData',
            },
          },
          {
            $unwind: {
              path: '$userUpdated',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'users',
              localField: 'userUpdated',
              pipeline: [
                {
                  $project: {
                    _id: 1,
                    profileImage: 1,
                    userName: 1,
                  },
                },
              ],
              foreignField: '_id',
              as: 'userUpdatedData',
            },
          },
          {
            $unwind: {
              path: '$country_id',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'countries',
              localField: 'country_id',
              pipeline: [
                {
                  $project: {
                    _id: 1,
                    name: 1,
                    iso2: 1,
                  },
                },
              ],
              foreignField: '_id',
              as: 'countryData',
            },
          },
          {
            $unwind: {
              path: '$province_id',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'countries',
              let: { province_id: '$province_id' },
              as: 'provinceData',
              pipeline: [
                { $unwind: '$states' },
                {
                  $match: {
                    $expr: {
                      $and: [
                        {
                          $eq: ['$states._id', '$$province_id'],
                        },
                      ],
                    },
                  },
                },
                {
                  $addFields: {
                    'states.country': '$name',
                    'states.emoji': '$emoji',
                    'states.iso2': '$iso2',
                    'states.countryId': '$id',
                    'states.country_id': '$_id',
                  },
                },
                {
                  $unset: [
                    'states.cities',
                    'states.latitude',
                    'states.longitude',
                    'states.type',
                  ],
                },
                {
                  $group: {
                    _id: null,
                    province: { $push: '$states' },
                  },
                },
                { $project: { province: '$province' } },
                {
                  $unwind: {
                    path: '$province',
                    preserveNullAndEmptyArrays: true,
                  },
                },
              ],
            },
          },
          {
            $unwind: {
              path: '$city_id',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'countries',
              let: { city_id: '$city_id' },
              as: 'cityData',
              pipeline: [
                { $unwind: '$states' },
                { $unwind: '$states.cities' },
                {
                  $match: {
                    $expr: {
                      $and: [
                        {
                          $eq: ['$states.cities._id', '$$city_id'],
                        },
                      ],
                    },
                  },
                },
                {
                  $addFields: {
                    'states.cities.country': '$name',
                    'states.cities.emoji': '$emoji',
                    'states.cities.iso2': '$iso2',
                    'states.cities.countryId': '$id',
                    'states.cities.country_id': '$_id',
                    'states.cities.stateId': '$states.id',
                    'states.cities.state_name': '$states.name',
                    'states.cities.state_id': '$states._id',
                  },
                },
                {
                  $unset: ['states.cities.latitude', 'states.cities.longitude'],
                },
                {
                  $group: {
                    _id: null,
                    cities: { $push: '$states.cities' },
                  },
                },
                { $project: { cities: '$cities' } },
                {
                  $unwind: {
                    path: '$cities',
                    preserveNullAndEmptyArrays: true,
                  },
                },
              ],
            },
          },
          {
            $unwind: {
              path: '$province_id',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $unwind: {
              path: '$city_id',
              preserveNullAndEmptyArrays: true,
            },
          },
        ]);

        if (agentValue.length > 0) {
          res.status(200).json({
            success: true,
            data: agentValue[0],
          });
        } else {
          res.status(500).json({ success: false, Error: 'Notfind' });
        }
      } else {
        const multiMap = await hz.getMultiMap(modelName);
        const dataIsExist = await multiMap.containsKey(`all${modelName}`);
        if (dataIsExist) {
          const values = await multiMap.get(`all${modelName}`);
          for (const value of values) {
            const agent = value.filter((a) => a._id == _id);
            if (agent.length > 0) {
              res.status(200).json({
                success: true,
                data: agent[0],
              });
            } else {
              res.status(500).json({ success: false, Error: 'Notfind' });
            }
          }
        } else {
          const agentValue = await collection.aggregate([
            { $match: { _id: ObjectId(_id) } },
            { $unwind: '$accountManager_id' },
            {
              $lookup: {
                from: 'users',
                localField: 'accountManager_id',
                pipeline: [
                  {
                    $project: {
                      _id: 1,
                      profileImage: 1,
                      userName: 1,
                    },
                  },
                ],
                foreignField: '_id',
                as: 'accountManagerData',
              },
            },
            { $unwind: '$currencyCode_id' },
            {
              $lookup: {
                from: 'currencies',
                localField: 'currencyCode_id',
                pipeline: [
                  {
                    $project: {
                      iso2: 1,
                      currency_symbol: 1,
                      currency: 1,
                      _id: 1,
                      currency_name: 1,
                    },
                  },
                ],
                foreignField: '_id',
                as: 'currencyCodeData',
              },
            },
            { $unwind: '$userCreated' },
            {
              $lookup: {
                from: 'users',
                localField: 'userCreated',
                pipeline: [
                  {
                    $project: {
                      _id: 1,
                      profileImage: 1,
                      userName: 1,
                    },
                  },
                ],
                foreignField: '_id',
                as: 'userCreatedData',
              },
            },
            { $unwind: '$userUpdated' },
            {
              $lookup: {
                from: 'users',
                localField: 'userUpdated',
                pipeline: [
                  {
                    $project: {
                      _id: 1,
                      profileImage: 1,
                      userName: 1,
                    },
                  },
                ],
                foreignField: '_id',
                as: 'userUpdatedData',
              },
            },
            { $unwind: '$country_id' },
            {
              $lookup: {
                from: 'countries',
                localField: 'country_id',
                pipeline: [
                  {
                    $project: {
                      _id: 1,
                      name: 1,
                      iso2: 1,
                    },
                  },
                ],
                foreignField: '_id',
                as: 'countryData',
              },
            },
            { $unwind: '$province_id' },
            {
              $lookup: {
                from: 'countries',
                let: { province_id: '$province_id' },
                as: 'provinceData',
                pipeline: [
                  { $unwind: '$states' },
                  {
                    $match: {
                      $expr: {
                        $and: [
                          {
                            $eq: ['$states._id', '$$province_id'],
                          },
                        ],
                      },
                    },
                  },
                  {
                    $addFields: {
                      'states.country': '$name',
                      'states.emoji': '$emoji',
                      'states.iso2': '$iso2',
                      'states.countryId': '$id',
                      'states.country_id': '$_id',
                    },
                  },
                  {
                    $unset: [
                      'states.cities',
                      'states.latitude',
                      'states.longitude',
                      'states.type',
                    ],
                  },
                  {
                    $group: {
                      _id: null,
                      province: { $push: '$states' },
                    },
                  },
                  { $project: { province: '$province' } },
                  {
                    $unwind: {
                      path: '$province',
                      preserveNullAndEmptyArrays: true,
                    },
                  },
                ],
              },
            },
            { $unwind: '$city_id' },
            {
              $lookup: {
                from: 'countries',
                let: { city_id: '$city_id' },
                as: 'cityData',
                pipeline: [
                  { $unwind: '$states' },
                  { $unwind: '$states.cities' },
                  {
                    $match: {
                      $expr: {
                        $and: [
                          {
                            $eq: ['$states.cities._id', '$$city_id'],
                          },
                        ],
                      },
                    },
                  },
                  {
                    $addFields: {
                      'states.cities.country': '$name',
                      'states.cities.emoji': '$emoji',
                      'states.cities.iso2': '$iso2',
                      'states.cities.countryId': '$id',
                      'states.cities.country_id': '$_id',
                      'states.cities.stateId': '$states.id',
                      'states.cities.state_name': '$states.name',
                      'states.cities.state_id': '$states._id',
                    },
                  },
                  {
                    $unset: [
                      'states.cities.latitude',
                      'states.cities.longitude',
                    ],
                  },
                  {
                    $group: {
                      _id: null,
                      cities: { $push: '$states.cities' },
                    },
                  },
                  { $project: { cities: '$cities' } },
                  {
                    $unwind: {
                      path: '$cities',
                      preserveNullAndEmptyArrays: true,
                    },
                  },
                ],
              },
            },
            {
              $unwind: {
                path: '$province_id',
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $unwind: {
                path: '$city_id',
                preserveNullAndEmptyArrays: true,
              },
            },
          ]);
          if (agentValue.length > 0) {
            res.status(200).json({
              success: true,
              data: agentValue[0],
            });
          } else {
            res.status(500).json({ success: false, Error: 'Notfind' });
          }
        }
      }
    } catch (error) {
      let errorText = error.toString();
      error?.kind == 'ObjectId' ? (errorText = 'Notfind') : errorText;
      res.status(500).json({ success: false, Error: errorText });
    }
  }
});

export default apiRoute;
