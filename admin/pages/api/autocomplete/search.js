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
    try {
      const { modelName, fieldValue, filterValue } = req.body;
      const { hzErrorConnection, hz } = await hazelCast();
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
                  'states.cities.country_id': '$_id',
                  'states.cities.state_name': '$states.name',
                  'states.cities.state_id': '$states._id',
                  'states.cities.stateId': '$states.id',
                  'states.cities.countryId': '$id',
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
                } else {
                  res.status(200).json({
                    success: true,
                    data: [],
                  });
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
              } else {
                res.status(200).json({ success: true, data: [] });
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
                },
              },
              { $unset: 'states' },
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
                } else {
                  res.status(200).json({
                    success: true,
                    data: [],
                  });
                }
              }
            } else {
              const valuesList = await collection.aggregate([
                { $sort: { name: 1 } },
                { $match: { [fieldValue]: searchRegex } },
                { $limit: 50 },
                {
                  $addFields: {
                    totalStates: { $size: '$states' },
                  },
                },
                { $unset: 'states' },
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
          break;
        case 'global_countries':
          const fileToRead = `${process.cwd()}/public/locationsData/countries+states+cities.json`;
          let rawdata = fs.readFileSync(fileToRead);
          let data = JSON.parse(rawdata);
          // var collection = mongoose.model('Countries');
          // var activesIds = await collection.find({}, { _id: false, id: true });
          data.map((doc) => {
            doc.totalStates = doc.states.length;
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
          } else {
            res.status(200).json({
              success: true,
              data: [],
            });
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
                } else {
                  res.status(200).json({
                    success: true,
                    data: [],
                  });
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
              } else {
                res.status(200).json({
                  success: true,
                  data: [],
                });
              }
            }
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
          } else {
            res.status(200).json({
              success: true,
              data: [],
            });
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
                } else {
                  res.status(200).json({
                    success: true,
                    data: [],
                  });
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
              } else {
                res.status(200).json({
                  success: true,
                  data: [],
                });
              }
            }
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
                  } else {
                    res.status(200).json({
                      success: true,
                      data: [],
                    });
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
                } else {
                  res.status(200).json({
                    success: true,
                    data: [],
                  });
                }
              }
            }
          } else {
            if (hzErrorConnection) {
              let phoneNumber = filterValue;
              if (!phoneNumber.startsWith('+')) {
                phoneNumber = [
                  phoneNumber.slice(0, 0),
                  '+',
                  phoneNumber.slice(0),
                ].join('');
              }
              const phoneRegex = new RegExp(escapeRegExp(phoneNumber), 'i');
              const valuesList = await collection.aggregate([
                { $sort: { agentName: 1 } },
                { $match: { 'phones.number': phoneRegex } },
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
                          return searchRegex.test(
                            row[field].map((a, i) => a.number)[0].toString()
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
                if (!phoneNumber.startsWith('+')) {
                  phoneNumber = [
                    phoneNumber.slice(0, 0),
                    '+',
                    phoneNumber.slice(0),
                  ].join('');
                }
                const phoneRegex = new RegExp(escapeRegExp(phoneNumber), 'i');
                const valuesList = await collection.aggregate([
                  { $sort: { agentName: 1 } },
                  { $match: { 'phones.number': phoneRegex } },
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
              }
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
                } else {
                  res.status(200).json({
                    success: true,
                    data: [],
                  });
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
              } else {
                res.status(200).json({
                  success: true,
                  data: [],
                });
              }
            }
          }
          break;
      }
    } catch (error) {
      res.status(500).json({ success: false, Error: error.toString() });
    }
  }
});

export default apiRoute;
