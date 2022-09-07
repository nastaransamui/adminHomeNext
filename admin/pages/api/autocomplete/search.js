const nextConnect = require('next-connect');
import fs from 'fs';
import dbConnect from '../../../helpers/dbConnect';
import verifyToken from '../../../helpers/verifyToken';
import hazelCast from '../../../helpers/hazelCast';
import mongoose from 'mongoose';
import Countries from '../../../models/Countries';
import Features from '../../../models/Features';
import Photos from '../../../models/Photos';
import Users from '../../../models/Users';
import Videos from '../../../models/Videos';
import Agencies from '../../../models/Agencies';
import Hotels from '../../../models/Hotels';
import axios from 'axios';

const apiRoute = nextConnect({
  onNoMatch(req, res) {
    res
      .status(405)
      .json({ success: false, Error: `Method '${req.method}' Not Allowed` });
  },
});

export function escapeRegExp(value) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

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

apiRoute.post(verifyToken, async (req, res, next) => {
  const dbConnected = await dbConnect();
  const { success } = dbConnected;
  if (!success) {
    res.status(500).json({ success: false, Error: dbConnected.error });
  } else {
    const { hzErrorConnection, hz } = await hazelCast();
    try {
      const { modelName, fieldValue, filterValue } = req.body;
      const searchRegex = new RegExp(escapeRegExp(filterValue), 'i');

      switch (modelName) {
        case 'Cities':
          var collection = mongoose.model('Countries');
          var fieldSearch =
            fieldValue == ''
              ? 'states.cities.name'
              : fieldValue == 'state_name'
              ? 'states.name'
              : fieldValue == 'country'
              ? 'name'
              : `states.cities.${fieldValue}`;
          if (hzErrorConnection) {
            const valuesList = await collection.aggregate([
              { $unwind: '$states' },
              { $unwind: '$states.cities' },
              { $match: { [fieldSearch]: searchRegex } },
              {
                $addFields: {
                  'states.cities.country': '$name',
                  'states.cities.emoji': '$emoji',
                  'states.cities.iso2': '$iso2',
                  'states.cities.iso3': '$iso3',
                  'states.cities.countryId': '$id',
                  'states.cities.country_id': '$_id',
                  'states.cities.stateId': '$states.id',
                  'states.cities.state_name': '$states.name',
                  'states.cities.state_id': '$states._id',
                  'states.cities.totalHotels': {
                    $size: '$states.cities.hotels_id',
                  },
                  'states.cities.totalUsers': {
                    $size: '$states.cities.users_id',
                  },
                  'states.cities.totalAgents': {
                    $size: '$states.cities.agents_id',
                  },
                },
              },
              {
                $unset: [
                  'states.cities.hotels_id',
                  'states.cities.users_id',
                  'states.cities.agents_id',
                ],
              },
              { $sort: { 'states.cities.name': 1 } },
              { $limit: 50 },
              { $group: { _id: null, cities: { $push: '$states.cities' } } },
              { $project: { cities: 1, _id: 0 } },
            ]);
            if (valuesList.length > 0) {
              const cities = valuesList[0].cities;
              res.status(200).json({ success: true, data: cities });
            } else {
              res.status(200).json({ success: true, data: [] });
            }
          } else {
            const multiMap = await hz.getMultiMap('Cities');
            const dataIsExist = await multiMap.containsKey(`allCities`);
            if (dataIsExist) {
              const values = await multiMap.get(`allCities`);
              for (const value of values) {
                const filterdData = value.filter((row) => {
                  return Object.keys(row).some((field) => {
                    if (field == fieldValue) {
                      if (row[field] !== null) {
                        return searchRegex.test(row[field].toString());
                      }
                    }
                  });
                });
                if (filterdData.length > 0) {
                  res.status(200).json({
                    success: true,
                    data: paginate(
                      filterdData.sort(
                        sort_by('name', false, (a) => a.toUpperCase())
                      ),
                      50,
                      1
                    ),
                  });
                } else {
                  res.status(200).json({
                    success: true,
                    data: [],
                  });
                }
              }
              await hz.shutdown();
            } else {
              const valuesList = await collection.aggregate([
                { $unwind: '$states' },
                { $unwind: '$states.cities' },
                { $match: { [fieldSearch]: searchRegex } },
                {
                  $addFields: {
                    'states.cities.country': '$name',
                    'states.cities.emoji': '$emoji',
                    'states.cities.iso2': '$iso2',
                    'states.cities.country_id': '$id',
                    'states.cities.state_name': '$states.name',
                  },
                },
                { $sort: { 'states.cities.name': 1 } },
                { $limit: 50 },
                { $group: { _id: null, cities: { $push: '$states.cities' } } },
                { $project: { cities: 1, _id: 0 } },
              ]);
              if (valuesList.length > 0) {
                const cities = valuesList[0].cities;
                res.status(200).json({ success: true, data: cities });
              } else {
                res.status(200).json({ success: true, data: [] });
              }
            }

            await hz.shutdown();
          }
          break;
        case 'Provinces':
          var collection = mongoose.model('Countries');
          var fieldSearch =
            fieldValue == ''
              ? 'states.name'
              : fieldValue == 'country'
              ? 'name'
              : `states.${fieldValue}`;
          if (hzErrorConnection) {
            const valuesList = await collection.aggregate([
              { $unwind: '$states' },
              { $match: { [fieldSearch]: searchRegex } },
              {
                $addFields: {
                  'states.country': '$name',
                  'states.emoji': '$emoji',
                  'states.iso2': '$iso2',
                  'states.iso3': '$iso3',
                  'states.countryId': '$id',
                  'states.country_id': '$_id',
                  'states.totalCities': { $size: '$states.cities' },
                  'states.totalHotels': { $size: '$states.hotels_id' },
                  'states.totalUsers': { $size: '$states.users_id' },
                  'states.totalAgents': { $size: '$states.agents_id' },
                },
              },
              {
                $unset: [
                  'states.cities',
                  'states.hotels_id',
                  'states.users_id',
                  'states.agents_id',
                ],
              },
              { $sort: { 'states.name': 1 } },
              { $limit: 50 },
              { $group: { _id: null, provinces: { $push: '$states' } } },
              { $project: { _id: 0, provinces: '$provinces' } },
            ]);
            if (valuesList.length > 0) {
              const provinces = valuesList[0].provinces;
              res.status(200).json({ success: true, data: provinces });
            } else {
              res.status(200).json({ success: true, data: [] });
            }
          } else {
            const multiMap = await hz.getMultiMap('Provinces');
            const dataIsExist = await multiMap.containsKey('allProvinces');
            if (dataIsExist) {
              const values = await multiMap.get(`allProvinces`);
              for (const value of values) {
                const filterdData = value.filter((row) => {
                  return Object.keys(row).some((field) => {
                    if (field == fieldValue) {
                      if (row[field] !== null) {
                        return searchRegex.test(row[field].toString());
                      }
                    }
                  });
                });
                if (filterdData.length > 0) {
                  res.status(200).json({
                    success: true,
                    data: paginate(
                      filterdData.sort(
                        sort_by('name', false, (a) => a.toUpperCase())
                      ),
                      50,
                      1
                    ),
                  });
                  await hz.shutdown();
                } else {
                  res.status(200).json({
                    success: true,
                    data: [],
                  });
                  await hz.shutdown();
                }
              }
            } else {
              const valuesList = await collection.aggregate([
                { $project: { _id: 0 } },
                { $unwind: '$states' },
                { $match: { [fieldSearch]: searchRegex } },
                {
                  $addFields: {
                    'states.country': '$name',
                    'states.emoji': '$emoji',
                    'states.iso2': '$iso2',
                    'states.country_id': '$_id',
                    'states.countryId': '$id',
                  },
                },
                { $sort: { 'states.name': 1 } },
                { $limit: 50 },
                { $group: { _id: null, provinces: { $push: '$states' } } },
                { $project: { _id: 0, provinces: '$provinces' } },
              ]);
              if (valuesList.length > 0) {
                const provinces = valuesList[0].provinces;
                res.status(200).json({ success: true, data: provinces });
                await hz.shutdown();
              } else {
                res.status(200).json({ success: true, data: [] });
                await hz.shutdown();
              }
            }
          }
          break;
        case 'Countries':
          var collection = mongoose.model('Countries');
          if (hzErrorConnection) {
            const valuesList = await collection.aggregate([
              { $sort: { name: 1 } },
              { $match: { [fieldValue]: searchRegex } },
              { $limit: 50 },
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
            console.log(valuesList);
            if (valuesList.length > 0) {
              res.status(200).json({ success: true, data: valuesList });
            } else {
              res.status(200).json({
                success: true,
                data: [],
              });
            }
          } else {
            const multiMap = await hz.getMultiMap('Countries');
            const dataIsExist = await multiMap.containsKey(`allCountries`);
            if (dataIsExist) {
              const values = await multiMap.get('allCountries');
              for (const value of values) {
                const filterdData = value.filter((row) => {
                  return Object.keys(row).some((field) => {
                    if (field == fieldValue) {
                      if (row[field] !== null) {
                        return searchRegex.test(row[field].toString());
                      }
                    }
                  });
                });
                if (filterdData.length > 0) {
                  res.status(200).json({
                    success: true,
                    data: paginate(
                      filterdData.sort(
                        sort_by('name', false, (a) => a.toUpperCase())
                      ),
                      50,
                      1
                    ),
                  });
                  await hz.shutdown();
                } else {
                  res.status(200).json({
                    success: true,
                    data: [],
                  });
                  await hz.shutdown();
                }
              }
              await hz.shutdown();
            } else {
              const valuesList = await collection.aggregate([
                { $sort: { name: 1 } },
                { $match: { [fieldValue]: searchRegex } },
                { $limit: 50 },
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
              if (valuesList.length > 0) {
                res.status(200).json({ success: true, data: valuesList });
                await hz.shutdown();
              } else {
                res.status(200).json({
                  success: true,
                  data: [],
                });
                await hz.shutdown();
              }
            }
            await hz.shutdown();
          }
          break;
        case 'global_countries':
          const fileToRead = `${process.cwd()}/public/locationsData/countries+states+cities.json`;
          let rawdata = fs.readFileSync(fileToRead);
          let data = JSON.parse(rawdata);
          // var collection = mongoose.model('Countries');
          // var activesIds = await collection.find({}, { _id: false, id: true });
          data.map((doc) => {
            doc.totalStates = doc.states.length;
            doc.totalActiveHotels = 0;
            doc.totalUsers = 0;
            doc.totalAgents = 0;
            doc.isHotelsActive = false;
            delete doc.states;
            return doc;
          });
          const filterdData = data.filter((row) => {
            return Object.keys(row).some((field) => {
              if (field == fieldValue) {
                if (row[field] !== null) {
                  return searchRegex.test(row[field].toString());
                }
              }
            });
          });
          if (filterdData.length > 0) {
            res.status(200).json({
              success: true,
              data: paginate(
                filterdData.sort(
                  sort_by('name', false, (a) => a.toUpperCase())
                ),
                50,
                1
              ),
            });
            if (!hzErrorConnection) {
              await hz.shutdown();
            }
          } else {
            res.status(200).json({
              success: true,
              data: [],
            });

            if (!hzErrorConnection) {
              await hz.shutdown();
            }
          }
          break;
        case 'Users':
          if (hzErrorConnection) {
            var collection = mongoose.model(modelName);
            const valuesList = await collection.aggregate([
              { $sort: { name: 1 } },
              { $match: { [fieldValue]: searchRegex } },
              { $limit: 50 },
              { $unset: 'password' },
            ]);
            if (valuesList.length > 0) {
              res.status(200).json({ success: true, data: valuesList });
            } else {
              res.status(200).json({
                success: true,
                data: [],
              });
            }
          } else {
            const multiMap = await hz.getMultiMap(modelName);
            const dataIsExist = await multiMap.containsKey(`all${modelName}`);
            if (dataIsExist) {
              const values = await multiMap.get(`all${modelName}`);
              for (const value of values) {
                const filterdData = value.filter((row) => {
                  return Object.keys(row).some((field) => {
                    if (field == fieldValue) {
                      if (row[field] !== null) {
                        return searchRegex.test(row[field].toString());
                      }
                    }
                  });
                });
                if (filterdData.length > 0) {
                  res.status(200).json({
                    success: true,
                    data: paginate(
                      filterdData.sort(
                        sort_by('userName', false, (a) => a.toUpperCase())
                      ),
                      50,
                      1
                    ),
                  });
                  await hz.shutdown();
                } else {
                  res.status(200).json({
                    success: true,
                    data: [],
                  });
                  await hz.shutdown();
                }
              }
            } else {
              var collection = mongoose.model(modelName);
              const valuesList = await collection.aggregate([
                { $sort: { name: 1 } },
                { $match: { [fieldValue]: searchRegex } },
                { $limit: 50 },
                { $unset: 'password' },
              ]);
              if (valuesList.length > 0) {
                res.status(200).json({ success: true, data: valuesList });
                await hz.shutdown();
              } else {
                res.status(200).json({
                  success: true,
                  data: [],
                });
                await hz.shutdown();
              }
            }
            await hz.shutdown();
          }
          break;
        case 'global_currencies':
          const currencies = `${process.cwd()}/public/locationsData/currencies.json`;
          const rawCurrencies = fs.readFileSync(currencies);
          const currenciesData = JSON.parse(rawCurrencies);
          var filterdCurrencies = currenciesData.filter((row) => {
            return Object.keys(row).some((field) => {
              if (field == fieldValue) {
                if (row[field] !== null) {
                  return searchRegex.test(row[field].toString());
                }
              }
            });
          });
          if (filterdCurrencies.length > 0) {
            res.status(200).json({
              success: true,
              data: paginate(
                filterdCurrencies.sort(
                  sort_by('currency_name', false, (a) => a.toUpperCase())
                ),
                50,
                1
              ),
            });
            if (!hzErrorConnection) {
              await hz.shutdown();
            }
          } else {
            res.status(200).json({
              success: true,
              data: [],
            });
            if (!hzErrorConnection) {
              await hz.shutdown();
            }
          }
          break;
        case 'Currencies':
          var collection = mongoose.model(modelName);
          if (hzErrorConnection) {
            const valuesList = await collection.aggregate([
              { $sort: { currency_name: 1 } },
              { $match: { [fieldValue]: searchRegex } },
              { $limit: 50 },
            ]);
            if (valuesList.length > 0) {
              res.status(200).json({ success: true, data: valuesList });
            } else {
              res.status(200).json({
                success: true,
                data: [],
              });
            }
          } else {
            const multiMap = await hz.getMultiMap(modelName);
            const dataIsExist = await multiMap.containsKey(`all${modelName}`);
            if (dataIsExist) {
              const values = await multiMap.get(`all${modelName}`);
              for (const value of values) {
                const filterdCurrencies = value.filter((row) => {
                  return Object.keys(row).some((field) => {
                    if (field == fieldValue) {
                      if (row[field] !== null) {
                        return searchRegex.test(row[field].toString());
                      }
                    }
                  });
                });
                if (filterdCurrencies.length > 0) {
                  res.status(200).json({
                    success: true,
                    data: paginate(
                      filterdCurrencies.sort(
                        sort_by('currency_name', false, (a) => a.toUpperCase())
                      ),
                      50,
                      1
                    ),
                  });
                  await hz.shutdown();
                } else {
                  res.status(200).json({
                    success: true,
                    data: [],
                  });
                  await hz.shutdown();
                }
              }
            } else {
              const valuesList = await collection.aggregate([
                { $sort: { currency_name: 1 } },
                { $match: { [fieldValue]: searchRegex } },
                { $limit: 50 },
              ]);
              if (valuesList.length > 0) {
                res.status(200).json({ success: true, data: valuesList });
                await hz.shutdown();
              } else {
                res.status(200).json({
                  success: true,
                  data: [],
                });
                await hz.shutdown();
              }
            }
            await hz.shutdown();
          }
          break;
        case 'Agencies':
          var collection = mongoose.model(modelName);
          if (fieldValue !== 'phones') {
            if (hzErrorConnection) {
              //Initiate match
              var match = {
                $match: { [fieldValue]: searchRegex },
              };
              //Initiate add field
              var addFields = {
                $addFields: {},
              };
              //Unset string value of numbers
              var unset = {
                $unset: `agentsData.converted${fieldValue}`,
              };
              //Set match expresion base on type of fieldValue
              switch (fieldValue) {
                case 'creditAmount':
                case 'depositAmount':
                case 'remainCreditAmount':
                case 'remainDepositAmount':
                  addFields = {
                    $addFields: {
                      [`${`converted${fieldValue}`}`]: {
                        $toString: `$${fieldValue}`,
                      },
                    },
                  };
                  match = {
                    $match: {
                      [`${`converted${fieldValue}`}`]: searchRegex,
                    },
                  };
                  break;
              }
              const valuesList = await collection.aggregate([
                { $sort: { agentName: 1 } },
                { ...addFields },
                { ...match },
                { $limit: 50 },
                { ...unset },
              ]);
              if (valuesList.length > 0) {
                res.status(200).json({ success: true, data: valuesList });
              } else {
                res.status(200).json({
                  success: true,
                  data: [],
                });
              }
            } else {
              const multiMap = await hz.getMultiMap(modelName);
              const dataIsExist = await multiMap.containsKey(`all${modelName}`);
              if (dataIsExist) {
                const values = await multiMap.get(`all${modelName}`);
                for (const value of values) {
                  const filterdAgencies = value.filter((row) => {
                    return Object.keys(row).some((field) => {
                      if (field == fieldValue) {
                        if (row[field] !== null) {
                          return searchRegex.test(row[field].toString());
                        }
                      }
                    });
                  });
                  if (filterdAgencies.length > 0) {
                    res.status(200).json({
                      success: true,
                      data: paginate(
                        filterdAgencies.sort(
                          sort_by('agentName', false, (a) => a.toUpperCase())
                        ),
                        50,
                        1
                      ),
                    });
                    await hz.shutdown();
                  } else {
                    res.status(200).json({
                      success: true,
                      data: [],
                    });
                    await hz.shutdown();
                  }
                }
              } else {
                //Initiate match
                var match = {
                  $match: { [fieldValue]: searchRegex },
                };
                //Initiate add field
                var addFields = {
                  $addFields: {},
                };
                //Unset string value of numbers
                var unset = {
                  $unset: `agentsData.converted${fieldValue}`,
                };
                //Set match expresion base on type of fieldValue
                switch (fieldValue) {
                  case 'creditAmount':
                  case 'depositAmount':
                  case 'remainCreditAmount':
                  case 'remainDepositAmount':
                    addFields = {
                      $addFields: {
                        [`${`converted${fieldValue}`}`]: {
                          $toString: `$${fieldValue}`,
                        },
                      },
                    };
                    match = {
                      $match: {
                        [`${`converted${fieldValue}`}`]: searchRegex,
                      },
                    };
                    break;
                }
                const valuesList = await collection.aggregate([
                  { $sort: { agentName: 1 } },
                  { ...addFields },
                  { ...match },
                  { $limit: 50 },
                  { ...unset },
                ]);
                if (valuesList.length > 0) {
                  res.status(200).json({ success: true, data: valuesList });
                  await hz.shutdown();
                } else {
                  res.status(200).json({
                    success: true,
                    data: [],
                  });
                  await hz.shutdown();
                }
              }
              await hz.shutdown();
            }
          } else {
            if (hzErrorConnection) {
              let phoneNumber = filterValue;
              if (phoneNumber.startsWith('+')) {
                phoneNumber = phoneNumber.substring(1).replace(/\s/g, '');
              }
              const phoneRegex = new RegExp(escapeRegExp(phoneNumber), 'i');
              const valuesList = await collection.aggregate([
                { $sort: { agentName: 1 } },
                {
                  $addFields: {
                    [`${`convertedphones`}`]: {
                      $reduce: {
                        input: '$phones.number',
                        initialValue: '',
                        in: { $concat: ['$$value', '$$this'] },
                      },
                    },
                  },
                },
                {
                  $addFields: {
                    [`${`convertedphones`}`]: {
                      $replaceAll: {
                        input: '$convertedphones',
                        find: '+',
                        replacement: '',
                      },
                    },
                  },
                },
                {
                  $addFields: {
                    [`convertedphones`]: {
                      $replaceAll: {
                        input: '$convertedphones',
                        find: '(',
                        replacement: '',
                      },
                    },
                  },
                },
                {
                  $addFields: {
                    [`convertedphones`]: {
                      $replaceAll: {
                        input: '$convertedphones',
                        find: ' ',
                        replacement: '',
                      },
                    },
                  },
                },
                {
                  $addFields: {
                    [`convertedphones`]: {
                      $replaceAll: {
                        input: '$convertedphones',
                        find: ')',
                        replacement: '',
                      },
                    },
                  },
                },
                {
                  $addFields: {
                    [`convertedphones`]: {
                      $replaceAll: {
                        input: '$convertedphones',
                        find: '-',
                        replacement: '',
                      },
                    },
                  },
                },
                { $match: { convertedphones: phoneRegex } },
                { $limit: 50 },
                { $unset: `convertedphones` },
              ]);
              if (valuesList.length > 0) {
                res.status(200).json({ success: true, data: valuesList });
              } else {
                res.status(200).json({
                  success: true,
                  data: [],
                });
              }
            } else {
              const multiMap = await hz.getMultiMap(modelName);
              const dataIsExist = await multiMap.containsKey(`all${modelName}`);
              if (dataIsExist) {
                const values = await multiMap.get(`all${modelName}`);
                for (const value of values) {
                  const phoneSearchRegex = new RegExp(
                    escapeRegExp(
                      filterValue
                        .substring(1)
                        .replaceAll(/\s/g, '')
                        .replaceAll('(', '')
                        .replaceAll(')', '')
                        .replaceAll('-', '')
                    ),
                    'i'
                  );
                  const filterdData = value.filter((row) => {
                    return Object.keys(row).some((field) => {
                      if (field == fieldValue) {
                        if (row[field] !== null) {
                          return phoneSearchRegex.test(
                            row[field]
                              .map((a, i) =>
                                a.number
                                  .substring(1)
                                  .replaceAll(/\s/g, '')
                                  .replaceAll('(', '')
                                  .replaceAll(')', '')
                                  .replaceAll('-', '')
                              )
                              .toString()
                          );
                        }
                      }
                    });
                  });
                  if (filterdData.length > 0) {
                    res.status(200).json({
                      success: true,
                      data: paginate(
                        filterdData.sort(
                          sort_by('agentName', false, (a) => a.toUpperCase())
                        ),
                        50,
                        1
                      ),
                    });
                  } else {
                    res.status(200).json({
                      success: true,
                      data: [],
                    });
                  }
                }
              } else {
                let phoneNumber = filterValue;
                if (phoneNumber.startsWith('+')) {
                  phoneNumber = phoneNumber.substring(1).replace(/\s/g, '');
                }
                const phoneRegex = new RegExp(escapeRegExp(phoneNumber), 'i');
                const valuesList = await collection.aggregate([
                  { $sort: { agentName: 1 } },
                  {
                    $addFields: {
                      [`${`convertedphones`}`]: {
                        $reduce: {
                          input: '$phones.number',
                          initialValue: '',
                          in: { $concat: ['$$value', '$$this'] },
                        },
                      },
                    },
                  },
                  {
                    $addFields: {
                      [`${`convertedphones`}`]: {
                        $replaceAll: {
                          input: '$convertedphones',
                          find: '+',
                          replacement: '',
                        },
                      },
                    },
                  },
                  {
                    $addFields: {
                      [`convertedphones`]: {
                        $replaceAll: {
                          input: '$convertedphones',
                          find: '(',
                          replacement: '',
                        },
                      },
                    },
                  },
                  {
                    $addFields: {
                      [`convertedphones`]: {
                        $replaceAll: {
                          input: '$convertedphones',
                          find: ' ',
                          replacement: '',
                        },
                      },
                    },
                  },
                  {
                    $addFields: {
                      [`convertedphones`]: {
                        $replaceAll: {
                          input: '$convertedphones',
                          find: ')',
                          replacement: '',
                        },
                      },
                    },
                  },
                  {
                    $addFields: {
                      [`convertedphones`]: {
                        $replaceAll: {
                          input: '$convertedphones',
                          find: '-',
                          replacement: '',
                        },
                      },
                    },
                  },
                  { $match: { convertedphones: phoneRegex } },
                  { $limit: 50 },
                  { $unset: `convertedphones` },
                ]);
                if (valuesList.length > 0) {
                  res.status(200).json({ success: true, data: valuesList });
                } else {
                  res.status(200).json({
                    success: true,
                    data: [],
                  });
                }
              }
            }
          }
          break;
        case 'HotelsList':
          if (hzErrorConnection) {
            axios
              .get(
                `${process.env.NEXT_PUBLIC_API_LINK}/hotels/list?${fieldValue}=${filterValue}`
                // `http://192.168.1.116:3000/api/hotels/list?${fieldValue}=${filterValue}`
              )
              .then((resp) => {
                const valuesList = resp.data.data;
                res.status(200).json({ success: true, data: valuesList });
              });
          } else {
            const multiMap = await hz.getMultiMap(modelName);
            const dataIsExist = await multiMap.containsKey(`all${modelName}`);
            if (dataIsExist) {
              const values = await multiMap.get(`all${modelName}`);
              for (const value of values) {
                const filterdData = value.filter((row) => {
                  return Object.keys(row).some((field) => {
                    if (field == fieldValue) {
                      if (row[field] !== null) {
                        return searchRegex.test(row[field].toString());
                      }
                    }
                  });
                });
                if (filterdData.length > 0) {
                  res.status(200).json({
                    success: true,
                    data: paginate(
                      filterdData.sort(
                        sort_by('iso2', false, (a) =>
                          typeof a == 'boolean' || typeof a == 'number'
                            ? a
                            : a.toUpperCase()
                        )
                      ),
                      50,
                      1
                    ),
                  });
                  await hz.shutdown();
                } else {
                  res.status(200).json({
                    success: true,
                    data: [],
                  });
                  await hz.shutdown();
                }
              }
              await hz.shutdown();
            } else {
              axios
                .get(
                  // `${process.env.NEXT_PUBLIC_API_LINK}/hotels/list?${fieldValue}=${filterValue}`
                  `http://192.168.1.116:3000/api/hotels/list?${fieldValue}=${filterValue}`
                )
                .then(async (resp) => {
                  const valuesList = resp.data.data;
                  res.status(200).json({ success: true, data: valuesList });
                  await hz.shutdown();
                });
            }
          }
          break;
        case 'Hotels':
          var collection = mongoose.model(modelName);
          if (hzErrorConnection) {
            var match = {
              $match: { [fieldValue]: searchRegex },
            };
            var addFields = {
              $addFields: {},
            };
            var phoneAddFields = {
              $addFields: {},
            };
            var unset = {
              $unset: `converted${fieldValue}`,
            };
            switch (fieldValue) {
              case 'hotelId':
                addFields = {
                  $addFields: {
                    [`${`converted${fieldValue}`}`]: {
                      $toString: `$${fieldValue}`,
                    },
                  },
                };
                match = {
                  $match: {
                    [`${`converted${fieldValue}`}`]: searchRegex,
                  },
                };
                break;
              case 'phones':
              case 'fax':
                let phoneNumber = filterValue;
                if (phoneNumber.startsWith('+')) {
                  phoneNumber = phoneNumber.substring(1).replace(/\s/g, '');
                }
                const phoneRegex = new RegExp(escapeRegExp(phoneNumber), 'i');
                match = {
                  $match: {
                    convertedphones: phoneRegex,
                  },
                };
                const input = fieldValue == 'phones' ? '$phones' : '$fax';
                addFields = {
                  $addFields: {
                    [`${`convertedphones`}`]: {
                      $replaceAll: {
                        input: input,
                        find: '+',
                        replacement: '',
                      },
                    },
                  },
                };
                unset = {
                  $unset: `convertedphones`,
                };
                break;
            }
            const valuesList = await collection.aggregate([
              { $sort: { name: 1 } },
              { ...addFields },
              {
                $addFields: {
                  [`convertedphones`]: {
                    $replaceAll: {
                      input: '$convertedphones',
                      find: '(',
                      replacement: '',
                    },
                  },
                },
              },
              {
                $addFields: {
                  [`convertedphones`]: {
                    $replaceAll: {
                      input: '$convertedphones',
                      find: ' ',
                      replacement: '',
                    },
                  },
                },
              },
              {
                $addFields: {
                  [`convertedphones`]: {
                    $replaceAll: {
                      input: '$convertedphones',
                      find: ')',
                      replacement: '',
                    },
                  },
                },
              },
              {
                $addFields: {
                  [`convertedphones`]: {
                    $replaceAll: {
                      input: '$convertedphones',
                      find: '-',
                      replacement: '',
                    },
                  },
                },
              },
              { ...match },
              { $limit: 100 },
              { ...unset },
            ]);
            if (valuesList.length > 0) {
              res.status(200).json({ success: true, data: valuesList });
            } else {
              res.status(200).json({
                success: true,
                data: [],
              });
            }
          } else {
            const multiMap = await hz.getMultiMap(modelName);
            const dataIsExist = await multiMap.containsKey(`all${modelName}`);
            if (dataIsExist) {
              const values = await multiMap.get(`all${modelName}`);
              for (const value of values) {
                var filterdHotels = [];
                if (fieldValue !== 'phones' && fieldValue !== 'fax') {
                  const searchRegex = new RegExp(
                    escapeRegExp(filterValue),
                    'i'
                  );
                  filterdHotels = value.filter((row) => {
                    return Object.keys(row).some((field) => {
                      if (field == fieldValue && row[field] !== null) {
                        return searchRegex.test(row[field].toString());
                      }
                    });
                  });
                } else {
                  const searchRegex = new RegExp(
                    escapeRegExp(
                      filterValue
                        .substring(1)
                        .replaceAll(/\s/g, '')
                        .replaceAll('(', '')
                        .replaceAll(')', '')
                        .replaceAll('-', '')
                    ),
                    'i'
                  );
                  filterdHotels = value.filter((row) => {
                    return Object.keys(row).some((field) => {
                      if (field == fieldValue && row[field] !== null) {
                        return searchRegex.test(
                          row[field]
                            // .substring(1)
                            .replaceAll(/\s/g, '')
                            .replaceAll('(', '')
                            .replaceAll(')', '')
                            .replaceAll('-', '')
                            .replaceAll(',', '')
                        );
                      }
                    });
                  });
                }
                if (filterdHotels.length > 0) {
                  res.status(200).json({
                    success: true,
                    data: paginate(
                      filterdHotels.sort(
                        sort_by('hotelName', false, (a) => a.toUpperCase())
                      ),
                      100,
                      1
                    ),
                  });
                  await hz.shutdown();
                } else {
                  res.status(200).json({
                    success: true,
                    data: [],
                  });
                  await hz.shutdown();
                }
              }
            } else {
              var match = {
                $match: { [fieldValue]: searchRegex },
              };
              var addFields = {
                $addFields: {},
              };
              var phoneAddFields = {
                $addFields: {},
              };
              var unset = {
                $unset: `converted${fieldValue}`,
              };
              switch (fieldValue) {
                case 'hotelId':
                  addFields = {
                    $addFields: {
                      [`${`converted${fieldValue}`}`]: {
                        $toString: `$${fieldValue}`,
                      },
                    },
                  };
                  match = {
                    $match: {
                      [`${`converted${fieldValue}`}`]: searchRegex,
                    },
                  };
                  break;
                case 'phones':
                case 'fax':
                  let phoneNumber = filterValue;
                  if (phoneNumber.startsWith('+')) {
                    phoneNumber = phoneNumber.substring(1).replace(/\s/g, '');
                  }
                  const phoneRegex = new RegExp(escapeRegExp(phoneNumber), 'i');
                  match = {
                    $match: {
                      convertedphones: phoneRegex,
                    },
                  };
                  const input = fieldValue == 'phones' ? '$phones' : '$fax';
                  addFields = {
                    $addFields: {
                      [`${`convertedphones`}`]: {
                        $replaceAll: {
                          input: input,
                          find: '+',
                          replacement: '',
                        },
                      },
                    },
                  };
                  unset = {
                    $unset: `convertedphones`,
                  };
                  break;
              }
              const valuesList = await collection.aggregate([
                { $sort: { name: 1 } },
                { ...addFields },
                {
                  $addFields: {
                    [`convertedphones`]: {
                      $replaceAll: {
                        input: '$convertedphones',
                        find: '(',
                        replacement: '',
                      },
                    },
                  },
                },
                {
                  $addFields: {
                    [`convertedphones`]: {
                      $replaceAll: {
                        input: '$convertedphones',
                        find: ' ',
                        replacement: '',
                      },
                    },
                  },
                },
                {
                  $addFields: {
                    [`convertedphones`]: {
                      $replaceAll: {
                        input: '$convertedphones',
                        find: ')',
                        replacement: '',
                      },
                    },
                  },
                },
                {
                  $addFields: {
                    [`convertedphones`]: {
                      $replaceAll: {
                        input: '$convertedphones',
                        find: '-',
                        replacement: '',
                      },
                    },
                  },
                },
                { ...match },
                { $limit: 100 },
                { ...unset },
              ]);
              if (valuesList.length > 0) {
                res.status(200).json({ success: true, data: valuesList });
                await hz.shutdown();
              } else {
                res.status(200).json({
                  success: true,
                  data: [],
                });
                await hz.shutdown();
              }
              await hz.shutdown();
            }
          }
          break;
        default:
          if (hzErrorConnection) {
            var collection = mongoose.model(modelName);
            const valuesList = await collection.aggregate([
              { $sort: { name: 1 } },
              { $match: { [fieldValue]: searchRegex } },
              { $limit: 50 },
            ]);
            if (valuesList.length > 0) {
              res.status(200).json({ success: true, data: valuesList });
            } else {
              res.status(200).json({
                success: true,
                data: [],
              });
            }
          } else {
            const multiMap = await hz.getMultiMap(modelName);
            const dataIsExist = await multiMap.containsKey(`all${modelName}`);
            if (dataIsExist) {
              const values = await multiMap.get(`all${modelName}`);
              for (const value of values) {
                const filterdData = value.filter((row) => {
                  return Object.keys(row).some((field) => {
                    if (field == fieldValue) {
                      if (row[field] !== null) {
                        return searchRegex.test(row[field].toString());
                      }
                    }
                  });
                });
                if (filterdData.length > 0) {
                  res.status(200).json({
                    success: true,
                    data: paginate(
                      filterdData.sort(
                        sort_by('title_en', false, (a) => a.toUpperCase())
                      ),
                      50,
                      1
                    ),
                  });
                  await hz.shutdown();
                } else {
                  res.status(200).json({
                    success: true,
                    data: [],
                  });
                  await hz.shutdown();
                }
              }
            } else {
              var collection = mongoose.model(modelName);
              const valuesList = await collection.aggregate([
                { $sort: { name: 1 } },
                { $match: { [fieldValue]: searchRegex } },
                { $limit: 50 },
              ]);
              if (valuesList.length > 0) {
                res.status(200).json({ success: true, data: valuesList });
                await hz.shutdown();
              } else {
                res.status(200).json({
                  success: true,
                  data: [],
                });
                await hz.shutdown();
              }
            }

            await hz.shutdown();
          }
          break;
      }
    } catch (error) {
      if (!hzErrorConnection) {
        await hz.shutdown();
      }
      res.status(500).json({ success: false, Error: error.toString() });
    }
  }
});

export default apiRoute;
