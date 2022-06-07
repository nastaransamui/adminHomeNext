import Users from '../models/Users';
import {
  awsCreateSingle,
  fsCreateSingle,
  fsDeleteSingle,
} from '../helpers/aws';
import hazelCast from '../helpers/hazelCast';
import mongoose from 'mongoose';
import Countries from '../models/Countries';
import Agencies from '../models/Agencies';

const fs = require('fs');
const path = require('path');
import moment from 'moment';
const { AsyncParser } = require('json2csv');
const { Readable } = require('stream');

export const downloadMiddleware = async (req, res, next) => {
  const isVercel = process.env.NEXT_PUBLIC_SERVERLESS == 'true' ? true : false;
  Users.find({})
    .select('-password')
    .select('-accessToken')
    .select('-isVercel')
    .select('-__v')
    .select('-profileImageKey')
    .lean()
    .exec((err, users) => {
      if (err) {
        res.status(404).json({ success: false, Error: err.toString() });
      }
      var jsonContent = JSON.stringify(users);
      const fields = [
        {
          label: 'User ID',
          value: `_id`,
        },
        {
          label: 'User Name',
          value: `userName`,
        },
        {
          label: 'Created date',
          value: (fields) =>
            moment(fields[`createdAt`]).format('MMMM Do YYYY, H:mm'),
        },
        {
          label: 'Last update',
          value: (fields) =>
            moment(fields[`updatedAt`]).format('MMMM Do YYYY, H:mm'),
        },
        {
          label: 'First Name',
          value: `firstName`,
        },
        {
          label: 'Last Name',
          value: `lastName`,
        },
        {
          label: 'City',
          value: `city`,
        },
        {
          label: 'Province/State',
          value: `province`,
        },
        {
          label: 'Country',
          value: `country`,
        },
        {
          label: 'User Position',
          value: `position`,
        },
        {
          label: 'Admin Access',
          value: `isAdmin`,
        },
        {
          label: 'Image link',
          value: `profileImage`,
        },
        {
          label: 'User Discription',
          //Todo fix values from social media
          value: (fields) => fields['aboutMe']?.replace(/[\r\n]+/g, ' '),
        },
      ];
      const opts = { fields };
      const transformOpts = { excelStrings: true, eol: ',' };
      const input = Readable.from([jsonContent]);
      const asyncParser = new AsyncParser(opts, transformOpts);
      const parsingProcessor = asyncParser.fromInput(input);
      parsingProcessor
        .promise()
        .then((csv) => {
          fs.writeFile(
            path.join('/tmp', 'users.csv'),
            csv,
            'utf8',
            async function (err) {
              if (err) {
                res.status(403).json({ success: false, Error: err.toString() });
                console.log(
                  'An error occured while writing csv Object to File.'
                );
              }
              res.setHeader('Content-Type', 'image/jpg');
              req.body.isVercel = isVercel;
              req.files = [
                {
                  fileName: 'users.csv',
                  path: '/tmp/users.csv',
                  finalFolder: req.body.finalFolder,
                },
              ];
              if (isVercel) {
                await awsCreateSingle(req, res, next);
              } else {
                await fsCreateSingle(req, res, next);
              }
            }
          );
        })
        .catch((err) => {
          res.status(403).json({ success: false, Error: err.toString() });
        });
    });
};

export const downloadCountryMiddleware = async (req, res, next) => {
  const isVercel = process.env.NEXT_PUBLIC_SERVERLESS == 'true' ? true : false;
  const { modelName, fileName } = req.body;
  if (fileName !== undefined) {
    const fileToRead = `${process.cwd()}/public/locationsData/${fileName}`;
    let rawdata = fs.readFileSync(fileToRead);
    let countries = JSON.parse(rawdata);
    countries.map((doc) => {
      doc.totalStates = doc.states.length;
      doc.totalCities = doc.states
        .map((a) => a.cities.length)
        .reduce((partialSum, a) => partialSum + a, 0);
      delete doc.states;
      return doc;
    });
    var jsonContent = JSON.stringify(countries);
    const fields = [
      {
        label: 'ID',
        value: `id`,
      },
      {
        label: 'Flag',
        value: `emoji`,
      },
      {
        label: 'English Name',
        value: `name`,
      },
      {
        label: 'Alpha-3',
        value: `iso3`,
      },
      {
        label: 'Alpha-2',
        value: `iso2`,
      },
      {
        label: 'Numeric Code',
        value: `numeric_code`,
      },
      {
        label: 'Country phone code',
        value: `phone_code`,
      },
      {
        label: 'Capital',
        value: `capital`,
      },
      {
        label: 'Number of provinces',
        value: `totalStates`,
      },
      {
        label: 'Number of cities',
        value: `totalCities`,
      },
      {
        label: 'Farsi Name',
        value: (fields) => fields['translations']['fa'],
      },
      {
        label: 'Currency',
        value: `currency`,
      },
      {
        label: 'Currency name',
        value: `currency_name`,
      },
      {
        label: 'Currency symbol',
        value: `currency_symbol`,
      },
      {
        label: 'Top-Level Domain',
        value: `tld`,
      },
      {
        label: 'Country native name',
        value: `native`,
      },
      {
        label: 'Region',
        value: `region`,
      },
      {
        label: 'Sub region',
        value: `subregion`,
      },
      {
        label: 'Latitude',
        value: `latitude`,
      },
      {
        label: 'Longitude',
        value: `longitude`,
      },
      {
        label: 'Time zones',
        value: (fields) =>
          fields['timezones'].map((a) => a.zoneName).toString(),
      },
    ];
    const opts = { fields };
    const transformOpts = { excelStrings: true, eol: ',' };
    const input = Readable.from([jsonContent]);
    const asyncParser = new AsyncParser(opts, transformOpts);
    const parsingProcessor = asyncParser.fromInput(input);
    parsingProcessor
      .promise()
      .then((csv) => {
        fs.writeFile(
          path.join('/tmp', 'global_countries.csv'),
          csv,
          'utf8',
          async function (err) {
            if (err) {
              res.status(403).json({ success: false, Error: err.toString() });
              console.log('An error occured while writing csv Object to File.');
            }
            res.setHeader('Content-Type', 'image/jpg');
            req.body.isVercel = isVercel;
            req.files = [
              {
                fileName: 'global_countries.csv',
                path: '/tmp/global_countries.csv',
                finalFolder: req.body.finalFolder,
              },
            ];
            if (isVercel) {
              await awsCreateSingle(req, res, next);
            } else {
              await fsCreateSingle(req, res, next);
            }
          }
        );
      })
      .catch((err) => {
        res.status(403).json({ success: false, Error: err.toString() });
      });
  } else {
    const { hzErrorConnection, hz } = await hazelCast();
    var collection = mongoose.model('Countries');
    switch (modelName) {
      case 'Countries':
        try {
          const valuesList = await collection.aggregate([
            {
              $addFields: {
                totalStates: { $size: '$states' },
              },
            },
          ]);
          var jsonContent = JSON.stringify(valuesList);
          const fields = [
            {
              label: 'ID',
              value: `id`,
            },
            {
              label: 'Flag',
              value: `emoji`,
            },
            {
              label: 'English Name',
              value: `name`,
            },
            {
              label: 'Alpha-3',
              value: `iso3`,
            },
            {
              label: 'Alpha-2',
              value: `iso2`,
            },
            {
              label: 'Numeric Code',
              value: `numeric_code`,
            },
            {
              label: 'Country phone code',
              value: `phone_code`,
            },
            {
              label: 'Capital',
              value: `capital`,
            },
            {
              label: 'Number of provinces',
              value: `totalStates`,
            },
            {
              label: 'Number of cities',
              value: (fields) =>
                fields['states']
                  .map((a) => a.cities.length)
                  .reduce((partialSum, a) => partialSum + a, 0),
            },
            {
              label: 'Farsi Name',
              value: (fields) => fields['translations']['fa'],
            },
            {
              label: 'Currency',
              value: `currency`,
            },
            {
              label: 'Currency name',
              value: `currency_name`,
            },
            {
              label: 'Currency symbol',
              value: `currency_symbol`,
            },
            {
              label: 'Top-Level Domain',
              value: `tld`,
            },
            {
              label: 'Country native name',
              value: `native`,
            },
            {
              label: 'Region',
              value: `region`,
            },
            {
              label: 'Sub region',
              value: `subregion`,
            },
            {
              label: 'Latitude',
              value: `latitude`,
            },
            {
              label: 'Longitude',
              value: `longitude`,
            },
            {
              label: 'Time zones',
              value: (fields) =>
                fields['timezones'].map((a) => a.zoneName).toString(),
            },
          ];
          const opts = { fields };
          const transformOpts = { excelStrings: true, eol: ',' };
          const input = Readable.from([jsonContent]);
          const asyncParser = new AsyncParser(opts, transformOpts);
          const parsingProcessor = asyncParser.fromInput(input);
          parsingProcessor
            .promise()
            .then((csv) => {
              fs.writeFile(
                path.join('/tmp', 'Active_Countries.csv'),
                csv,
                'utf8',
                async function (err) {
                  if (err) {
                    res
                      .status(403)
                      .json({ success: false, Error: err.toString() });
                    console.log(
                      'An error occured while writing csv Object to File.'
                    );
                  }
                  res.setHeader('Content-Type', 'image/jpg');
                  req.body.isVercel = isVercel;
                  req.files = [
                    {
                      fileName: 'Active_Countries.csv',
                      path: '/tmp/Active_Countries.csv',
                      finalFolder: req.body.finalFolder,
                    },
                  ];
                  if (isVercel) {
                    await awsCreateSingle(req, res, next);
                  } else {
                    await fsCreateSingle(req, res, next);
                  }
                }
              );
            })
            .catch((err) => {
              res.status(403).json({ success: false, Error: err.toString() });
            });
        } catch (error) {
          res.status(403).json({ success: false, Error: err.toString() });
        }
        break;
      case 'Provinces':
        try {
          const fields = [
            {
              label: 'ID',
              value: `id`,
            },
            {
              label: 'Flag',
              value: `emoji`,
            },
            {
              label: 'Country Name',
              value: `country`,
            },
            {
              label: 'Province/State Name',
              value: `name`,
            },
            {
              label: 'Alpha-2',
              value: `iso2`,
            },
            {
              label: 'Country ID',
              value: `country_id`,
            },
            {
              label: 'Number of cities',
              value: `totalCities`,
            },
            {
              label: 'Type',
              value: (fields) => {
                if (fields['type'] == null) {
                  return 'Type not defined';
                } else {
                  return fields['type'];
                }
              },
            },
            {
              label: 'Latitude',
              value: `latitude`,
            },
            {
              label: 'Longitude',
              value: `longitude`,
            },
          ];
          if (hzErrorConnection) {
            const valuesList = await collection.aggregate([
              { $project: { _id: 0 } },
              { $unwind: '$states' },

              {
                $addFields: {
                  'states.country': '$name',
                  'states.emoji': '$emoji',
                  'states.iso2': '$iso2',
                  'states.country_id': '$id',
                  'states.totalCities': { $size: '$states.cities' },
                },
              },
              { $unset: 'states.cities' },
              { $group: { _id: null, provinces: { $push: '$states' } } },
              { $project: { _id: 0, provinces: '$provinces' } },
            ]);
            if (valuesList.length > 0) {
              const provinces = valuesList[0].provinces;
              var jsonContent = JSON.stringify(provinces);
              const opts = { fields };
              const transformOpts = { excelStrings: true, eol: ',' };
              const input = Readable.from([jsonContent]);
              const asyncParser = new AsyncParser(opts, transformOpts);
              const parsingProcessor = asyncParser.fromInput(input);
              parsingProcessor
                .promise()
                .then((csv) => {
                  fs.writeFile(
                    path.join('/tmp', 'Provinces.csv'),
                    csv,
                    'utf8',
                    async function (err) {
                      if (err) {
                        res
                          .status(403)
                          .json({ success: false, Error: err.toString() });
                        console.log(
                          'An error occured while writing csv Object to File.'
                        );
                      }
                      res.setHeader('Content-Type', 'image/jpg');
                      req.body.isVercel = isVercel;
                      req.files = [
                        {
                          fileName: 'Provinces.csv',
                          path: '/tmp/Provinces.csv',
                          finalFolder: req.body.finalFolder,
                        },
                      ];
                      if (isVercel) {
                        await awsCreateSingle(req, res, next);
                      } else {
                        await fsCreateSingle(req, res, next);
                      }
                    }
                  );
                })
                .catch((err) => {
                  res
                    .status(403)
                    .json({ success: false, Error: err.toString() });
                });
            } else {
              res.status(403).json({ success: false, Error: 'noResults' });
            }
          } else {
            const multiMap = await hz.getMultiMap('Provinces');
            const dataIsExist = await multiMap.containsKey('allProvinces');
            if (dataIsExist) {
              const values = await multiMap.get('allProvinces');
              for (const value of values) {
                if (value.length > 0) {
                  var jsonContent = JSON.stringify(value);
                  const opts = { fields };
                  const transformOpts = { excelStrings: true, eol: ',' };
                  const input = Readable.from([jsonContent]);
                  const asyncParser = new AsyncParser(opts, transformOpts);
                  const parsingProcessor = asyncParser.fromInput(input);
                  parsingProcessor
                    .promise()
                    .then((csv) => {
                      fs.writeFile(
                        path.join('/tmp', 'Provinces.csv'),
                        csv,
                        'utf8',
                        async function (err) {
                          if (err) {
                            res
                              .status(403)
                              .json({ success: false, Error: err.toString() });
                            console.log(
                              'An error occured while writing csv Object to File.'
                            );
                          }
                          res.setHeader('Content-Type', 'image/jpg');
                          req.body.isVercel = isVercel;
                          req.files = [
                            {
                              fileName: 'Provinces.csv',
                              path: '/tmp/Provinces.csv',
                              finalFolder: req.body.finalFolder,
                            },
                          ];
                          if (isVercel) {
                            await awsCreateSingle(req, res, next);
                          } else {
                            await fsCreateSingle(req, res, next);
                          }
                        }
                      );
                    })
                    .catch((err) => {
                      res
                        .status(403)
                        .json({ success: false, Error: err.toString() });
                    });
                } else {
                  res.status(403).json({ success: false, Error: 'noResults' });
                }
              }
            } else {
              const valuesList = await collection.aggregate([
                { $project: { _id: 0 } },
                { $unwind: '$states' },

                {
                  $addFields: {
                    'states.country': '$name',
                    'states.emoji': '$emoji',
                    'states.iso2': '$iso2',
                    'states.country_id': '$id',
                    'states.totalCities': { $size: '$states.cities' },
                  },
                },
                { $unset: 'states.cities' },
                { $group: { _id: null, provinces: { $push: '$states' } } },
                { $project: { _id: 0, provinces: '$provinces' } },
              ]);
              if (valuesList.length > 0) {
                const provinces = valuesList[0].provinces;
                var jsonContent = JSON.stringify(provinces);
                const opts = { fields };
                const transformOpts = { excelStrings: true, eol: ',' };
                const input = Readable.from([jsonContent]);
                const asyncParser = new AsyncParser(opts, transformOpts);
                const parsingProcessor = asyncParser.fromInput(input);
                parsingProcessor
                  .promise()
                  .then((csv) => {
                    fs.writeFile(
                      path.join('/tmp', 'Provinces.csv'),
                      csv,
                      'utf8',
                      async function (err) {
                        if (err) {
                          res
                            .status(403)
                            .json({ success: false, Error: err.toString() });
                          console.log(
                            'An error occured while writing csv Object to File.'
                          );
                        }
                        res.setHeader('Content-Type', 'image/jpg');
                        req.body.isVercel = isVercel;
                        req.files = [
                          {
                            fileName: 'Provinces.csv',
                            path: '/tmp/Provinces.csv',
                            finalFolder: req.body.finalFolder,
                          },
                        ];
                        if (isVercel) {
                          await awsCreateSingle(req, res, next);
                        } else {
                          await fsCreateSingle(req, res, next);
                        }
                      }
                    );
                  })
                  .catch((err) => {
                    res
                      .status(403)
                      .json({ success: false, Error: err.toString() });
                  });
              } else {
                res.status(403).json({ success: false, Error: 'noResults' });
              }
            }
          }
        } catch (error) {
          res.status(403).json({ success: false, Error: err.toString() });
        }
        break;
      case 'Cities':
        try {
          const fields = [
            {
              label: 'ID',
              value: `id`,
            },
            {
              label: 'Flag',
              value: `emoji`,
            },
            {
              label: 'Country Name',
              value: `country`,
            },
            {
              label: 'City Name',
              value: `name`,
            },
            {
              label: 'Province/State Name',
              value: `state_name`,
            },
            {
              label: 'Alpha-2',
              value: `iso2`,
            },
            {
              label: 'Country ID',
              value: `country_id`,
            },
            {
              label: 'State ID',
              value: `state_id`,
            },
            {
              label: 'Latitude',
              value: `latitude`,
            },
            {
              label: 'Longitude',
              value: `longitude`,
            },
          ];
          if (hzErrorConnection) {
            const valuesList = await collection.aggregate([
              { $project: { _id: 0 } },
              { $unwind: '$states' },
              { $unwind: '$states.cities' },
              {
                $addFields: {
                  'states.cities.country': '$name',
                  'states.cities.emoji': '$emoji',
                  'states.cities.iso2': '$iso2',
                  'states.cities.country_id': '$id',
                  'states.cities.state_id': '$states.id',
                  'states.cities.state_name': '$states.name',
                },
              },
              { $group: { _id: null, cities: { $push: '$states.cities' } } },
              { $project: { _id: 0, cities: '$cities' } },
            ]);
            if (valuesList.length > 0) {
              const cities = valuesList[0].cities;
              var jsonContent = JSON.stringify(cities);
              const opts = { fields };
              const transformOpts = { excelStrings: true, eol: ',' };
              const input = Readable.from([jsonContent]);
              const asyncParser = new AsyncParser(opts, transformOpts);
              const parsingProcessor = asyncParser.fromInput(input);
              parsingProcessor
                .promise()
                .then((csv) => {
                  fs.writeFile(
                    path.join('/tmp', 'Cities.csv'),
                    csv,
                    'utf8',
                    async function (err) {
                      if (err) {
                        res
                          .status(403)
                          .json({ success: false, Error: err.toString() });
                        console.log(
                          'An error occured while writing csv Object to File.'
                        );
                      }
                      res.setHeader('Content-Type', 'image/jpg');
                      req.body.isVercel = isVercel;
                      req.files = [
                        {
                          fileName: 'Cities.csv',
                          path: '/tmp/Cities.csv',
                          finalFolder: req.body.finalFolder,
                        },
                      ];
                      if (isVercel) {
                        await awsCreateSingle(req, res, next);
                      } else {
                        await fsCreateSingle(req, res, next);
                      }
                    }
                  );
                })
                .catch((err) => {
                  res
                    .status(403)
                    .json({ success: false, Error: err.toString() });
                });
            } else {
              res.status(403).json({ success: false, Error: 'noResults' });
            }
          } else {
            const multiMap = await hz.getMultiMap('Cities');
            const dataIsExist = await multiMap.containsKey(`allCities`);
            if (dataIsExist) {
              const values = await multiMap.get(`allCities`);
              for (const value of values) {
                if (value.length > 0) {
                  var jsonContent = JSON.stringify(value);
                  const opts = { fields };
                  const transformOpts = { excelStrings: true, eol: ',' };
                  const input = Readable.from([jsonContent]);
                  const asyncParser = new AsyncParser(opts, transformOpts);
                  const parsingProcessor = asyncParser.fromInput(input);
                  parsingProcessor
                    .promise()
                    .then((csv) => {
                      fs.writeFile(
                        path.join('/tmp', 'Cities.csv'),
                        csv,
                        'utf8',
                        async function (err) {
                          if (err) {
                            res
                              .status(403)
                              .json({ success: false, Error: err.toString() });
                            console.log(
                              'An error occured while writing csv Object to File.'
                            );
                          }
                          res.setHeader('Content-Type', 'image/jpg');
                          req.body.isVercel = isVercel;
                          req.files = [
                            {
                              fileName: 'Cities.csv',
                              path: '/tmp/Cities.csv',
                              finalFolder: req.body.finalFolder,
                            },
                          ];
                          if (isVercel) {
                            await awsCreateSingle(req, res, next);
                          } else {
                            await fsCreateSingle(req, res, next);
                          }
                        }
                      );
                    })
                    .catch((err) => {
                      res
                        .status(403)
                        .json({ success: false, Error: err.toString() });
                    });
                } else {
                  res.status(403).json({ success: false, Error: 'noResults' });
                }
              }
            } else {
              const valuesList = await collection.aggregate([
                { $project: { _id: 0 } },
                { $unwind: '$states' },
                { $unwind: '$states.cities' },
                {
                  $addFields: {
                    'states.cities.country': '$name',
                    'states.cities.emoji': '$emoji',
                    'states.cities.iso2': '$iso2',
                    'states.cities.country_id': '$id',
                    'states.cities.state_id': '$states.id',
                    'states.cities.state_name': '$states.name',
                  },
                },
                { $group: { _id: null, cities: { $push: '$states.cities' } } },
                { $project: { _id: 0, cities: '$cities' } },
              ]);
              if (valuesList.length > 0) {
                const cities = valuesList[0].cities;
                var jsonContent = JSON.stringify(cities);
                const opts = { fields };
                const transformOpts = { excelStrings: true, eol: ',' };
                const input = Readable.from([jsonContent]);
                const asyncParser = new AsyncParser(opts, transformOpts);
                const parsingProcessor = asyncParser.fromInput(input);
                parsingProcessor
                  .promise()
                  .then((csv) => {
                    fs.writeFile(
                      path.join('/tmp', 'Cities.csv'),
                      csv,
                      'utf8',
                      async function (err) {
                        if (err) {
                          res
                            .status(403)
                            .json({ success: false, Error: err.toString() });
                          console.log(
                            'An error occured while writing csv Object to File.'
                          );
                        }
                        res.setHeader('Content-Type', 'image/jpg');
                        req.body.isVercel = isVercel;
                        req.files = [
                          {
                            fileName: 'Cities.csv',
                            path: '/tmp/Cities.csv',
                            finalFolder: req.body.finalFolder,
                          },
                        ];
                        if (isVercel) {
                          await awsCreateSingle(req, res, next);
                        } else {
                          await fsCreateSingle(req, res, next);
                        }
                      }
                    );
                  })
                  .catch((err) => {
                    res
                      .status(403)
                      .json({ success: false, Error: err.toString() });
                  });
              } else {
                res.status(403).json({ success: false, Error: 'noResults' });
              }
            }
          }
        } catch (error) {
          res.status(403).json({ success: false, Error: err.toString() });
        }
        break;
    }
  }
};

export const downloadClientsMiddleware = async (req, res, next) => {
  const isVercel = process.env.NEXT_PUBLIC_SERVERLESS == 'true' ? true : false;
  const { modelName } = req.body;
  const { hzErrorConnection, hz } = await hazelCast();
  var collection = mongoose.model('Agencies');
  try {
    const valuesList = await collection.aggregate([
      { $match: {} },
      { $unwind: '$userCreated' },
      {
        $lookup: {
          from: 'users',
          localField: 'userCreated',
          pipeline: [
            {
              $project: {
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
                userName: 1,
              },
            },
          ],
          foreignField: '_id',
          as: 'userUpdatedData',
        },
      },
    ]);
    var jsonContent = JSON.stringify(valuesList);
    const fields = [
      {
        label: 'ID',
        value: `agentId`,
      },
      {
        label: 'Agent Name',
        value: `agentName`,
      },
      {
        label: 'Address',
        value: `address`,
      },
      {
        label: 'Phones',
        value: (fields) =>
          fields['phones']
            .map((a) => `${a.tags[0]}: ${a.number} , remark: ${a.remark}`)
            .toString(),
      },
      {
        label: 'City',
        value: `cityName`,
      },
      {
        label: 'Province/State',
        value: `provinceName`,
      },
      {
        label: 'Country',
        value: `countryName`,
      },
      {
        label: 'Email',
        value: `email`,
      },
      {
        label: 'Currency',
        value: `currencyCode`,
      },
      {
        label: 'Credit Amount',
        value: (fields) => `${fields['creditAmount']?.toLocaleString()}`,
      },
      {
        label: 'Deposite Amount',
        value: (fields) => `${fields['depositAmount']?.toLocaleString()}`,
      },
      {
        label: 'Remain Credit Amount',
        value: (fields) => `${fields['remainCreditAmount']?.toLocaleString()}`,
      },
      {
        label: 'Remain Deposit Amount',
        value: (fields) => `${fields['remainDepositAmount']?.toLocaleString()}`,
      },
      {
        label: 'Account Manager',
        value: `accountManager`,
      },
      {
        label: 'Logo link',
        value: `logoImage`,
      },
      {
        label: 'Created date',
        value: (fields) =>
          moment(new Date(fields[`createdAt`].slice(0, -1))).format(
            'MMMM Do YYYY, H:mm'
          ),
      },
      {
        label: 'Last update',
        value: (fields) =>
          moment(new Date(fields[`updatedAt`].slice(0, -1))).format(
            'MMMM Do YYYY, H:mm'
          ),
      },
      {
        label: 'Active',
        value: `isActive`,
      },
      {
        label: 'User Created',
        value: (fields) =>
          fields['userCreatedData'].map((a) => `${a.userName}`).toString(),
      },
      {
        label: 'User Updated',
        value: (fields) =>
          fields['userUpdatedData'].map((a) => `${a.userName}`).toString(),
      },
      {
        label: 'Remark',
        value: (fields) => fields['remark']?.replace(/[\r\n]+/g, ' '),
      },
    ];
    const opts = { fields };
    const transformOpts = { excelStrings: true, eol: ',' };
    const input = Readable.from([jsonContent]);
    const asyncParser = new AsyncParser(opts, transformOpts);
    const parsingProcessor = asyncParser.fromInput(input);
    parsingProcessor
      .promise()
      .then((csv) => {
        fs.writeFile(
          path.join('/tmp', 'Agencies.csv'),
          csv,
          'utf8',
          async function (err) {
            if (err) {
              res.status(403).json({ success: false, Error: err.toString() });
              console.log('An error occured while writing csv Object to File.');
            }
            res.setHeader('Content-Type', 'image/jpg');
            req.body.isVercel = isVercel;
            req.files = [
              {
                fileName: 'Agencies.csv',
                path: '/tmp/Agencies.csv',
                finalFolder: req.body.finalFolder,
              },
            ];
            if (isVercel) {
              await awsCreateSingle(req, res, next);
            } else {
              await fsCreateSingle(req, res, next);
            }
          }
        );
      })
      .catch((err) => {
        res.status(403).json({ success: false, Error: err.toString() });
      });
  } catch (error) {
    res.status(403).json({ success: false, Error: err.toString() });
  }
};
