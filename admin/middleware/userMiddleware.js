import { findAgentById, findUserById, findHotelById } from '../helpers/auth';
import {
  fsDeleteSingle,
  fsDeleteMulti,
  fsEditMulti,
  awsCreateMulti,
  awsDeleteObjectsFolder,
  awsEditMulti,
} from '../helpers/aws';
import fs from 'fs';

export const editMiddleware = async (req, res, next) => {
  const isVercel = process.env.NEXT_PUBLIC_SERVERLESS == 'true' ? true : false;
  const { modelName } = req.body;
  try {
    switch (modelName) {
      case 'Users':
        const oldUserData = await findUserById(req.body._id);
        if (req.files.length == 0) {
          //No files or image update, check if already has file delete it
          if (
            oldUserData.profileImageKey == '' ||
            oldUserData.profileImageKey == req.body.profileImageKey
          ) {
            next();
          } else {
            if (oldUserData.isVercel) {
              await awsDeleteObjectsFolder(
                res,
                next,
                oldUserData.profileImageKey
              );
              next();
            } else {
              await fsDeleteSingle(res, next, oldUserData.profileImageKey);
              next();
            }
          }
        } else {
          if (oldUserData.profileImageKey == '') {
            // User not have any save image and uploade new image
            if (isVercel) {
              //Upload file to s3 and update body
              await awsCreateMulti(req, res, next);
            } else {
              //Move file to folder and update body
              await fsEditMulti(req, res, next);
            }
          } else {
            // User has old image saved first delete that and then upload new image
            if (oldUserData.isVercel) {
              req.body.isVercel = isVercel;
              if (isVercel) {
                await awsEditMulti(req, res, next);
              } else {
                await fsEditMulti(req, res, next);
              }
            } else {
              fsDeleteSingle(res, next, oldUserData.profileImageKey);
              await fsEditMulti(req, res, next);
            }
          }
        }
        break;
      case 'Agencies':
        const oldAgencyData = await findAgentById(req.body._id);
        if (req.files.length == 0) {
          //No files or image update, check if already has file delete it
          if (
            oldAgencyData.logoImageKey == '' ||
            oldAgencyData.logoImageKey == req.body.logoImageKey
          ) {
            next();
          } else {
            if (oldAgencyData.isVercel) {
              await awsDeleteObjectsFolder(
                res,
                next,
                oldAgencyData.logoImageKey
              );
              next();
            } else {
              await fsDeleteSingle(res, next, oldAgencyData.logoImageKey);
              next();
            }
          }
        } else {
          if (oldAgencyData.logoImageKey == '') {
            // User not have any save image and uploade new image
            if (isVercel) {
              //Upload file to s3 and update body
              await awsCreateMulti(req, res, next);
            } else {
              //Move file to folder and update body
              await fsEditMulti(req, res, next);
            }
          } else {
            // User has old image saved first delete that and then upload new image
            if (oldAgencyData.isVercel) {
              req.body.isVercel = isVercel;
              if (isVercel) {
                await awsEditMulti(req, res, next);
              } else {
                await fsEditMulti(req, res, next);
              }
            } else {
              // fsDeleteSingle(res, next, oldAgencyData.logoImageKey);
              await fsEditMulti(req, res, next);
            }
          }
        }
        break;
      case 'Hotels':
        const oldHotelData = await findHotelById(req.body._id);
        req.body.deletedImage = JSON.parse(req?.body?.deletedImage);
        switch (true) {
          case req.body.deletedImage.length == 0 && req.files.length == 0:
            delete req.body.deletedImage;
            next();
            break;
          case req.files.length !== 0:
            if (req.body.deletedImage.length !== 0) {
              console.log(`fileDeleted inside file upload`);
              if (oldHotelData.isVercel) {
                //Todo
                await awsDeleteObjectsFolder(res, next, req.body.deletedImage);
                next();
              } else {
                for (const filepath of req.body.deletedImage) {
                  fs.unlink(filepath, function (error) {
                    console.log(filepath);
                    if (error) {
                      console.log(error);
                      res.status(403).json({
                        success: false,
                        Error: error.toString(),
                        ErrorCode: error?.code,
                      });
                    }
                  });
                }
              }
            }
            console.log(`files Uploaded: `);
            if (isVercel) {
              //Todo
              //Upload file to s3 and update body
              await awsCreateMulti(req, res, next);
              delete req.body.deletedImage;
              next();
            } else {
              //Move file to folder and update body
              // req.body.imageKey = JSON.parse(req?.body?.imageKey);
              await fsEditMulti(req, res, next);
            }
            break;
          case req.body.deletedImage.length !== 0:
            if (oldHotelData.isVercel) {
              //Todo
              await awsDeleteObjectsFolder(res, next, req.body.deletedImage);
              delete req.body.deletedImage;
              next();
            } else {
              console.log('onlydelete');
              await fsDeleteMulti(res, next, req.body.deletedImage);
              next();
            }

            break;
        }

        // next();
        // res.status(500).json({ success: false, Error: 'error.toString()' });
        break;
    }

    // res.status(500).json({ success: false, Error: 'error.toString()' });
  } catch (error) {
    res.status(500).json({ success: false, Error: error.toString() });
  }
};
