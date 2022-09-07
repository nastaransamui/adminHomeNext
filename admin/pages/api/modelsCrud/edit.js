const nextConnect = require('next-connect');
import dbConnect from '../../../helpers/dbConnect';
import verifyToken from '../../../helpers/verifyToken';
import multiparty from '../../../middleware/multiparty';
import hazelCast from '../../../helpers/hazelCast';
import mongoose from 'mongoose';
import About from '../../../models/About';
import Agencies from '../../../models/Agencies';
import Countries from '../../../models/Countries';
import Features from '../../../models/Features';
import Hotels from '../../../models/Hotels';
import Photos from '../../../models/Photos';
import Roles from '../../../models/Roles';
import Users from '../../../models/Users';
import Videos from '../../../models/Videos';
import { fileUploadMiddelWare } from '../../../middleware/filesUploadMiddelWare';
import { awsDelete, fsDelete } from '../../../helpers/fileSystem';
import {
  createObjectsId,
  isJsonParsable,
  roleInvolvedError,
  deleteObjectsId,
  updateObjectId,
  compareObj,
} from '../../../helpers/objectsIds';
import verifySingleActive from '../../../helpers/verifySingleActive';
import { setCookies } from 'cookies-next';
import {
  hashPassword,
  findUserById,
  findHotelById,
  jwtSign,
  findRoleById,
  findAgentById,
} from '../../../helpers/auth';

var _ = require('lodash');
const apiRoute = nextConnect({
  onNoMatch(req, res) {
    res
      .status(405)
      .json({ success: false, Error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(multiparty);

apiRoute.post(
  verifyToken,
  hashPassword,
  verifySingleActive,
  fileUploadMiddelWare,
  async (req, res, next) => {
    const dbConnected = await dbConnect();
    const { success } = dbConnected;
    if (!success) {
      res.status(500).json({ success: false, Error: dbConnected.error });
    } else {
      const { hzErrorConnection, hz } = await hazelCast();
      try {
        const { _id, modelName, selfProfileUpdate, newFilesRecord } = req.body;
        var collection = mongoose.model(modelName);
        delete req.body._id;
        // loop throgh body and parse if it's array
        Object.entries(req.body).forEach((key) => {
          if (isJsonParsable(key[1])) {
            req.body[key[0]] = JSON.parse(key[1]);
          }
        });
        switch (modelName) {
          case 'Hotels':
            findHotelById(_id).then(async (oldHotel) => {
              if (compareObj(req.body, oldHotel).length > 0) {
                await updateObjectId(req, oldHotel, (status, error) => {
                  if (status) {
                    res.status(403).json({
                      success: false,
                      Error: error.toString(),
                    });
                  } else {
                    //update oldvalue
                    for (var key in req.body) {
                      if (
                        typeof oldHotel[key] !== 'function' &&
                        req.body[key] !== undefined
                      ) {
                        oldHotel[key] = req.body[key];
                      }
                    }
                    oldHotel.save(async (err, result) => {
                      if (err) {
                        // If files uplaoded delete them
                        if (req.files.length > 0) {
                          if (req.body.isVercel) {
                            awsDelete(
                              req,
                              res,
                              next,
                              newFilesRecord,
                              (status, error) => {
                                if (status) {
                                  res.status(403).json({
                                    success: false,
                                    Error: error.toString(),
                                  });
                                } else {
                                  res.status(403).json({
                                    success: false,
                                    Error: err.toString(),
                                    keyPattern: err?.keyPattern,
                                    ErrorCode: err?.code,
                                  });
                                }
                              }
                            );
                          } else {
                            fsDelete(
                              req,
                              res,
                              next,
                              newFilesRecord,
                              (status, error) => {
                                if (status) {
                                  res.status(403).json({
                                    success: false,
                                    Error: error.toString(),
                                  });
                                } else {
                                  res.status(403).json({
                                    success: false,
                                    Error: err.toString(),
                                    keyPattern: err?.keyPattern,
                                    ErrorCode: err?.code,
                                  });
                                }
                              }
                            );
                          }
                        } else {
                          res.status(403).json({
                            success: false,
                            Error: err.toString(),
                            keyPattern: err?.keyPattern,
                            ErrorCode: err?.code,
                          });
                        }
                      } else {
                        if (!hzErrorConnection) {
                          const multiMap = await hz.getMultiMap(modelName);
                          const dataIsExist = await multiMap.containsKey(
                            `all${modelName}`
                          );
                          if (dataIsExist) {
                            const values = await multiMap.get(
                              `all${modelName}`
                            );
                            for (const value of values) {
                              const objIndex = value.findIndex(
                                (obj) => obj._id == _id
                              );
                              value[objIndex] = result;
                              await multiMap.clear(`all${modelName}`);
                              await multiMap.put(`all${modelName}`, value);
                            }
                          }
                          await hz.shutdown();
                        }
                        res.status(200).json({
                          success: true,
                          totalAgentLength: 0,
                          data: result,
                        });
                      }
                    });
                  }
                });
              } else {
                //update oldvalue without change
                for (var key in req.body) {
                  if (
                    typeof oldHotel[key] !== 'function' &&
                    req.body[key] !== undefined
                  ) {
                    oldHotel[key] = req.body[key];
                  }
                }
                oldHotel.save(async (err, result) => {
                  if (err) {
                    // If files uplaoded delete them
                    if (req.files.length > 0) {
                      if (req.body.isVercel) {
                        awsDelete(
                          req,
                          res,
                          next,
                          newFilesRecord,
                          (status, error) => {
                            if (status) {
                              res.status(403).json({
                                success: false,
                                Error: error.toString(),
                              });
                            } else {
                              res.status(403).json({
                                success: false,
                                Error: err.toString(),
                                keyPattern: err?.keyPattern,
                                ErrorCode: err?.code,
                              });
                            }
                          }
                        );
                      } else {
                        fsDelete(
                          req,
                          res,
                          next,
                          newFilesRecord,
                          (status, error) => {
                            if (status) {
                              res.status(403).json({
                                success: false,
                                Error: error.toString(),
                              });
                            } else {
                              res.status(403).json({
                                success: false,
                                Error: err.toString(),
                                keyPattern: err?.keyPattern,
                                ErrorCode: err?.code,
                              });
                            }
                          }
                        );
                      }
                    } else {
                      res.status(403).json({
                        success: false,
                        Error: err.toString(),
                        keyPattern: err?.keyPattern,
                        ErrorCode: err?.code,
                      });
                    }
                  } else {
                    if (!hzErrorConnection) {
                      const multiMap = await hz.getMultiMap(modelName);
                      const dataIsExist = await multiMap.containsKey(
                        `all${modelName}`
                      );
                      if (dataIsExist) {
                        const values = await multiMap.get(`all${modelName}`);
                        for (const value of values) {
                          const objIndex = value.findIndex(
                            (obj) => obj._id == _id
                          );
                          value[objIndex] = result;
                          await multiMap.clear(`all${modelName}`);
                          await multiMap.put(`all${modelName}`, value);
                        }
                      }
                      await hz.shutdown();
                    }
                    res.status(200).json({
                      success: true,
                      totalAgentLength: 0,
                      data: result,
                    });
                  }
                });
              }
            });
            break;

          case 'Users':
            //Check if Password change if not delete from object
            if (req.body.password == '') {
              delete req.body.password;
            }
            findUserById(_id).then(async (oldUser) => {
              if (compareObj(req.body, oldUser).length > 0) {
                await updateObjectId(req, oldUser, async (status, error) => {
                  if (status) {
                    res.status(403).json({
                      success: false,
                      Error: error.toString(),
                    });
                  } else {
                    //update oldvalue
                    for (var key in req.body) {
                      if (
                        typeof oldUser[key] !== 'function' &&
                        req.body[key] !== undefined
                      ) {
                        oldUser[key] = req.body[key];
                        if (selfProfileUpdate) {
                          const newAccessToken = await jwtSign(oldUser);
                          oldUser.accessToken = newAccessToken;
                          setCookies('adminAccessToken', newAccessToken, {
                            req,
                            res,
                          });
                        }
                      }
                    }
                    delete oldUser?.selfProfileUpdate;
                    oldUser.save(async (err, result) => {
                      if (err) {
                        // If files uplaoded delete them
                        if (req.files.length > 0) {
                          if (req.body.isVercel) {
                            awsDelete(
                              req,
                              res,
                              next,
                              newFilesRecord,
                              (status, error) => {
                                if (status) {
                                  res.status(403).json({
                                    success: false,
                                    Error: error.toString(),
                                  });
                                } else {
                                  res.status(403).json({
                                    success: false,
                                    Error: err.toString(),
                                    keyPattern: err?.keyPattern,
                                    ErrorCode: err?.code,
                                  });
                                }
                              }
                            );
                          } else {
                            fsDelete(
                              req,
                              res,
                              next,
                              newFilesRecord,
                              (status, error) => {
                                if (status) {
                                  res.status(403).json({
                                    success: false,
                                    Error: error.toString(),
                                  });
                                } else {
                                  res.status(403).json({
                                    success: false,
                                    Error: err.toString(),
                                    keyPattern: err?.keyPattern,
                                    ErrorCode: err?.code,
                                  });
                                }
                              }
                            );
                          }
                        } else {
                          res.status(403).json({
                            success: false,
                            Error: err.toString(),
                            keyPattern: err?.keyPattern,
                            ErrorCode: err?.code,
                          });
                        }
                      } else {
                        if (!hzErrorConnection) {
                          const multiMap = await hz.getMultiMap(modelName);
                          const dataIsExist = await multiMap.containsKey(
                            `all${modelName}`
                          );
                          if (dataIsExist) {
                            const values = await multiMap.get(
                              `all${modelName}`
                            );
                            for (const value of values) {
                              const objIndex = value.findIndex(
                                (obj) => obj._id == _id
                              );
                              value[objIndex] = result;
                              await multiMap.clear(`all${modelName}`);
                              await multiMap.put(`all${modelName}`, value);
                            }
                          }
                          await hz.shutdown();
                        }
                        res.status(200).json({
                          success: true,
                          totalAgentLength: 0,
                          data: result,
                        });
                      }
                    });
                  }
                });
              } else {
                //update oldvalue without change
                for (var key in req.body) {
                  if (
                    typeof oldUser[key] !== 'function' &&
                    req.body[key] !== undefined
                  ) {
                    oldUser[key] = req.body[key];
                    if (selfProfileUpdate) {
                      const newAccessToken = await jwtSign(oldUser);
                      oldUser.accessToken = newAccessToken;
                      setCookies('adminAccessToken', newAccessToken, {
                        req,
                        res,
                      });
                    }
                  }
                }
                oldUser.save(async (err, result) => {
                  if (err) {
                    // If files uplaoded delete them
                    if (req.files.length > 0) {
                      if (req.body.isVercel) {
                        awsDelete(
                          req,
                          res,
                          next,
                          newFilesRecord,
                          (status, error) => {
                            if (status) {
                              res.status(403).json({
                                success: false,
                                Error: error.toString(),
                              });
                            } else {
                              res.status(403).json({
                                success: false,
                                Error: err.toString(),
                                keyPattern: err?.keyPattern,
                                ErrorCode: err?.code,
                              });
                            }
                          }
                        );
                      } else {
                        fsDelete(
                          req,
                          res,
                          next,
                          newFilesRecord,
                          (status, error) => {
                            if (status) {
                              res.status(403).json({
                                success: false,
                                Error: error.toString(),
                              });
                            } else {
                              res.status(403).json({
                                success: false,
                                Error: err.toString(),
                                keyPattern: err?.keyPattern,
                                ErrorCode: err?.code,
                              });
                            }
                          }
                        );
                      }
                    } else {
                      res.status(403).json({
                        success: false,
                        Error: err.toString(),
                        keyPattern: err?.keyPattern,
                        ErrorCode: err?.code,
                      });
                    }
                  } else {
                    if (!hzErrorConnection) {
                      const multiMap = await hz.getMultiMap(modelName);
                      const dataIsExist = await multiMap.containsKey(
                        `all${modelName}`
                      );
                      if (dataIsExist) {
                        const values = await multiMap.get(`all${modelName}`);
                        for (const value of values) {
                          const objIndex = value.findIndex(
                            (obj) => obj._id == _id
                          );
                          value[objIndex] = result;
                          await multiMap.clear(`all${modelName}`);
                          await multiMap.put(`all${modelName}`, value);
                        }
                      }
                      await hz.shutdown();
                    }
                    res.status(200).json({
                      success: true,
                      totalAgentLength: 0,
                      data: result,
                    });
                  }
                });
              }
            });
            break;

          case 'Roles':
            findRoleById(_id).then(async (oldRole) => {
              const { Error, success } = roleInvolvedError(oldRole);
              if (!req.body?.isActive && !success) {
                res.status(403).json({ success: false, Error: Error });
              } else {
                for (var key in req.body) {
                  if (
                    typeof oldRole[key] !== 'function' &&
                    req.body[key] !== undefined
                  ) {
                    oldRole[key] = req.body[key];
                  }
                }
                oldRole.save(async (err, result) => {
                  if (err) {
                    res.status(403).json({
                      success: false,
                      Error: err.toString(),
                      keyPattern: err?.keyPattern,
                      ErrorCode: err?.code,
                    });
                  } else {
                    res.status(200).json({
                      success: true,
                      totalRolesLength: 0,
                      data: result,
                    });
                    if (!hzErrorConnection) {
                      const multiMap = await hz.getMultiMap(modelName);
                      const dataIsExist = await multiMap.containsKey(
                        `all${modelName}`
                      );
                      if (dataIsExist) {
                        const values = await multiMap.get(`all${modelName}`);
                        for (const value of values) {
                          const objIndex = value.findIndex(
                            (obj) => obj._id == _id
                          );
                          value[objIndex] = result;
                          await multiMap.clear(`all${modelName}`);
                          await multiMap.put(`all${modelName}`, value);
                        }
                      }
                      await hz.shutdown();
                    }
                  }
                });
              }
            });
            break;

          case 'Agencies':
            // delete req.body.deletedImage;
            findAgentById(_id).then(async (oldAgent, err) => {
              //Check _ids field change or not
              if (compareObj(req.body, oldAgent).length > 0) {
                await updateObjectId(req, oldAgent, (status, error) => {
                  if (status) {
                    res.status(403).json({
                      success: false,
                      Error: error.toString(),
                    });
                  } else {
                    //update oldvalue
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
                        // If files uplaoded delete them
                        if (req.files.length > 0) {
                          if (req.body.isVercel) {
                            awsDelete(
                              req,
                              res,
                              next,
                              newFilesRecord,
                              (status, error) => {
                                if (status) {
                                  res.status(403).json({
                                    success: false,
                                    Error: error.toString(),
                                  });
                                } else {
                                  res.status(403).json({
                                    success: false,
                                    Error: err.toString(),
                                    keyPattern: err?.keyPattern,
                                    ErrorCode: err?.code,
                                  });
                                }
                              }
                            );
                          } else {
                            fsDelete(
                              req,
                              res,
                              next,
                              newFilesRecord,
                              (status, error) => {
                                if (status) {
                                  res.status(403).json({
                                    success: false,
                                    Error: error.toString(),
                                  });
                                } else {
                                  res.status(403).json({
                                    success: false,
                                    Error: err.toString(),
                                    keyPattern: err?.keyPattern,
                                    ErrorCode: err?.code,
                                  });
                                }
                              }
                            );
                          }
                        } else {
                          res.status(403).json({
                            success: false,
                            Error: err.toString(),
                            keyPattern: err?.keyPattern,
                            ErrorCode: err?.code,
                          });
                        }
                      } else {
                        if (!hzErrorConnection) {
                          const multiMap = await hz.getMultiMap(modelName);
                          const dataIsExist = await multiMap.containsKey(
                            `all${modelName}`
                          );
                          if (dataIsExist) {
                            const values = await multiMap.get(
                              `all${modelName}`
                            );
                            for (const value of values) {
                              const objIndex = value.findIndex(
                                (obj) => obj._id == _id
                              );
                              value[objIndex] = result;
                              await multiMap.clear(`all${modelName}`);
                              await multiMap.put(`all${modelName}`, value);
                            }
                          }
                          await hz.shutdown();
                        }
                        res.status(200).json({
                          success: true,
                          totalAgentLength: 0,
                          data: result,
                        });
                      }
                    });
                  }
                });
              } else {
                //update oldvalue without change
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
                    // If files uplaoded delete them
                    if (req.files.length > 0) {
                      if (req.body.isVercel) {
                        awsDelete(
                          req,
                          res,
                          next,
                          newFilesRecord,
                          (status, error) => {
                            if (status) {
                              res.status(403).json({
                                success: false,
                                Error: error.toString(),
                              });
                            } else {
                              res.status(403).json({
                                success: false,
                                Error: err.toString(),
                                keyPattern: err?.keyPattern,
                                ErrorCode: err?.code,
                              });
                            }
                          }
                        );
                      } else {
                        fsDelete(
                          req,
                          res,
                          next,
                          newFilesRecord,
                          (status, error) => {
                            if (status) {
                              res.status(403).json({
                                success: false,
                                Error: error.toString(),
                              });
                            } else {
                              res.status(403).json({
                                success: false,
                                Error: err.toString(),
                                keyPattern: err?.keyPattern,
                                ErrorCode: err?.code,
                              });
                            }
                          }
                        );
                      }
                    } else {
                      res.status(403).json({
                        success: false,
                        Error: err.toString(),
                        keyPattern: err?.keyPattern,
                        ErrorCode: err?.code,
                      });
                    }
                  } else {
                    if (!hzErrorConnection) {
                      const multiMap = await hz.getMultiMap(modelName);
                      const dataIsExist = await multiMap.containsKey(
                        `all${modelName}`
                      );
                      if (dataIsExist) {
                        const values = await multiMap.get(`all${modelName}`);
                        for (const value of values) {
                          const objIndex = value.findIndex(
                            (obj) => obj._id == _id
                          );
                          value[objIndex] = result;
                          await multiMap.clear(`all${modelName}`);
                          await multiMap.put(`all${modelName}`, value);
                        }
                      }
                      await hz.shutdown();
                    }
                    res.status(200).json({
                      success: true,
                      totalAgentLength: 0,
                      data: result,
                    });
                  }
                });
              }
            });
            break;

          case 'Countries':
            const { dataType, country_id, state_id } = req.body;
            switch (dataType) {
              case 'Countries':
                req.body.translations = JSON.parse(req?.body?.translations);
                await collection.findById(_id).then(async (oldData) => {
                  for (var key in req.body) {
                    if (
                      typeof oldData[key] !== 'function' &&
                      req.body[key] !== undefined
                    ) {
                      oldData[key] = req.body[key];
                    }
                  }
                  oldData.save(async (err, result) => {
                    if (err) {
                      res.status(403).json({
                        success: false,
                        Error: err.toString(),
                        ErrorCode: err?.code,
                      });
                    } else {
                      if (hzErrorConnection) {
                        res.status(200).json({
                          success: true,
                          totalValuesLength: 0,
                          data: result,
                        });
                      } else {
                        const multiMap = await hz.getMultiMap(modelName);
                        const dataIsExist = await multiMap.containsKey(
                          `all${modelName}`
                        );
                        if (dataIsExist) {
                          const values = await multiMap.get(`all${modelName}`);
                          for (const value of values) {
                            const objIndex = value.findIndex(
                              (obj) => obj._id == _id
                            );
                            delete req.body.id;
                            delete req.body.modelName;
                            delete req.body.dataType;

                            const countryNameChanged =
                              value[objIndex].name !== req.body.name;
                            const currencyChanged =
                              value[objIndex].currency !== req.body.currency ||
                              value[objIndex].currency_name !==
                                req.body.currency_name ||
                              value[objIndex].currency_symbol !==
                                req.body.currency_symbol;
                            if (countryNameChanged) {
                              //Update province
                              const provinceMap = await hz.getMultiMap(
                                'Provinces'
                              );
                              const provinceDataIsExist =
                                await provinceMap.containsKey(`allProvinces`);
                              if (provinceDataIsExist) {
                                const provinceData = await provinceMap.get(
                                  `allProvinces`
                                );
                                for (const provinces of provinceData) {
                                  const updateProvince = provinces.map((a) => {
                                    if (a?.country == value[objIndex].name) {
                                      a.country = req.body.name;
                                    }
                                    return a;
                                  });
                                  await provinceMap.clear(`allProvinces`);
                                  await provinceMap.put(
                                    `allProvinces`,
                                    updateProvince
                                  );
                                }
                              }
                              //Update Cities
                              const cityMap = await hz.getMultiMap('Cities');
                              const citiesDataIsExist =
                                await cityMap.containsKey(`allCities`);
                              if (citiesDataIsExist) {
                                const cityData = await cityMap.get(`allCities`);
                                for (const cities of cityData) {
                                  const updateCity = cities.map((a) => {
                                    if (a?.country == value[objIndex].name) {
                                      a.country = req.body.name;
                                    }
                                    return a;
                                  });
                                  await cityMap.clear(`allCities`);
                                  await cityMap.put(`allCities`, updateCity);
                                }
                              }

                              //Update Hotels
                              // const hotelMap = await hz.getMultiMap('Hotels');
                              // const hotelsDataIsExist =
                              //   await hotelMap.containsKey(`allHotels`);
                              // if (hotelsDataIsExist) {
                              //   const hotelData = await hotelMap.get(
                              //     `allHotels`
                              //   );
                              //   for (const hotels of hotelData) {
                              //     const updateHotels = hotels.map((a) => {
                              //       if (
                              //         a?.countryName == value[objIndex].name
                              //       ) {
                              //         a.countryName = req.body.name;
                              //       }
                              //       return a;
                              //     });
                              //     await hotelMap.clear(`allHotels`);
                              //     await hotelMap.put(`allHotels`, updateHotels);
                              //   }
                              // }
                            }
                            if (currencyChanged) {
                              console.log('currencyChanged');
                            }
                            Object.keys(value[objIndex]).forEach(function (
                              key
                            ) {
                              if (req.body[key] !== undefined) {
                                value[objIndex][key] = req.body[key];
                              }
                            });

                            await multiMap.clear(`all${modelName}`);
                            await multiMap.put(`all${modelName}`, value);
                          }
                        }
                        await hz.shutdown();
                        res.status(200).json({
                          success: true,
                          totalValuesLength: 0,
                          data: result,
                        });
                      }
                    }
                  });
                });
                break;
              case 'Provinces':
                await collection
                  .findOne({ _id: country_id })
                  .then(async (oldData) => {
                    oldData.states.filter((a) => {
                      if (a.id == req.body.id) {
                        a.name = req.body.name;
                        a.type = req.body.type;
                        a.latitude = req.body.latitude;
                        a.longitude = req.body.longitude;
                        return a;
                      }
                    });
                    oldData.save(async (err, result) => {
                      if (err) {
                        res.status(403).json({
                          success: false,
                          Error: err.toString(),
                          ErrorCode: err?.code,
                        });
                      } else {
                        if (hzErrorConnection) {
                          res.status(200).json({
                            success: true,
                            totalValuesLength: 0,
                            data: result,
                          });
                        } else {
                          const provinceMap = await hz.getMultiMap(dataType);
                          const provinceIsExist = await provinceMap.containsKey(
                            `all${dataType}`
                          );
                          if (provinceIsExist) {
                            const provinceData = await provinceMap.get(
                              `all${dataType}`
                            );
                            for (const provinces of provinceData) {
                              const objIndex = provinces.findIndex(
                                (obj) => obj._id == _id
                              );
                              const provinceNameChanged =
                                provinces[objIndex].name !== req.body.name;
                              if (provinceNameChanged) {
                                //Update Cities
                                const cityMap = await hz.getMultiMap('Cities');
                                const citiesDataIsExist =
                                  await cityMap.containsKey(`allCities`);
                                if (citiesDataIsExist) {
                                  const cityData = await cityMap.get(
                                    `allCities`
                                  );
                                  for (const cities of cityData) {
                                    const updateCity = cities.map((a) => {
                                      if (
                                        a?.state_name ==
                                        provinces[objIndex].name
                                      ) {
                                        a.state_name = req.body.name;
                                      }
                                      return a;
                                    });
                                    await cityMap.clear(`allCities`);
                                    await cityMap.put(`allCities`, updateCity);
                                  }
                                }
                              }
                              //update own province
                              provinces[objIndex][`name`] = req.body[`name`];
                              provinces[objIndex][`type`] = req.body[`type`];
                              provinces[objIndex][`latitude`] =
                                req.body[`latitude`];
                              provinces[objIndex][`longitude`] =
                                req.body[`longitude`];

                              await provinceMap.clear(`all${dataType}`);
                              await provinceMap.put(
                                `all${dataType}`,
                                provinces
                              );
                            }
                          }
                          await hz.shutdown();
                          res.status(200).json({
                            success: true,
                            totalValuesLength: 0,
                            data: result,
                          });
                        }
                      }
                    });
                  });
                break;
              case 'Cities':
                await collection
                  .findOne({ _id: country_id })
                  .then(async (oldData) => {
                    const state = oldData.states.filter(
                      (a) => a._id == state_id
                    );
                    state[0].cities.filter((a) => {
                      if (a.id == req.body.id) {
                        a.name = req.body.name;
                        a.latitude = req.body.latitude;
                        a.longitude = req.body.longitude;
                        return a;
                      }
                    });
                    oldData.save(async (err, result) => {
                      if (err) {
                        res.status(403).json({
                          success: false,
                          Error: err.toString(),
                          ErrorCode: err?.code,
                        });
                      } else {
                        if (hzErrorConnection) {
                          res.status(200).json({
                            success: true,
                            totalValuesLength: 0,
                            data: result,
                          });
                        } else {
                          const cityMap = await hz.getMultiMap('Cities');
                          const citiesDataIsExist = await cityMap.containsKey(
                            `allCities`
                          );
                          if (citiesDataIsExist) {
                            const cityData = await cityMap.get(`allCities`);
                            for (const cities of cityData) {
                              const objIndex = cities.findIndex(
                                (obj) => obj._id == _id
                              );
                              cities[objIndex][`name`] = req.body[`name`];
                              cities[objIndex][`latitude`] =
                                req.body[`latitude`];
                              cities[objIndex][`longitude`] =
                                req.body[`longitude`];
                              await cityMap.clear(`allCities`);
                              await cityMap.put(`allCities`, cities);
                            }
                          }
                          await hz.shutdown();
                          res.status(200).json({
                            success: true,
                            totalValuesLength: 0,
                            data: result,
                          });
                        }
                      }
                    });
                  });
                break;
            }
            break;

          default:
            await collection.findById(_id).then(async (oldData) => {
              for (var key in req.body) {
                if (
                  typeof oldData[key] !== 'function' &&
                  req.body[key] !== undefined
                ) {
                  oldData[key] = req.body[key];
                }
              }
              oldData.save(async (err, result) => {
                if (err) {
                  res.status(403).json({
                    success: false,
                    Error: err.toString(),
                    ErrorCode: err?.code,
                  });
                } else {
                  if (hzErrorConnection) {
                    res.status(200).json({
                      success: true,
                      totalValuesLength: 0,
                      data: result,
                    });
                  } else {
                    const multiMap = await hz.getMultiMap(modelName);
                    const dataIsExist = await multiMap.containsKey(
                      `all${modelName}`
                    );
                    if (dataIsExist) {
                      const values = await multiMap.get(`all${modelName}`);
                      for (const value of values) {
                        const objIndex = value.findIndex(
                          (obj) => obj._id == _id
                        );

                        switch (modelName) {
                          case 'Currencies':
                            value[objIndex][`totalAgents`] =
                              req.body.agents_id?.length;
                            value[objIndex][`currency`] = req.body[`currency`];
                            value[objIndex][`currency_name`] =
                              req.body[`currency_name`];
                            value[objIndex][`currency_symbol`] =
                              req.body[`currency_symbol`];
                            value[objIndex][`name`] = req.body[`name`];
                            break;

                          default:
                            value[objIndex] = result;
                            break;
                        }
                        await multiMap.clear(`all${modelName}`);
                        await multiMap.put(`all${modelName}`, value);
                      }
                    }
                    res.status(200).json({
                      success: true,
                      totalAgentLength: 0,
                      data: result,
                    });
                    await hz.shutdown();
                  }
                }
              });
            });
            break;
        }
      } catch (err) {
        if (!hzErrorConnection) {
          await hz.shutdown();
        }

        if (req.files.length > 0) {
          const { newFilesRecord } = req.body;
          if (req.body.isVercel) {
            awsDelete(req, res, next, newFilesRecord, (status, error) => {
              if (status) {
                res.status(403).json({
                  success: false,
                  Error: error.toString(),
                });
              } else {
                res.status(500).json({ success: false, Error: err.toString() });
              }
            });
          } else {
            fsDelete(req, res, next, newFilesRecord, (status, error) => {
              if (status) {
                res.status(403).json({
                  success: false,
                  Error: error.toString(),
                });
              } else {
                res.status(500).json({ success: false, Error: err.toString() });
              }
            });
          }
        } else {
          res.status(500).json({ success: false, Error: err.toString() });
        }
      }
    }
  }
);

export default apiRoute;
export const config = {
  api: {
    bodyParser: false,
  },
};
