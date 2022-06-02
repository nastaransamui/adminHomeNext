import { findAgentById, findUserById } from '../helpers/auth';
import {
  fsDeleteSingle,
  fsEditMulti,
  awsCreateMulti,
  awsDeleteObjectsFolder,
  awsEditMulti,
} from '../helpers/aws';

export const editMiddleware = async (req, res, next) => {
  const isVercel = process.env.NEXT_PUBLIC_SERVERLESS == 'true' ? true : false;
  const { modelName } = req.body;

  const oldUserData =
    modelName == 'Users'
      ? await findUserById(req.body._id)
      : await findAgentById(req.body._id);
  try {
    if (req.files.length == 0) {
      //No files or image update, check if already has file delete it
      if (modelName == 'Users') {
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
        if (
          oldUserData.logoImageKey == '' ||
          oldUserData.logoImageKey == req.body.logoImageKey
        ) {
          next();
        } else {
          if (oldUserData.isVercel) {
            await awsDeleteObjectsFolder(res, next, oldUserData.logoImageKey);
            next();
          } else {
            await fsDeleteSingle(res, next, oldUserData.logoImageKey);
            next();
          }
        }
      }
    } else {
      if (modelName == 'Users') {
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
            await fsEditMulti(req, res, next);
          }
        }
      } else {
        if (oldUserData.logoImageKey == '') {
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
            await fsEditMulti(req, res, next);
          }
        }
      }
    }
  } catch (error) {
    res.status(500).json({ success: false, Error: error.toString() });
  }
};
