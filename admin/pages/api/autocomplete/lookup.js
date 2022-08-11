const nextConnect = require('next-connect');
import dbConnect from '../../../helpers/dbConnect';
import verifyToken from '../../../helpers/verifyToken';
import hazelCast from '../../../helpers/hazelCast';
import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';
import Agencies from '../../../models/Agencies';
import Roles from '../../../models/Roles';
import Users from '../../../models/Users';

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
      const { modelName, fieldValue, filterValue, lookupFrom, _id } = req.body;
      const { hzErrorConnection, hz } = await hazelCast();
      const searchRegex = new RegExp(escapeRegExp(filterValue), 'i');
      var collection = mongoose.model(modelName);
      async function usersAgencyLookup() {
        //Initiate match
        var match = {
          $match: { [`agentsData.${fieldValue}`]: searchRegex },
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
                [`agentsData.${`converted${fieldValue}`}`]: {
                  $toString: `$agentsData.${fieldValue}`,
                },
              },
            };
            match = {
              $match: {
                [`agentsData.${`converted${fieldValue}`}`]: searchRegex,
              },
            };
            break;
          case 'phones':
            let phoneNumber = filterValue;
            if (!phoneNumber.startsWith('+')) {
              phoneNumber = [
                phoneNumber.slice(0, 0),
                '+',
                phoneNumber.slice(0),
              ].join('');
            }
            const phoneRegex = new RegExp(escapeRegExp(phoneNumber), 'i');
            match = {
              $match: { [`agentsData.${fieldValue}.number`]: phoneRegex },
            };
            break;
        }
        var valuesList = await collection.aggregate([
          { $match: { _id: ObjectId(_id) } },
          { $unset: ['password'] },
          {
            $lookup: {
              from: 'agencies',
              localField: 'agents_id',
              foreignField: '_id',
              as: 'agentsData',
            },
          },
          { $unwind: '$agentsData' },
          { ...addFields },
          { ...match },
          { $sort: { 'agentsData.agentName': 1 } },
          { $limit: 50 },
          { ...unset },
          { $group: { _id: null, agentsData: { $push: '$agentsData' } } },
        ]);
        if (valuesList.length > 0) {
          res
            .status(200)
            .json({ success: false, data: valuesList[0].agentsData });
        } else {
          res.status(200).json({ success: true, data: [] });
        }
      }
      async function rolesUsersLookup() {
        //Initiate match
        var match = {
          $match: { [`usersData.${fieldValue}`]: searchRegex },
        };
        var valuesList = await collection.aggregate([
          { $match: { _id: ObjectId(_id) } },
          {
            $lookup: {
              from: 'users',
              localField: 'users_id',
              pipeline: [
                {
                  $project: {
                    password: 0,
                    twitter: 0,
                    google: 0,
                    facebook: 0,
                    roleName: 0,
                    role_id: 0,
                    province_id: 0,
                    profileImageKey: 0,
                    folderId: 0,
                    finalFolder: 0,
                    country_id: 0,
                    city_id: 0,
                    accessToken: 0,
                  },
                },
              ],
              foreignField: '_id',
              as: 'usersData',
            },
          },
          { $unwind: '$usersData' },
          { ...match },
          { $sort: { 'usersData.userName': 1 } },
          { $limit: 50 },
          { $group: { _id: null, usersData: { $push: '$usersData' } } },
        ]);
        if (valuesList.length > 0) {
          res
            .status(200)
            .json({ success: false, data: valuesList[0].usersData });
        } else {
          res.status(200).json({ success: true, data: [] });
        }
      }
      if (hzErrorConnection) {
        switch (modelName) {
          case 'Users':
            if (lookupFrom == 'agencies') {
              await usersAgencyLookup();
            }
            break;
          case 'Roles':
            if (lookupFrom == 'users') {
              await rolesUsersLookup();
            }
            break;
        }
      } else {
        const lookupFromModelName =
          lookupFrom.charAt(0).toUpperCase() + lookupFrom.slice(1);
        const mainMultiMap = await hz.getMultiMap(modelName);
        const mainDataIsExist = await mainMultiMap.containsKey(
          `all${modelName}`
        );
        const lookupFromMultiMap = await hz.getMultiMap(lookupFromModelName);
        const lookupFromDataIsExist = await lookupFromMultiMap.containsKey(
          `all${lookupFromModelName}`
        );
        switch (modelName) {
          case 'Users':
            if (lookupFrom == 'agencies') {
              if (mainDataIsExist && lookupFromDataIsExist) {
                const usersValues = await mainMultiMap.get(`all${modelName}`);
                const agenciesValues = await lookupFromMultiMap.get(
                  `all${lookupFromModelName}`
                );
                for (const userValue of usersValues) {
                  const user = userValue.filter((a) => a._id == _id);
                  for (const agencyValue of agenciesValues) {
                    const agencies = agencyValue.filter((a) =>
                      user[0].agents_id.includes(a._id)
                    );
                    const filterdData = agencies.filter((row) => {
                      if (fieldValue !== 'phones') {
                        return Object.keys(row).some((field) => {
                          if (row[field] !== null) {
                            return searchRegex.test(row[field].toString());
                          }
                        });
                      } else {
                        return Object.keys(row).some((field) => {
                          let phoneNumber = filterValue;
                          if (!phoneNumber.startsWith('+')) {
                            phoneNumber = [
                              phoneNumber.slice(0, 0),
                              '+',
                              phoneNumber.slice(0),
                            ].join('');
                          }
                          const phoneRegex = new RegExp(
                            escapeRegExp(phoneNumber),
                            'i'
                          );
                          if (row[field] !== null) {
                            return phoneRegex.test(
                              row['phones'].map((a) => a.number).join()
                            );
                          }
                        });
                      }
                    });
                    user[0].agentsData = filterdData.slice(0, 50);
                    if (filterdData.length > 0) {
                      res
                        .status(200)
                        .json({ success: false, data: user[0].agentsData });
                    } else {
                      res.status(200).json({ success: true, data: [] });
                    }
                  }
                }
                await hz.shutdown();
              } else {
                await usersAgencyLookup();
              }
            }
            break;
          case 'Roles':
            if (lookupFrom == 'users') {
              if (mainDataIsExist && lookupFromDataIsExist) {
                const rolesValues = await mainMultiMap.get(`all${modelName}`);
                const usersValues = await lookupFromMultiMap.get(
                  `all${lookupFromModelName}`
                );
                for (const roleValue of rolesValues) {
                  const role = roleValue.filter((a) => a._id == _id);
                  for (const userValue of usersValues) {
                    const users = userValue.filter((a) =>
                      role[0].users_id.includes(a._id)
                    );
                    const filterdData = users.filter((row) => {
                      delete row.twitter;
                      delete row.google;
                      delete row.facebook;
                      delete row.facebook;
                      delete row.roleName;
                      delete row.role_id;
                      delete row.province_id;
                      delete row.profileImageKey;
                      delete row.folderId;
                      delete row.finalFolder;
                      delete row.country_id;
                      delete row.city_id;
                      return Object.keys(row).some((field) => {
                        if (row[field] !== null) {
                          return searchRegex.test(row[field].toString());
                        }
                      });
                    });
                    role[0].usersData = filterdData.slice(0, 50);
                    if (filterdData.length > 0) {
                      res
                        .status(200)
                        .json({ success: false, data: role[0].usersData });
                    } else {
                      res.status(200).json({ success: true, data: [] });
                    }
                  }
                }
                await hz.shutdown();
              } else {
                await rolesUsersLookup();
              }
            }
            break;
        }
      }
    } catch (error) {
      res.status(500).json({ success: false, Error: error.toString() });
    }
  }
});

export default apiRoute;
