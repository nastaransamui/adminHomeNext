const nextConnect = require('next-connect');

import dbConnect from '../../../helpers/dbConnect';
import verifyToken from '../../../helpers/verifyToken';
import hazelCast from '../../../helpers/hazelCast';
import mongoose from 'mongoose';
import Agencies from '../../../models/Agencies';
import Countries from '../../../models/Countries';
import Currencies from '../../../models/Currencies';
import Features from '../../../models/Features';
import Photos from '../../../models/Photos';
import Roles from '../../../models/Roles';
import Users from '../../../models/Users';
import Videos from '../../../models/Videos';
import {
  userInvolvedError,
  deleteObjectsId,
  roleInvolvedError,
} from '../../../helpers/objectsIds';
import { awsDelete, fsDelete } from '../../../helpers/fileSystem';

const apiRoute = nextConnect({
  onNoMatch(req, res) {
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
      const { modelName, _id } = req.body;
      var collection = mongoose.model(modelName);
      // push keys of delte files to this array
      var deleteKeysArr = [];
      const { hzErrorConnection, hz } = await hazelCast();
      switch (modelName) {
        case 'Users':
          collection.findById(_id, async (err, user) => {
            if (err) {
              res.status(403).json({ success: false, Error: err.toString() });
            } else {
              const { Error, success } = userInvolvedError(user);
              if (!success) {
                res.status(403).json({ success: false, Error: Error });
              } else {
                deleteObjectsId(req, res, next, user, async (status, error) => {
                  if (status) {
                    res.status(403).json({
                      success: false,
                      Error: error.toString(),
                    });
                    return;
                  } else {
                    if (user.profileImageKey !== '') {
                      if (user.isVercel) {
                        deleteKeysArr.push(user.profileImageKey);
                        awsDelete(
                          req,
                          res,
                          next,
                          deleteKeysArr,
                          async (status, error) => {
                            if (status) {
                              res.status(403).json({
                                success: false,
                                Error: error.toString(),
                              });
                              return;
                            } else {
                              await user.remove();
                              if (!hzErrorConnection) {
                                res.status(500).json({
                                  success: false,
                                  Error: 'update hz on delete user',
                                });
                              }
                              res.status(200).json({
                                success: true,
                                totalValuesLength: 0,
                              });
                            }
                          }
                        );
                      } else {
                        fsDelete(
                          req,
                          res,
                          next,
                          [user.profileImageKey],
                          async (status, error) => {
                            if (status) {
                              res.status(403).json({
                                success: false,
                                Error: error.toString(),
                              });
                              return;
                            } else {
                              await user.remove();
                              if (!hzErrorConnection) {
                                res.status(500).json({
                                  success: false,
                                  Error: 'update hz on delete user',
                                });
                              }
                              res.status(200).json({
                                success: true,
                                totalValuesLength: 0,
                              });
                            }
                          }
                        );
                      }
                    } else {
                      await user.remove();
                      if (!hzErrorConnection) {
                        res.status(500).json({
                          success: false,
                          Error: 'update hz on delete agent',
                        });
                      }
                      res.status(200).json({
                        success: true,
                        totalValuesLength: 0,
                      });
                    }
                  }
                });
              }
            }
          });
          break;

        case 'Roles':
          collection.findById(_id, async (err, role) => {
            if (err) {
              res.status(403).json({ success: false, Error: err.toString() });
            } else {
              const { Error, success } = roleInvolvedError(role);
              if (!success) {
                res.status(403).json({ success: false, Error: Error });
              } else {
                await role.remove();
                if (!hzErrorConnection) {
                  res
                    .status(500)
                    .json({ success: false, Error: 'Role HZ update delete' });
                }
                res.status(200).json({
                  success: true,
                  totalValuesLength: 0,
                });
              }
            }
          });
          break;
        case 'Agencies':
          collection.findById(_id, async (err, agent) => {
            if (err) {
              res.status(403).json({ success: false, Error: err.toString() });
            } else {
              deleteObjectsId(req, res, next, agent, async (status, error) => {
                if (status) {
                  res.status(403).json({
                    success: false,
                    Error: error.toString(),
                  });
                  return;
                } else {
                  if (agent.logoImageKey !== '') {
                    if (agent.isVercel) {
                      deleteKeysArr.push(agent.logoImageKey);
                      awsDelete(
                        req,
                        res,
                        next,
                        deleteKeysArr,
                        async (status, error) => {
                          if (status) {
                            res.status(403).json({
                              success: false,
                              Error: error.toString(),
                            });
                            return;
                          } else {
                            await agent.remove();
                            if (!hzErrorConnection) {
                              res.status(500).json({
                                success: false,
                                Error: 'update hz on delete agent',
                              });
                            }
                            res.status(200).json({
                              success: true,
                              totalValuesLength: 0,
                            });
                          }
                        }
                      );
                    } else {
                      fsDelete(
                        req,
                        res,
                        next,
                        [agent.logoImageKey],
                        async (status, error) => {
                          if (status) {
                            res.status(403).json({
                              success: false,
                              Error: error.toString(),
                            });
                            return;
                          } else {
                            await agent.remove();
                            if (!hzErrorConnection) {
                              res.status(500).json({
                                success: false,
                                Error: 'update hz on delete agent',
                              });
                            }
                            res.status(200).json({
                              success: true,
                              totalValuesLength: 0,
                            });
                          }
                        }
                      );
                    }
                  } else {
                    await agent.remove();
                    if (!hzErrorConnection) {
                      res.status(500).json({
                        success: false,
                        Error: 'update hz on delete agent',
                      });
                    }
                    res.status(200).json({
                      success: true,
                      totalValuesLength: 0,
                    });
                  }
                }
              });
            }
          });
          break;

        case 'Hotels':
          collection.findById(_id, async (err, hotel) => {
            if (err) {
              res.status(403).json({ success: false, Error: err.toString() });
            } else {
              deleteObjectsId(req, res, next, hotel, async (status, error) => {
                if (status) {
                  res.status(403).json({
                    success: false,
                    Error: error.toString(),
                  });
                  return;
                } else {
                  if (hotel.imageKey.length > 0) {
                    if (hotel.isVercel) {
                      awsDelete(
                        req,
                        res,
                        next,
                        hotel.imageKey,
                        async (status, error) => {
                          if (status) {
                            res.status(403).json({
                              success: false,
                              Error: error.toString(),
                            });
                            return;
                          } else {
                            await hotel.remove();
                            if (!hzErrorConnection) {
                              res.status(500).json({
                                success: false,
                                Error: 'update hz on delete hotel',
                              });
                            }
                            res.status(200).json({
                              success: true,
                              totalValuesLength: 0,
                            });
                          }
                        }
                      );
                    } else {
                      fsDelete(
                        req,
                        res,
                        next,
                        hotel.imageKey,
                        async (status, error) => {
                          if (status) {
                            res.status(403).json({
                              success: false,
                              Error: error.toString(),
                            });
                            return;
                          } else {
                            await hotel.remove();
                            if (!hzErrorConnection) {
                              res.status(500).json({
                                success: false,
                                Error: 'update hz on delete hotel',
                              });
                            }
                            res.status(200).json({
                              success: true,
                              totalValuesLength: 0,
                            });
                          }
                        }
                      );
                    }
                  } else {
                    await hotel.remove();
                    if (!hzErrorConnection) {
                      res.status(500).json({
                        success: false,
                        Error: 'update hz on delete hotel',
                      });
                    }
                    res.status(200).json({
                      success: true,
                      totalValuesLength: 0,
                    });
                  }
                }
              });
            }
          });
          break;
        default:
          collection.findById(_id, async (err, docs) => {
            if (err) {
              res.status(403).json({ success: false, Error: err.toString() });
            } else {
              var deleteFilesArr = [];
              Object.entries(docs._doc).forEach((doc) => {
                if (doc[0].endsWith('Key') && doc[1] !== '') {
                  deleteFilesArr.push(doc[1]);
                }
              });
              if (deleteFilesArr.length > 0) {
                if (docs.isVercel) {
                  awsDelete(
                    req,
                    res,
                    next,
                    deleteFilesArr,
                    async (status, error) => {
                      if (status) {
                        res.status(403).json({
                          success: false,
                          Error: error.toString(),
                        });
                        return;
                      } else {
                        await docs.remove();
                        if (!hzErrorConnection) {
                          res.status(500).json({
                            success: false,
                            Error: 'update hz on delete user',
                          });
                        }
                        res.status(200).json({
                          success: true,
                          totalValuesLength: 0,
                        });
                      }
                    }
                  );
                } else {
                  fsDelete(
                    req,
                    res,
                    next,
                    deleteFilesArr,
                    async (status, error) => {
                      if (status) {
                        res.status(403).json({
                          success: false,
                          Error: error.toString(),
                        });
                        return;
                      } else {
                        await docs.remove();
                        if (!hzErrorConnection) {
                          res.status(500).json({
                            success: false,
                            Error: 'update hz on delete default',
                          });
                        }
                        res.status(200).json({
                          success: true,
                          totalValuesLength: 0,
                        });
                      }
                    }
                  );
                }
              } else {
                await docs.remove();
                if (!hzErrorConnection) {
                  res.status(500).json({
                    success: false,
                    Error: 'update hz on delete agent',
                  });
                }
                res.status(200).json({
                  success: true,
                  totalValuesLength: 0,
                });
              }
            }
          });
          break;
      }
    } catch (error) {
      res.status(500).json({ success: false, Error: error.toString() });
    }
  }
});

export default apiRoute;
