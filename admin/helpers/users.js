import Users from '../models/Users';
import {
  awsUploadSingleFile,
  awsDeleteSingleFile,
  uploadSingleFile,
  deleteSingleFile,
} from './aws';
import dbConnect from './dbConnect';

const isVercel = process.env.NEXT_PUBLIC_SERVER_TYPE == 'vercel';

export const createNewUserWithImage = async (userData, images, res) => {
  if (isVercel) {
    await awsUploadSingleFile(userData, images, res);
  } else {
    uploadSingleFile(userData, images, res);
  }
};

export const createNewUser = async (userData, res, imageData) => {
  const dbConnected = await dbConnect();
  const { success } = dbConnected;
  if (!success) {
    res.status(500).json({ success: false, Error: dbConnected.error });
  } else {
    const newUser = await new Users({ ...userData });
    return await newUser.save(async (err, result) => {
      if (err) {
        //If image provided, and error accure delete from S3 or from path
        if (userData.profileImage !== undefined) {
          if (isVercel) {
            //Delete image from s3 if error
            await awsDeleteSingleFile(imageData, res);
            res.status(403).json({
              success: false,
              Error: err.toString(),
              ErrorCode: err?.code,
            });
          } else {
            await deleteSingleFile(userData.profileImageKey);
            res.status(403).json({
              success: false,
              Error: err.toString(),
              ErrorCode: err?.code,
            });
          }
        } else {
          res.status(403).json({
            success: false,
            Error: err.toString(),
            ErrorCode: err?.code,
          });
        }
      } else {
        const totalUser = await Users.find();
        res.status(200).json({
          success: true,
          totalUsersLength: totalUser.length,
          data: result,
        });
      }
    });
  }
};
