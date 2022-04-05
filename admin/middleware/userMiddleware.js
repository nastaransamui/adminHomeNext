import { findUserById } from '../helpers/auth';
import { awsSingleFile, singleFileMove } from '../helpers/aws';
import { deleteSingleFile, deleteSingleS3 } from '../helpers/aws';

// Upload files base on name of field in multiparty middleware and update body for save in DB
export const createMiddleware = async (req, res, next) => {
  const isVercel = process.env.NEXT_PUBLIC_SERVERLESS == 'true' ? true : false;
  req.body.isVercel = isVercel;

  if (Object.keys(req.files).length == 0) {
    //No files or image update "isVercel" and return;
    req.body[req.files.finalFolder] = '';
    req.body[`${req.files.finalFolder}Key`] = '';
    next();
  } else {
    if (isVercel) {
      //Upload file to s3 and update body
      await awsSingleFile(req, res, next, req.files.finalFolder);
    } else {
      //Move file to folder and update body
      await singleFileMove(req, res, next, req.files.finalFolder);
    }
  }
};

export const editMiddleware = async (req, res, next) => {
  const isVercel = process.env.NEXT_PUBLIC_SERVERLESS == 'true' ? true : false;
  try {
    if (Object.keys(req.files).length == 0) {
      //No files or image update, pass to save the data
      next();
    } else {
      const oldUserData = await findUserById(req.body._id);
      if (oldUserData.profileImageKey == '') {
        // User not have any save image and uploade new image
        if (isVercel) {
          //Upload file to s3 and update body
          await awsSingleFile(req, res, next, req.files.finalFolder);
        } else {
          //Move file to folder and update body
          await singleFileMove(req, res, next, req.files.finalFolder);
        }
      } else {
        // User has old image saved first delete that and then upload new image
        if (oldUserData.isVercel) {
          // Delete image from s3
          await deleteSingleS3(res, next, oldUserData.profileImageKey);
          //if currently isVercel upload to s3 otherwise upload to file
          if (isVercel) {
            await awsSingleFile(req, res, next, req.files.finalFolder);
          } else {
            await singleFileMove(req, res, next, req.files.finalFolder);
          }
        } else {
          // Delete image from file system
          await deleteSingleFile(res, next, oldUserData.profileImageKey);
          //Move file to folder and update body
          await singleFileMove(req, res, next, req.files.finalFolder);
        }
      }
    }
  } catch (error) {
    res.status(500).json({ success: false, Error: error.toString() });
  }
};
