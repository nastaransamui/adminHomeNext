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
import { createObjectsId, isJsonParsable } from '../../../helpers/objectsIds';
import verifySingleActive from '../../../helpers/verifySingleActive';
import { hashPassword } from '../../../helpers/auth';

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
        const { modelName, newFilesRecord } = req.body;
        var collection = mongoose.model(modelName);
        delete req.body._id;
        // loop throgh body and parse if it's array
        Object.entries(req.body).forEach((key) => {
          if (isJsonParsable(key[1])) {
            req.body[key[0]] = JSON.parse(key[1]);
          }
        });
        const newValue = await new collection(req.body);
        const { hzErrorConnection, hz } = await hazelCast();

        switch (modelName) {
          case 'Hotels':
            await newValue.save(async (err, result) => {
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
                //Update other collection objecs ID
                await createObjectsId(
                  req,
                  res,
                  next,
                  result,
                  async (status, error) => {
                    if (status) {
                      res.status(403).json({
                        success: false,
                        Error: error.toString(),
                      });
                    } else {
                      if (!hzErrorConnection) {
                        const multiMap = await hz.getMultiMap(modelName);
                        const dataIsExist = await multiMap.containsKey(
                          `all${modelName}`
                        );
                        if (dataIsExist) {
                          const values = await multiMap.get(`all${modelName}`);
                          for (const value of values) {
                            value.push(result);
                            await multiMap.clear(`all${modelName}`);
                            await multiMap.put(`all${modelName}`, value);
                          }
                        }
                        await hz.shutdown();
                      }
                      res.status(200).json({
                        success: true,
                        totalValuesLength: 0,
                        data: result,
                      });
                    }
                  }
                );
              }
            });
            break;

          default:
            await newValue.save(async (err, result) => {
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
                //Update other collection objecs ID
                await createObjectsId(
                  req,
                  res,
                  next,
                  result,
                  async (status, error) => {
                    if (status) {
                      res.status(403).json({
                        success: false,
                        Error: error.toString(),
                      });
                    } else {
                      if (!hzErrorConnection) {
                        const multiMap = await hz.getMultiMap(modelName);
                        const dataIsExist = await multiMap.containsKey(
                          `all${modelName}`
                        );
                        if (dataIsExist) {
                          const values = await multiMap.get(`all${modelName}`);
                          for (const value of values) {
                            value.push(result);
                            await multiMap.clear(`all${modelName}`);
                            await multiMap.put(`all${modelName}`, value);
                          }
                        }
                        await hz.shutdown();
                      }
                      res.status(200).json({
                        success: true,
                        totalValuesLength: 0,
                        data: result,
                      });
                    }
                  }
                );
              }
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
