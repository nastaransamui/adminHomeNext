import Roles from '../models/Roles';
import Currencies from '../models/Currencies';
import Countries from '../models/Countries';
import Agencies from '../models/Agencies';
import Users from '../models/Users';
import mongoose from 'mongoose';
import hazelCast from './hazelCast';
var _ = require('lodash');

export async function createObjectsId(req, res, next, result, callback) {
  const { modelName } = req.body;
  const { hzErrorConnection, hz } = await hazelCast();
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
          if (!hzErrorConnection) {
            const rolesMap = await hz.getMultiMap('Roles');
            const rolesdataIsExist = await rolesMap.containsKey(`allRoles`);
            if (rolesdataIsExist) {
              const rolesData = await rolesMap.get(`allRoles`);
              for (const roles of rolesData) {
                const roleIndex = roles.findIndex(
                  (obj) => obj._id == result.role_id[0].toString()
                );
                if (roleIndex !== -1) {
                  roles[roleIndex].users_id.push(result._id.toString());
                }
                await rolesMap.clear(`allRoles`);
                await rolesMap.put(`allRoles`, roles);
              }
            }
          }
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
          if (!hzErrorConnection) {
            const countryMap = await hz.getMultiMap('Countries');
            const countrydataIsExist = await countryMap.containsKey(
              `allCountries`
            );
            if (countrydataIsExist) {
              const countriesData = await countryMap.get(`allCountries`);
              for (const countries of countriesData) {
                const countryIndex = countries.findIndex(
                  (obj) => obj._id == result.country_id[0].toString()
                );
                if (countryIndex !== -1) {
                  countries[countryIndex].totalUsers++;
                  countries[countryIndex].users_id.push(result._id.toString());
                }
                await countryMap.clear(`allCountries`);
                await countryMap.put(`allCountries`, countries);
              }
            }
          }
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
          if (!hzErrorConnection) {
            const provinceMap = await hz.getMultiMap('Provinces');
            const provincedataIsExist = await provinceMap.containsKey(
              `allProvinces`
            );
            if (provincedataIsExist) {
              const provinceData = await provinceMap.get(`allProvinces`);
              for (const provinces of provinceData) {
                const provinceIndex = provinces.findIndex(
                  (obj) => obj._id == result.province_id[0].toString()
                );
                if (provinceIndex !== -1) {
                  provinces[provinceIndex].totalUsers++;
                  provinces[provinceIndex].users_id.push(result._id.toString());
                }
                await provinceMap.clear(`allProvinces`);
                await provinceMap.put(`allProvinces`, provinces);
              }
            }
          }
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
          if (!hzErrorConnection) {
            const cityMap = await hz.getMultiMap('Cities');
            const citiesdataIsExist = await cityMap.containsKey(`allCities`);
            if (citiesdataIsExist) {
              const citiesData = await cityMap.get(`allCities`);
              for (const cities of citiesData) {
                const cityIndex = cities.findIndex(
                  (obj) => obj._id == result.city_id[0].toString()
                );
                if (cityIndex !== -1) {
                  console.log(cities[cityIndex]);
                  console.log('cities[cityIndex]');
                  cities[cityIndex].totalUsers++;
                  cities[cityIndex].users_id.push(result._id.toString());
                }
                await cityMap.clear(`allCities`);
                await cityMap.put(`allCities`, cities);
              }
            }
          }
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
        if (!hzErrorConnection) {
          //UpdateCountry
          const countryMap = await hz.getMultiMap('Countries');
          const countrydataIsExist = await countryMap.containsKey(
            `allCountries`
          );
          if (countrydataIsExist) {
            const countriesData = await countryMap.get(`allCountries`);
            for (const countries of countriesData) {
              const countryIndex = countries.findIndex(
                (obj) => obj._id == result.country_id[0].toString()
              );
              if (countryIndex !== -1) {
                countries[countryIndex].totalUsers++;
                countries[countryIndex].users_id.push(result._id.toString());
              }
              await countryMap.clear(`allCountries`);
              await countryMap.put(`allCountries`, countries);
            }
          }

          //Update province
          const provinceMap = await hz.getMultiMap('Provinces');
          const provincedataIsExist = await provinceMap.containsKey(
            `allProvinces`
          );
          if (provincedataIsExist) {
            const provinceData = await provinceMap.get(`allProvinces`);
            for (const provinces of provinceData) {
              const provinceIndex = provinces.findIndex(
                (obj) => obj._id == result.province_id[0].toString()
              );
              if (provinceIndex !== -1) {
                provinces[provinceIndex].totalUsers++;
                provinces[provinceIndex].users_id.push(result._id.toString());
              }
              await provinceMap.clear(`allProvinces`);
              await provinceMap.put(`allProvinces`, provinces);
            }
          }

          //update city
          const cityMap = await hz.getMultiMap('Cities');
          const citiesdataIsExist = await cityMap.containsKey(`allCities`);
          if (citiesdataIsExist) {
            const citiesData = await cityMap.get(`allCities`);
            for (const cities of citiesData) {
              const cityIndex = cities.findIndex(
                (obj) => obj._id == result.city_id[0].toString()
              );
              if (cityIndex !== -1) {
                cities[cityIndex].totalUsers++;
                cities[cityIndex].users_id.push(result._id.toString());
              }
              await cityMap.clear(`allCities`);
              await cityMap.put(`allCities`, cities);
            }
          }

          if (result.accountManager_id.length > 0) {
            const userMap = await hz.getMultiMap('Users');
            const userdataIsExist = await userMap.containsKey(`allUsers`);
            if (userdataIsExist) {
              const userData = await userMap.get(`allUsers`);
              for (const users of userData) {
                const userIndex = users.findIndex(
                  (obj) => obj._id == result.accountManager_id[0]?.toString()
                );
                users[userIndex].agents_id.push(result._id.toString());

                await userMap.clear(`allUsers`);
                await userMap.put(`allUsers`, users);
              }
            }
          }
        }
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
        if (!hzErrorConnection) {
          const countryMap = await hz.getMultiMap('Countries');
          const countrydataIsExist = await countryMap.containsKey(
            `allCountries`
          );
          if (countrydataIsExist) {
            const countriesData = await countryMap.get(`allCountries`);
            for (const countries of countriesData) {
              const countryIndex = countries.findIndex(
                (obj) => obj._id == result.country_id[0].toString()
              );
              if (countryIndex !== -1) {
                countries[countryIndex].totalActiveHotels++;
                countries[countryIndex].hotels_id.push(result._id.toString());
              }
              await countryMap.clear(`allCountries`);
              await countryMap.put(`allCountries`, countries);
            }
          }
          //update province hotel
          const provinceMap = await hz.getMultiMap('Provinces');
          const provincedataIsExist = await provinceMap.containsKey(
            `allProvinces`
          );
          if (provincedataIsExist) {
            const provinceData = await provinceMap.get(`allProvinces`);
            for (const provinces of provinceData) {
              const provinceIndex = provinces.findIndex(
                (obj) => obj._id == result.province_id[0].toString()
              );
              if (provinceIndex !== -1) {
                provinces[provinceIndex].totalHotels++;
                provinces[provinceIndex].hotels_id.push(result._id.toString());
              }
              await provinceMap.clear(`allProvinces`);
              await provinceMap.put(`allProvinces`, provinces);
            }
          }
          //Update cities hotel
          const cityMap = await hz.getMultiMap('Cities');
          const citiesdataIsExist = await cityMap.containsKey(`allCities`);
          if (citiesdataIsExist) {
            const citiesData = await cityMap.get(`allCities`);
            for (const cities of citiesData) {
              const cityIndex = cities.findIndex(
                (obj) => obj._id == result.city_id[0].toString()
              );
              if (cityIndex !== -1) {
                cities[cityIndex].totalHotels++;
                cities[cityIndex].hotels_id.push(result._id.toString());
              }
              await cityMap.clear(`allCities`);
              await cityMap.put(`allCities`, cities);
            }
          }
        }
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
  const { hzErrorConnection, hz } = await hazelCast();
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
          if (!hzErrorConnection) {
            const rolesMap = await hz.getMultiMap('Roles');
            const rolesdataIsExist = await rolesMap.containsKey(`allRoles`);
            if (rolesdataIsExist) {
              const rolesData = await rolesMap.get(`allRoles`);
              for (const roles of rolesData) {
                const roleIndex = roles.findIndex(
                  (obj) => obj._id == result.role_id[0].toString()
                );
                if (roleIndex !== -1) {
                  const indexOfOldUserId = roles[roleIndex].users_id.indexOf(
                    result?._id.toString()
                  );
                  if (indexOfOldUserId !== -1) {
                    roles[roleIndex].users_id.splice(indexOfOldUserId, 1);
                  }
                }
                await rolesMap.clear(`allRoles`);
                await rolesMap.put(`allRoles`, roles);
              }
            }
          }
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
          if (!hzErrorConnection) {
            const countryMap = await hz.getMultiMap('Countries');
            const countrydataIsExist = await countryMap.containsKey(
              `allCountries`
            );
            if (countrydataIsExist) {
              const countriesData = await countryMap.get(`allCountries`);
              for (const countries of countriesData) {
                const countryIndex = countries.findIndex(
                  (obj) => obj._id == result.country_id[0].toString()
                );
                if (countryIndex !== -1) {
                  const indexOfOldUserId = countries[
                    countryIndex
                  ].users_id.indexOf(result?._id.toString());
                  if (indexOfOldUserId !== -1) {
                    countries[countryIndex].users_id.splice(
                      indexOfOldUserId,
                      1
                    );
                    countries[countryIndex].totalUsers--;
                  }
                }
                await countryMap.clear(`allCountries`);
                await countryMap.put(`allCountries`, countries);
              }
            }
          }
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
          if (!hzErrorConnection) {
            const provinceMap = await hz.getMultiMap('Provinces');
            const provincedataIsExist = await provinceMap.containsKey(
              `allProvinces`
            );
            if (provincedataIsExist) {
              const provinceData = await provinceMap.get(`allProvinces`);
              for (const provinces of provinceData) {
                const provinceIndex = provinces.findIndex(
                  (obj) => obj._id == result.province_id[0].toString()
                );
                if (provinceIndex !== -1) {
                  const indexOfOldUserId = provinces[
                    provinceIndex
                  ].users_id.indexOf(result?._id.toString());
                  if (indexOfOldUserId !== -1) {
                    provinces[provinceIndex].users_id.splice(
                      indexOfOldUserId,
                      1
                    );
                    provinces[provinceIndex].totalUsers--;
                  }
                }
                await provinceMap.clear(`allProvinces`);
                await provinceMap.put(`allProvinces`, provinces);
              }
            }
          }
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

          if (!hzErrorConnection) {
            const cityMap = await hz.getMultiMap('Cities');
            const citiesdataIsExist = await cityMap.containsKey(`allCities`);
            if (citiesdataIsExist) {
              const citiesData = await cityMap.get(`allCities`);
              for (const cities of citiesData) {
                const cityIndex = cities.findIndex(
                  (obj) => obj._id == result.city_id[0].toString()
                );
                if (cityIndex !== -1) {
                  const indexOfOldUserId = cities[cityIndex].users_id.indexOf(
                    result?._id.toString()
                  );
                  if (indexOfOldUserId !== -1) {
                    cities[cityIndex].users_id.splice(indexOfOldUserId, 1);
                    cities[cityIndex].totalUsers--;
                  }
                }
                await cityMap.clear(`allCities`);
                await cityMap.put(`allCities`, cities);
              }
            }
          }
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

export async function updateObjectId(req, oldValue, callback) {
  const { modelName } = req.body;
  const newValue = req.body;
  const { hzErrorConnection, hz } = await hazelCast();
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

          if (!hzErrorConnection) {
            //Update country
            const countryMap = await hz.getMultiMap('Countries');
            const countrydataIsExist = await countryMap.containsKey(
              `allCountries`
            );
            if (countrydataIsExist) {
              const countriesData = await countryMap.get(`allCountries`);
              for (const countries of countriesData) {
                const oldCountryIndex = countries.findIndex(
                  (obj) => obj._id == oldValue.country_id[0].toString()
                );
                const newCountrieIndex = countries.findIndex(
                  (obj) => obj._id == newValue.country_id[0].toString()
                );
                const indexOfOldUserId = countries[
                  oldCountryIndex
                ].agents_id.indexOf(oldValue?._id.toString());
                if (indexOfOldUserId !== -1) {
                  countries[oldCountryIndex].agents_id.splice(
                    indexOfOldUserId,
                    1
                  );
                  countries[oldCountryIndex].totalAgents--;
                }

                if (newCountrieIndex !== -1) {
                  countries[newCountrieIndex].agents_id.push(
                    oldValue?._id.toString()
                  );
                  countries[newCountrieIndex].totalAgents++;
                }
                await countryMap.clear(`allCountries`);
                await countryMap.put(`allCountries`, countries);
              }
            }
            //Update province
            const provinceMap = await hz.getMultiMap('Provinces');
            const provincedataIsExist = await provinceMap.containsKey(
              `allProvinces`
            );
            if (provincedataIsExist) {
              const provinceData = await provinceMap.get(`allProvinces`);
              for (const provinces of provinceData) {
                const oldProvinceIndex = provinces.findIndex(
                  (obj) => obj._id == oldValue.province_id[0].toString()
                );
                const newProvinceIndex = provinces.findIndex(
                  (obj) => obj._id == newValue.province_id[0].toString()
                );
                const indexOfOldUserId = provinces[
                  oldProvinceIndex
                ].agents_id.indexOf(oldValue?._id.toString());
                if (oldProvinceIndex !== -1) {
                  provinces[oldProvinceIndex].agents_id.splice(
                    indexOfOldUserId,
                    1
                  );
                  provinces[oldProvinceIndex].totalAgents--;
                }

                if (newProvinceIndex !== -1) {
                  provinces[newProvinceIndex].agents_id.push(
                    oldValue?._id.toString()
                  );
                  provinces[newProvinceIndex].totalAgents++;
                }
                await provinceMap.clear(`allProvinces`);
                await provinceMap.put(`allProvinces`, provinces);
              }
            }

            //Update city
            const cityMap = await hz.getMultiMap('Cities');
            const citiesdataIsExist = await cityMap.containsKey(`allCities`);
            if (citiesdataIsExist) {
              const citiesData = await cityMap.get(`allCities`);
              for (const cities of citiesData) {
                const oldCityIndex = cities.findIndex(
                  (obj) => obj._id == oldValue.city_id[0].toString()
                );
                const newCityIndex = cities.findIndex(
                  (obj) => obj._id == newValue.city_id[0].toString()
                );
                const indexOfOldUserId = cities[oldCityIndex].agents_id.indexOf(
                  oldValue?._id.toString()
                );
                if (oldCityIndex !== -1) {
                  cities[oldCityIndex].agents_id.splice(indexOfOldUserId, 1);
                  cities[oldCityIndex].totalAgents--;
                }

                if (newCityIndex !== -1) {
                  cities[newCityIndex].agents_id.push(oldValue?._id.toString());
                  cities[newCityIndex].totalAgents++;
                }
                await cityMap.clear(`allCities`);
                await cityMap.put(`allCities`, cities);
              }
            }
          }
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
          if (!hzErrorConnection) {
            const currencyMap = await hz.getMultiMap('Currencies');
            const currencydataIsExist = await currencyMap.containsKey(
              `allCurrencies`
            );
            if (currencydataIsExist) {
              const currencyData = await currencyMap.get(`allCurrencies`);
              for (const currencies of currencyData) {
                const oldCurrencyIndex = currencies.findIndex(
                  (obj) => obj._id == oldValue.currencyCode_id[0].toString()
                );
                const newCurrencyIndex = currencies.findIndex(
                  (obj) => obj._id == newValue.currencyCode_id[0].toString()
                );
                const indexOfOldUserId = currencies[
                  oldCurrencyIndex
                ].agents_id.indexOf(oldValue?._id.toString());
                if (indexOfOldUserId !== -1) {
                  currencies[oldCurrencyIndex].agents_id.splice(
                    indexOfOldUserId,
                    1
                  );
                  currencies[oldCurrencyIndex].totalAgents--;
                }

                if (newCurrencyIndex !== -1) {
                  currencies[newCurrencyIndex].agents_id.push(
                    oldValue?._id.toString()
                  );
                  currencies[newCurrencyIndex].totalAgents++;
                }
                await currencyMap.clear(`allCurrencies`);
                await currencyMap.put(`allCurrencies`, currencies);
              }
            }
          }
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
          if (!hzErrorConnection) {
            const userMap = await hz.getMultiMap('Users');
            const userdataIsExist = await userMap.containsKey(`allUsers`);
            if (userdataIsExist) {
              const userData = await userMap.get(`allUsers`);
              for (const users of userData) {
                const oldUserIndex = users.findIndex(
                  (obj) => obj._id == oldValue?.accountManager_id[0]?.toString()
                );
                const newUserIndex = users.findIndex(
                  (obj) => obj._id == newValue.accountManager_id[0]?.toString()
                );
                if (oldUserIndex !== -1) {
                  const indexOfOldAgentId = users[
                    oldUserIndex
                  ].agents_id.indexOf(oldValue?._id.toString());
                  if (indexOfOldAgentId !== -1) {
                    users[oldUserIndex].agents_id.splice(indexOfOldAgentId, 1);
                  }
                }
                if (newUserIndex !== -1) {
                  users[newUserIndex].agents_id.push(oldValue?._id.toString());
                }
                await userMap.clear(`allUsers`);
                await userMap.put(`allUsers`, users);
              }
            }
          }
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
          valueChanged.includes('province_id') ||
          valueChanged.includes('country_id');
        var roleChanged = valueChanged.includes('role_id');
        var agentChanged = valueChanged.includes('agents_id');
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
          if (!hzErrorConnection) {
            //Update country
            const countryMap = await hz.getMultiMap('Countries');
            const countrydataIsExist = await countryMap.containsKey(
              `allCountries`
            );
            if (countrydataIsExist) {
              const countriesData = await countryMap.get(`allCountries`);
              for (const countries of countriesData) {
                const oldCountryIndex = countries.findIndex(
                  (obj) => obj._id == oldValue.country_id[0].toString()
                );
                const newCountrieIndex = countries.findIndex(
                  (obj) => obj._id == newValue.country_id[0].toString()
                );
                const indexOfOldUserId = countries[
                  oldCountryIndex
                ].users_id.indexOf(oldValue?._id.toString());
                if (indexOfOldUserId !== -1) {
                  countries[oldCountryIndex].users_id.splice(
                    indexOfOldUserId,
                    1
                  );
                  countries[oldCountryIndex].totalUsers--;
                }

                if (newCountrieIndex !== -1) {
                  countries[newCountrieIndex].users_id.push(
                    oldValue?._id.toString()
                  );
                  countries[newCountrieIndex].totalUsers++;
                }
                await countryMap.clear(`allCountries`);
                await countryMap.put(`allCountries`, countries);
              }
            }
            //Update province
            const provinceMap = await hz.getMultiMap('Provinces');
            const provincedataIsExist = await provinceMap.containsKey(
              `allProvinces`
            );
            if (provincedataIsExist) {
              const provinceData = await provinceMap.get(`allProvinces`);
              for (const provinces of provinceData) {
                const oldProvinceIndex = provinces.findIndex(
                  (obj) => obj._id == oldValue.province_id[0].toString()
                );
                const newProvinceIndex = provinces.findIndex(
                  (obj) => obj._id == newValue.province_id[0].toString()
                );
                const indexOfOldUserId = provinces[
                  oldProvinceIndex
                ].users_id.indexOf(oldValue?._id.toString());
                if (oldProvinceIndex !== -1) {
                  provinces[oldProvinceIndex].users_id.splice(
                    indexOfOldUserId,
                    1
                  );
                  provinces[oldProvinceIndex].totalUsers--;
                }

                if (newProvinceIndex !== -1) {
                  provinces[newProvinceIndex].users_id.push(
                    oldValue?._id.toString()
                  );
                  provinces[newProvinceIndex].totalUsers++;
                }
                await provinceMap.clear(`allProvinces`);
                await provinceMap.put(`allProvinces`, provinces);
              }
            }

            //Update city
            const cityMap = await hz.getMultiMap('Cities');
            const citiesdataIsExist = await cityMap.containsKey(`allCities`);
            if (citiesdataIsExist) {
              const citiesData = await cityMap.get(`allCities`);
              for (const cities of citiesData) {
                const oldCityIndex = cities.findIndex(
                  (obj) => obj._id == oldValue.city_id[0].toString()
                );
                const newCityIndex = cities.findIndex(
                  (obj) => obj._id == newValue.city_id[0].toString()
                );
                const indexOfOldUserId = cities[oldCityIndex].users_id.indexOf(
                  oldValue?._id.toString()
                );
                if (oldCityIndex !== -1) {
                  cities[oldCityIndex].users_id.splice(indexOfOldUserId, 1);
                  cities[oldCityIndex].totalUsers--;
                }

                if (newCityIndex !== -1) {
                  cities[newCityIndex].users_id.push(oldValue?._id.toString());
                  cities[newCityIndex].totalUsers++;
                }
                await cityMap.clear(`allCities`);
                await cityMap.put(`allCities`, cities);
              }
            }
          }
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
          if (!hzErrorConnection) {
            const rolesMap = await hz.getMultiMap('Roles');
            const rolesMapExist = await rolesMap.containsKey(`allRoles`);
            if (rolesMapExist) {
              const rolesData = await rolesMap.get(`allRoles`);
              for (const roles of rolesData) {
                const oldRoleIndex = roles.findIndex(
                  (obj) => obj._id == oldValue.role_id
                );
                const newRoleIndex = roles.findIndex(
                  (obj) => obj._id == newValue.role_id
                );
                const indexOfOldUserId = roles[oldRoleIndex].users_id.indexOf(
                  oldValue?._id.toString()
                );
                if (indexOfOldUserId !== -1) {
                  roles[oldRoleIndex].users_id.splice(indexOfOldUserId, 1);
                }
                roles[newRoleIndex]?.users_id.push(oldValue?._id.toString());

                await rolesMap.clear(`allRoles`);
                await rolesMap.put(`allRoles`, roles);
              }
            }
            await hz.shutdown();
          }
        }
        if (agentChanged) {
          let agentsDeleteIds = oldValue.agents_id.filter(
            (x) => !newValue.agents_id.includes(x.toString())
          );
          await Agencies.updateMany(
            { _id: { $in: agentsDeleteIds } },
            { $set: { accountManager_id: [], accountManager: '' } },
            { multi: true }
          );
          if (!hzErrorConnection) {
            const agentsMap = await hz.getMultiMap('Agencies');
            const agentsMapExist = await agentsMap.containsKey(`allAgencies`);
            if (agentsMapExist) {
              const agentsData = await agentsMap.get(`allAgencies`);
              for (const agents of agentsData) {
                const stringDeleteArray = agentsDeleteIds.map((a) =>
                  a.toString()
                );
                const updateAgents = agents.map((item) => {
                  if (stringDeleteArray.includes(item._id)) {
                    item.accountManager_id = [];
                    item.accountManager = '';
                  }
                  return item;
                });
                await agentsMap.clear(`allAgencies`);
                await agentsMap.put(`allAgencies`, updateAgents);
              }
            }
          }
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

          if (!hzErrorConnection) {
            //Update country
            const countryMap = await hz.getMultiMap('Countries');
            const countrydataIsExist = await countryMap.containsKey(
              `allCountries`
            );
            if (countrydataIsExist) {
              const countriesData = await countryMap.get(`allCountries`);
              for (const countries of countriesData) {
                const oldCountryIndex = countries.findIndex(
                  (obj) => obj._id == oldValue.country_id[0].toString()
                );
                const newCountrieIndex = countries.findIndex(
                  (obj) => obj._id == newValue.country_id[0].toString()
                );
                const indexOfOldUserId = countries[
                  oldCountryIndex
                ].hotels_id.indexOf(oldValue?._id.toString());
                if (indexOfOldUserId !== -1) {
                  countries[oldCountryIndex].hotels_id.splice(
                    indexOfOldUserId,
                    1
                  );
                  countries[oldCountryIndex].totalActiveHotels--;
                }

                if (newCountrieIndex !== -1) {
                  countries[newCountrieIndex].hotels_id.push(
                    oldValue?._id.toString()
                  );
                  countries[newCountrieIndex].totalActiveHotels++;
                }
                await countryMap.clear(`allCountries`);
                await countryMap.put(`allCountries`, countries);
              }
            }
            //Update province
            const provinceMap = await hz.getMultiMap('Provinces');
            const provincedataIsExist = await provinceMap.containsKey(
              `allProvinces`
            );
            if (provincedataIsExist) {
              const provinceData = await provinceMap.get(`allProvinces`);
              for (const provinces of provinceData) {
                const oldProvinceIndex = provinces.findIndex(
                  (obj) => obj._id == oldValue.province_id[0].toString()
                );
                const newProvinceIndex = provinces.findIndex(
                  (obj) => obj._id == newValue.province_id[0].toString()
                );
                const indexOfOldUserId = provinces[
                  oldProvinceIndex
                ].hotels_id.indexOf(oldValue?._id.toString());
                if (oldProvinceIndex !== -1) {
                  provinces[oldProvinceIndex].hotels_id.splice(
                    indexOfOldUserId,
                    1
                  );
                  provinces[oldProvinceIndex].totalHotels--;
                }

                if (newProvinceIndex !== -1) {
                  provinces[newProvinceIndex].hotels_id.push(
                    oldValue?._id.toString()
                  );
                  provinces[newProvinceIndex].totalHotels++;
                }
                await provinceMap.clear(`allProvinces`);
                await provinceMap.put(`allProvinces`, provinces);
              }
            }

            //Update city
            const cityMap = await hz.getMultiMap('Cities');
            const citiesdataIsExist = await cityMap.containsKey(`allCities`);
            if (citiesdataIsExist) {
              const citiesData = await cityMap.get(`allCities`);
              for (const cities of citiesData) {
                const oldCityIndex = cities.findIndex(
                  (obj) => obj._id == oldValue.city_id[0].toString()
                );
                const newCityIndex = cities.findIndex(
                  (obj) => obj._id == newValue.city_id[0].toString()
                );
                const indexOfOldUserId = cities[oldCityIndex].hotels_id.indexOf(
                  oldValue?._id.toString()
                );
                if (oldCityIndex !== -1) {
                  cities[oldCityIndex].hotels_id.splice(indexOfOldUserId, 1);
                  cities[oldCityIndex].totalHotels--;
                }

                if (newCityIndex !== -1) {
                  cities[newCityIndex].hotels_id.push(oldValue?._id.toString());
                  cities[newCityIndex].totalHotels++;
                }
                await cityMap.clear(`allCities`);
                await cityMap.put(`allCities`, cities);
              }
            }
          }
        }
        callback(false, null);
      } catch (error) {
        callback(true, error);
      }
      break;

    default:
      console.log('Update object Id default ');
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
