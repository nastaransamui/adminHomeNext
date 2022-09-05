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
        const { hzErrorConnection, hz } = await hazelCast();
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
                        const { hzErrorConnection, hz } = await hazelCast();
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
                    const { hzErrorConnection, hz } = await hazelCast();
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
              // update role for user
              // if (req.body.role_id[0] !== oldUser.role_id[0]?.toString()) {
              //   await Roles.updateOne(
              //     { _id: { $in: oldUser?.role_id } },
              //     { $pull: { users_id: _id } },
              //     { multi: true }
              //   );
              //   await Roles.updateOne(
              //     { _id: { $in: req.body.role_id } },
              //     { $push: { users_id: _id } },
              //     { multi: true }
              //   );
              // }

              // // update agentcy delete
              // if (oldUser.agents_id.length !== req.body.agents_id.length) {
              //   let agentsDeleteIds = oldUser.agents_id.filter(
              //     (x) => !req.body.agents_id.includes(x.toString())
              //   );
              //   await Agencies.updateMany(
              //     { _id: { $in: agentsDeleteIds } },
              //     { $set: { accountManager_id: [], accountManager: '' } },
              //     { multi: true }
              //   );
              // }

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
                        const { hzErrorConnection, hz } = await hazelCast();
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
                    const { hzErrorConnection, hz } = await hazelCast();
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
                        const { hzErrorConnection, hz } = await hazelCast();
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
                    const { hzErrorConnection, hz } = await hazelCast();
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
                        res.status(500).json({
                          success: false,
                          Error: 'update hz countries',
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
                        const { hzErrorConnection, hz } = await hazelCast();
                        if (hzErrorConnection) {
                          res.status(200).json({
                            success: true,
                            totalValuesLength: 0,
                            data: result,
                          });
                        } else {
                          // use Catch system with Hz
                          //Todo update
                          // const multiMap = await hz.getMultiMap('Countries');
                          // const multiMapP = await hz.getMultiMap('Provinces');
                          // await multiMap.destroy();
                          // await multiMapP.destroy();
                          // await multiMap.put(`allProvinces`, valuesList);
                          // res.status(200).json({
                          //   success: true,
                          //   totalValuesLength: valuesList.length,
                          //   data: result,
                          // });
                          res.status(500).json({
                            success: false,
                            Error: 'update hz agency',
                          });
                          await hz.shutdown();
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
                        const { hzErrorConnection, hz } = await hazelCast();
                        if (hzErrorConnection) {
                          res.status(200).json({
                            success: true,
                            totalValuesLength: 0,
                            data: result,
                          });
                        } else {
                          res.status(500).json({
                            success: false,
                            Error: 'update hz cities',
                          });
                          // const multiMap = await hz.getMultiMap('Countries');
                          // const multiMapP = await hz.getMultiMap('Provinces');
                          // const multiMapC = await hz.getMultiMap('Cities');
                          // await multiMap.destroy();
                          // await multiMapP.destroy();
                          // await multiMapC.destroy();
                          // await multiMap.put(`allCities`, valuesList);
                          // res.status(200).json({
                          //   success: true,
                          //   totalValuesLength:0,
                          //   data: result,
                          // });
                          // await hz.shutdown();
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
                  const { hzErrorConnection, hz } = await hazelCast();
                  if (hzErrorConnection) {
                    res.status(200).json({
                      success: true,
                      totalValuesLength: 0,
                      data: result,
                    });
                  } else {
                    // use Catch system with Hz
                    res.status(500).json({
                      success: false,
                      Error: 'update hz default',
                    });
                    // const multiMap = await hz.getMultiMap('Currencies');
                    // await multiMap.destroy();
                    // await multiMap.put(`allCurrencies`, valuesList);
                    // await hz.shutdown();
                    // res.status(200).json({
                    //   success: true,
                    //   totalValuesLength: 0,
                    //   data: result,
                    // });
                  }
                }
              });
            });
            break;
        }
      } catch (err) {
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
