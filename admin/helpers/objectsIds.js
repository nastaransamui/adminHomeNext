import Roles from '../models/Roles';
import Currencies from '../models/Currencies';
import Countries from '../models/Countries';
import Users from '../models/Users';
import mongoose from 'mongoose';
var _ = require('lodash');

export async function updateObjectsId(req, res, next, result, callback) {
  const { modelName } = req.body;
  try {
    switch (modelName) {
      case 'Users':
        if (result.role_id.length > 0) {
          await Roles.updateOne(
            { _id: { $in: result.role_id } },
            {
              $addToSet: {
                users_id: result._id,
              },
            },
            { multi: true }
          );
        }
        if (result.country_id.length > 0) {
          await Countries.updateOne(
            { _id: { $in: result.country_id } },
            {
              $addToSet: {
                users_id: result._id,
              },
            },
            { multi: true }
          );
        }
        if (result.province_id.length > 0) {
          await Countries.updateOne(
            { 'states._id': { $in: result.province_id } },
            {
              $addToSet: {
                'states.$.users_id': result._id,
              },
            },
            { multi: true }
          );
        }

        if (result.city_id.length > 0) {
          await Countries.updateOne(
            { 'states.cities._id': { $in: result.city_id } },
            {
              $addToSet: {
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
        callback(false, null);
        break;
      case 'Agencies':
        await Countries.updateOne(
          { _id: { $in: result.country_id } },
          {
            $addToSet: {
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
            $addToSet: {
              agents_id: result._id,
            },
          },
          { multi: true }
        );
        await Users.updateOne(
          { _id: { $in: result.accountManager_id } },
          {
            $addToSet: {
              agents_id: result._id,
            },
          },
          { multi: true }
        );
        callback(false, null);
        break;
      case 'Hotels':
        await Countries.updateOne(
          { _id: { $in: result.country_id } },
          {
            $addToSet: {
              hotels_id: result._id,
              'states.$[outer].hotels_id': result._id,
              'states.$[outer].cities.$[inner].hotels_id': result._id,
            },
          },
          {
            arrayFilters: [
              { 'outer._id': result.province_id },
              { 'inner._id': result.city_id },
            ],
          }
        );
        callback(false, null);
        break;
      default:
        callback(false, null);
        break;
    }
  } catch (error) {
    callback(true, error);
  }
}

//check if body has array
export var isJsonParsable = (string) => {
  try {
    JSON.parse(string);
    return Array.isArray(JSON.parse(string));
  } catch (e) {
    return false;
  }
};

export function userInvolvedError(result) {
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

export async function deleteObjectsId(req, res, next, result, callback) {
  const { modelName } = req.body;
  switch (modelName) {
    case 'Users':
      try {
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
        callback(false, null);
      } catch (error) {
        callback(true, error);
      }
      break;
    case 'Agencies':
      try {
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
              { 'outer._id': mongoose.Types.ObjectId(result.province_id[0]) },
              { 'inner._id': mongoose.Types.ObjectId(result.city_id[0]) },
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
        if (result?.accountManager_id?.length > 0) {
          await Users.updateOne(
            { _id: { $in: result.accountManager_id } },
            {
              $pull: {
                agents_id: result._id,
              },
            },
            { multi: true }
          );
        }

        callback(false, null);
      } catch (error) {
        callback(true, error);
      }
      break;

    case 'Hotels':
      try {
        await Countries.updateOne(
          { _id: { $in: result.country_id } },
          {
            $pull: {
              hotels_id: result._id,
              'states.$[outer].hotels_id': result._id,
              'states.$[outer].cities.$[inner].hotels_id': result._id,
            },
          },
          {
            arrayFilters: [
              { 'outer._id': mongoose.Types.ObjectId(result.province_id[0]) },
              { 'inner._id': mongoose.Types.ObjectId(result.city_id[0]) },
            ],
          }
        );
        callback(false, null);
      } catch (error) {
        callback(true, error);
      }
      break;
    default:
      break;
  }
}

export async function deleteAddIds(req, oldValue, callback) {
  const { modelName } = req.body;
  const newValue = req.body;
  switch (modelName) {
    case 'Agencies':
      try {
        var valueChanged = compareObj(newValue, oldValue);
        var countryChanged =
          valueChanged.includes('city_id') ||
          valueChanged.includes('country_id');
        var currencyChanged = valueChanged.includes('currencyCode_id');
        var accountManagerChanged = valueChanged.includes('accountManager_id');
        if (countryChanged) {
          await Countries.bulkWrite([
            {
              updateOne: {
                filter: { _id: { $in: oldValue.country_id } },
                update: {
                  $pull: {
                    agents_id: oldValue._id,
                    'states.$[outer].agents_id': oldValue._id,
                    'states.$[outer].cities.$[inner].agents_id': oldValue._id,
                  },
                },
                arrayFilters: [
                  {
                    'outer._id': mongoose.Types.ObjectId(
                      oldValue.province_id[0]
                    ),
                  },
                  { 'inner._id': mongoose.Types.ObjectId(oldValue.city_id[0]) },
                ],
              },
            },
            {
              updateOne: {
                filter: { _id: { $in: newValue.country_id } },
                update: {
                  $addToSet: {
                    agents_id: oldValue._id,
                    'states.$[outer].agents_id': oldValue._id,
                    'states.$[outer].cities.$[inner].agents_id': oldValue._id,
                  },
                },
                arrayFilters: [
                  {
                    'outer._id': mongoose.Types.ObjectId(
                      newValue.province_id[0]
                    ),
                  },
                  { 'inner._id': mongoose.Types.ObjectId(newValue.city_id[0]) },
                ],
              },
            },
          ]);
        }
        if (currencyChanged) {
          await Currencies.bulkWrite([
            {
              updateOne: {
                filter: { _id: { $in: oldValue.currencyCode_id } },
                update: {
                  $pull: {
                    agents_id: oldValue._id,
                  },
                },
              },
            },
            {
              updateOne: {
                filter: { _id: { $in: newValue.currencyCode_id } },
                update: {
                  $addToSet: {
                    agents_id: oldValue._id,
                  },
                },
              },
            },
          ]);
        }
        if (accountManagerChanged) {
          await Users.bulkWrite([
            {
              updateOne: {
                filter: { _id: { $in: oldValue.accountManager_id } },
                update: {
                  $pull: {
                    agents_id: oldValue._id,
                  },
                },
              },
            },
            {
              updateOne: {
                filter: { _id: { $in: newValue.accountManager_id } },
                update: {
                  $addToSet: {
                    agents_id: oldValue._id,
                  },
                },
              },
            },
          ]);
        }
        callback(false, null);
      } catch (error) {
        callback(true, error);
      }
      break;
    case 'Users':
      try {
        var valueChanged = compareObj(newValue, oldValue);
        var countryChanged =
          valueChanged.includes('city_id') ||
          valueChanged.includes('country_id');
        var roleChanged = valueChanged.includes('role_id');
        if (countryChanged) {
          await Countries.bulkWrite([
            {
              updateOne: {
                filter: { _id: { $in: oldValue.country_id } },
                update: {
                  $pull: {
                    users_id: oldValue._id,
                    'states.$[outer].users_id': oldValue._id,
                    'states.$[outer].cities.$[inner].users_id': oldValue._id,
                  },
                },
                arrayFilters: [
                  {
                    'outer._id': mongoose.Types.ObjectId(
                      oldValue.province_id[0]
                    ),
                  },
                  { 'inner._id': mongoose.Types.ObjectId(oldValue.city_id[0]) },
                ],
              },
            },
            {
              updateOne: {
                filter: { _id: { $in: newValue.country_id } },
                update: {
                  $addToSet: {
                    users_id: oldValue._id,
                    'states.$[outer].users_id': oldValue._id,
                    'states.$[outer].cities.$[inner].users_id': oldValue._id,
                  },
                },
                arrayFilters: [
                  {
                    'outer._id': mongoose.Types.ObjectId(
                      newValue.province_id[0]
                    ),
                  },
                  { 'inner._id': mongoose.Types.ObjectId(newValue.city_id[0]) },
                ],
              },
            },
          ]);
        }
        if (roleChanged) {
          await Roles.bulkWrite([
            {
              updateOne: {
                filter: { _id: { $in: oldValue.role_id } },
                update: {
                  $pull: {
                    users_id: oldValue._id,
                  },
                },
              },
            },
            {
              updateOne: {
                filter: { _id: { $in: newValue.role_id } },
                update: {
                  $addToSet: {
                    users_id: oldValue._id,
                  },
                },
              },
            },
          ]);
        }
        callback(false, null);
      } catch (error) {
        callback(true, error);
      }
      break;
    case 'Hotels':
      try {
        var valueChanged = compareObj(newValue, oldValue);
        var countryChanged =
          valueChanged.includes('city_id') ||
          valueChanged.includes('country_id');
        if (countryChanged) {
          await Countries.bulkWrite([
            {
              updateOne: {
                filter: { _id: { $in: oldValue.country_id } },
                update: {
                  $pull: {
                    hotels_id: oldValue._id,
                    'states.$[outer].hotels_id': oldValue._id,
                    'states.$[outer].cities.$[inner].hotels_id': oldValue._id,
                  },
                },
                arrayFilters: [
                  {
                    'outer._id': mongoose.Types.ObjectId(
                      oldValue.province_id[0]
                    ),
                  },
                  { 'inner._id': mongoose.Types.ObjectId(oldValue.city_id[0]) },
                ],
              },
            },
            {
              updateOne: {
                filter: { _id: { $in: newValue.country_id } },
                update: {
                  $addToSet: {
                    hotels_id: oldValue._id,
                    'states.$[outer].hotels_id': oldValue._id,
                    'states.$[outer].cities.$[inner].hotels_id': oldValue._id,
                  },
                },
                arrayFilters: [
                  {
                    'outer._id': mongoose.Types.ObjectId(
                      newValue.province_id[0]
                    ),
                  },
                  { 'inner._id': mongoose.Types.ObjectId(newValue.city_id[0]) },
                ],
              },
            },
          ]);
        }
        callback(false, null);
      } catch (error) {
        callback(true, error);
      }
      break;

    default:
      break;
  }
}

export function compareObj(newValue, oldValue) {
  var changedArray = [];
  Object.entries(newValue).forEach((doc) => {
    if (
      Array.isArray(oldValue[doc[0]]) &&
      `${[doc[1]]}` !== '[object Object]' &&
      doc[0] !== 'userCreated' &&
      doc[0] !== 'userUpdated'
    ) {
      if (`${oldValue[doc[0]]}` !== `${[doc[1]]}`) {
        changedArray.push(doc[0]);
      }
    }
  });
  return changedArray;
}
