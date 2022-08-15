const nextConnect = require('next-connect');
const async = require('async');
const Pusher = require('pusher');
import dbConnect from '../../../helpers/dbConnect';
import verifyToken from '../../../helpers/verifyToken';
import hazelCast from '../../../helpers/hazelCast';
import axios from 'axios';
import Countries from '../../../models/Countries';
import Hotels from '../../../models/Hotels';
import Accommodationnull from '../../../models/Accommodationnull';
import socketHandler from '../../../helpers/socket';

function paginate(array, valuesPerPage, valuesPageNumber) {
  // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
  return array.slice(
    (valuesPageNumber - 1) * valuesPerPage,
    valuesPageNumber * valuesPerPage
  );
}

function makeid(length) {
  var result = '';
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
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
let pusher;
if (isVercel) {
  pusher = new Pusher({
    appId: process.env.NEXT_PUBLIC_PUSHER_APPID,
    key: process.env.NEXT_PUBLIC_PUSHER_KEY,
    secret: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    cluster: 'ap1',
    useTLS: true,
  });
}
apiRoute.post(verifyToken, async (req, res, next) => {
  const dbConnected = await dbConnect();
  const {
    iso2,
    hotelReady,
    hotelNotComplete,
    valuesPerPage,
    valuesPageNumber,
    valuesSortBySorting,
    modelName,
  } = req.body;
  const hotelsUrl = `${process.env.NEXT_PUBLIC_API_LINK}/hotels/${iso2.charAt(
    0
  )}/${iso2}`;
  const nullHotelsUrl = `${
    process.env.NEXT_PUBLIC_API_LINK
  }/nullHotels/${iso2.charAt(0)}/${iso2}`;
  const { success } = dbConnected;
  if (!success) {
    res.status(500).json({ success: false, Error: dbConnected.error });
  } else {
    try {
      const { hzErrorConnection, hz } = await hazelCast();
      const country = await Countries.findOne({
        iso2: iso2,
        isCountryActive: true,
      });
      if (country == null) {
        res.status(403).json({ success: false, Error: `countryNotActive` });
      } else {
        let io;
        if (!isVercel) {
          io = socketHandler(req, res);
        }
        const existHotels = await Hotels.distinct('countryIso2');
        switch (existHotels.includes(iso2)) {
          //Hotel was already added just change the stautus to active
          case true:
            await updateCountry(iso2, true);
            await hotelsUpdateMany(iso2, true);
            const activeIds = await findActiveIds();
            if (hotelNotComplete > 0) {
              await updateHotelList(
                req,
                res,
                activeIds,
                valuesSortBySorting,
                hzErrorConnection,
                hz,
                modelName,
                valuesPerPage,
                valuesPageNumber
              );
            } else {
              res.status(200).json({
                success: true,
                totalValuesLength: 1,
                activesId: [],
                data: [],
              });
            }
            break;
          case false:
            const activesId = await findActiveIds();
            if (hotelReady > 0) {
              await getHotelsReady(
                req,
                res,
                hotelsUrl,
                country,
                iso2,
                io,
                activesId,
                hzErrorConnection,
                hz
              );
            }
            if (hotelNotComplete > 0) {
              const exist = await findExistNull(iso2);
              if (exist == null) {
                await getNullHotels(
                  req,
                  res,
                  nullHotelsUrl,
                  country,
                  hzErrorConnection,
                  hz,
                  hotelReady,
                  iso2,
                  io
                );
              } else if (exist !== null && hotelReady == 0) {
                await updateCountry(iso2, true);
                res.status(200).json({
                  success: true,
                  totalValuesLength: 1,
                  activesId: [],
                  data: [],
                });
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

async function updateHotelList(
  req,
  res,
  activesId,
  valuesSortBySorting,
  hzErrorConnection,
  hz,
  modelName,
  valuesPerPage,
  valuesPageNumber
) {
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
        // await hz.shutdown();
      }
    }
  }
}

export function firstLevelSort(arr, valuesSortBySorting, req) {
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

async function hotelsUpdateMany(iso2, status) {
  await Hotels.updateMany({ countryIso2: iso2 }, { isActive: status });
}

async function updateCountry(iso2, status) {
  await Countries.updateOne(
    { iso2: iso2 },
    { $set: { isHotelsActive: status } }
  );
}

async function getHotelsReady(
  req,
  res,
  hotelsUrl,
  country,
  iso2,
  io,
  activesId,
  hzErrorConnection,
  hz
) {
  axios
    .get(hotelsUrl)
    .then(async (resp) => {
      let fixedHotel = fixResult(req, country, resp.data);
      if (!hzErrorConnection) {
        const hotelMap = await hz.getMultiMap('Hotels');
        await hotelMap.put(`allHotels`, fixedHotel);
        // await hz.shutdown();
      }
      await importCountry(
        res,
        fixedHotel,
        iso2,
        io,
        activesId,
        hzErrorConnection,
        hz
      );
    })
    .catch((resp) => {
      if (resp.isAxiosError) {
        res.status(resp.response.status).json({
          success: resp.response.data.success,
          Error: resp.response.data.Error,
        });
      }
    });
}

async function getNullHotels(
  req,
  res,
  nullHotelsUrl,
  country,
  hzErrorConnection,
  hz,
  hotelReady,
  iso2,
  io
) {
  try {
    axios
      .get(nullHotelsUrl)
      .then(async (resp) => {
        const nullHotelsObj = {};
        nullHotelsObj.id = country.id;
        nullHotelsObj.name = country.name;
        nullHotelsObj.iso2 = country.iso2;
        nullHotelsObj.iso3 = country.iso3;
        nullHotelsObj.emoji = country.emoji;
        let nHotels = fixNullResult(req, country, resp.data);
        nullHotelsObj.hotels = nHotels;
        if (!hzErrorConnection) {
          const hotelNullMap = await hz.getMultiMap('NullHotels');
          await hotelNullMap.put(`allNullHotels`, nullHotelsObj);
          // await hz.shutdown();
        }
        Accommodationnull.create(nullHotelsObj, async (err, result) => {
          if (err) {
            res.status(500).json({ success: false, Error: err.toString() });
          }
          if (hotelReady == 0) {
            await Countries.updateOne(
              { iso2: iso2 },
              { $set: { isHotelsActive: true } }
            );
            res.status(200).json({
              success: true,
              totalValuesLength: 1,
              activesId: [],
              data: result,
            });
          }
          if (isVercel) {
            pusher.trigger('hotelsImport', 'hotelsImportNull', {
              done: `null hotels of  ${iso2} was added`,
            });
          } else {
            io.sockets.emit('hotelsImportDone', {
              done: `null hotels of  ${iso2} was added`,
            });
          }
        });
      })
      .catch((resp) => {
        if (resp.isAxiosError) {
          res.status(resp.response.status).json({
            success: resp.response.data.success,
            Error: resp.response.data.Error,
          });
        }
      });
  } catch (error) {
    res.status(500).json({ success: false, Error: error.toString() });
  }
}

function fixResult(req, country, arr) {
  arr.forEach((element) => {
    element.province_id = element.state_id;
    element[`state_id`] = element[`province_id`];
    delete element[`state_id`];
    element.provinceName = element.state_name;
    element[`state_name`] = element[`provinceName`];
    delete element[`state_name`];
    element.city_id = element.cityId;
    element[`cityId`] = element[`city_id`];
    delete element[`cityId`];
    country.states.map((a) => {
      a.id == element.province_id ? (element.province_id = [a._id]) : null;
      a.cities.map((c) => {
        c.id == element.city_id ? (element.city_id = [c._id]) : null;
      });
    });
    element.country_id = [country._id];
    element[`active`] = element[`isActive`];
    delete element[`active`];
    element.isActive = true;
    element.rooms_id = [];
    element.facilities_id = [];
    element.isVercel = isVercel;
    element.finalFolder = 'hotels';
    element.countryFolder = country.iso2;
    element.folderId = makeid(20);
    element.hotelThumb = '';
    element.hotelImages = [];
    element.userCreated = [req?.user?._id];
    element.userUpdated = [req?.user?._id];
  });
  const filterHotels = arr.filter((a) => {
    if (typeof a.city_id !== 'number' || typeof a.province_id !== 'number') {
      return a;
    }
  });
  const uniqueIds = [];
  const unique = filterHotels.filter((element) => {
    const isDuplicate = uniqueIds.includes(element.Giataid);
    if (!isDuplicate) {
      uniqueIds.push(element.Giataid);

      return true;
    }

    return false;
  });
  return unique;
}

function fixNullResult(req, country, arr) {
  arr.forEach((element) => {
    element.province_id = element.state_id;
    element[`state_id`] = element[`province_id`];
    delete element[`state_id`];
    element.provinceName = element.state_name;
    element[`state_name`] = element[`provinceName`];
    delete element[`state_name`];
    element.city_id = element.cityId;
    element[`cityId`] = element[`city_id`];
    delete element[`cityId`];
    element.country_id = [country._id];
    element[`active`] = element[`isActive`];
    delete element[`active`];
    element.isActive = false;
    element.rooms_id = [];
    element.facilities_id = [];
    element.isVercel = isVercel;
    element.finalFolder = 'hotels';
    element.countryFolder = country.iso2;
    element.folderId = makeid(20);
    element.hotelThumb = '';
    element.hotelImages = [];
    element.userCreated = [req?.user?._id];
    element.userUpdated = [req?.user?._id];
  });

  return arr;
}

async function importCountry(
  res,
  fixedHotel,
  iso2,
  io,
  activesId,
  hzErrorConnection,
  hz
) {
  try {
    Hotels.insertMany(fixedHotel, async (err, result) => {
      if (err) {
        res.status(500).json({ success: false, Error: err.toString() });
      }
      let count = 0;
      async.eachSeries(
        result,
        function updateObject(obj, done) {
          if (!isVercel) {
            count++;
            io.sockets.emit('hotelsImportCount', {
              percentage: Math.round((count * 100) / result.length),
            });
          }
          Countries.updateOne(
            { _id: { $in: obj.country_id } },
            {
              $set: { isHotelsActive: true },
              $addToSet: {
                hotels_id: obj._id,
                'states.$[outer].hotels_id': obj._id,
                'states.$[outer].cities.$[inner].hotels_id': obj._id,
              },
            },
            {
              arrayFilters: [
                { 'outer._id': obj.province_id[0] },
                { 'inner._id': obj.city_id[0] },
              ],
            },
            done
          );
        },
        async function allDone(err) {
          // this will be called when all the updates are done or an error occurred during the iteration
          if (err) {
            res.status(500).json({ success: false, Error: err.toString() });
          }
          if (isVercel) {
            pusher.trigger('hotelsImport', 'hotelsImportDone', {
              done: `${result.length} hotels was activated in ${iso2}`,
            });
          } else {
            io.sockets.emit('hotelsImportDone', {
              done: `${result.length} hotels was activated in ${iso2}`,
            });
          }
          if (!hzErrorConnection) {
            const multiMap = await hz.getMultiMap('Countries');
            const multiMapP = await hz.getMultiMap('Provinces');
            const multiMapC = await hz.getMultiMap('Cities');
            await multiMap.destroy();
            await multiMapP.destroy();
            await multiMapC.destroy();
            // await hz.shutdown();
          }
          res.status(200).json({
            success: true,
            totalValuesLength: fixedHotel.length,
            activesId: activesId,
            data: result,
          });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ success: false, Error: err.toString() });
  }
}

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

async function findExistNull(iso2) {
  const exist = await Accommodationnull.findOne(
    {
      iso2: iso2,
    },
    { hotels: 0 }
  );
  return exist;
}

export default apiRoute;
