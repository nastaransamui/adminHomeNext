import Users from '../models/Users';
import { awsUploadSingleFile, awsDeleteSingleFile } from './aws';

const isVercel = process.env.NEXT_PUBLIC_SERVER_TYPE == 'vercel';

export const createNewUserWithImage = async (userData, images, res) => {
  if (isVercel) {
    await awsUploadSingleFile(userData, images, res);
  } else {
    //Todo save user image in path if server is not Vercel
  }
};

export const createNewUser = async (userData, res, imageData) => {
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
          //Todo delete from path if error
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
};
