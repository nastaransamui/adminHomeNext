import fs from 'fs';
import aws from 'aws-sdk';
import { createNewUser } from './users';

aws.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET,
});
const s3Bucket = process.env.AWS_BUCKET;
const s3 = new aws.S3(); // Create a new instance of S3

export const awsUploadSingleFile = async (userData, images, res) => {
  const { fileName, fileType, path } = images;
  const s3Params = {
    Bucket: s3Bucket,
    ContentType: fileType,
    Body: fs.createReadStream(path),
    ACL: 'public-read',
    Key: `profileImage/${fileName}`,
  };
  try {
    s3.upload(s3Params, async (err, data) => {
      if (err) {
        return res.status(401).json({ success: false, Error: err });
      }
      //delete the temp file
      fs.unlink(path, (error) => {
        if (error) console.log(error);
        else {
          console.log(`\nDeleted file: ${path}`);
        }
      });
      userData.profileImage = data.Location;
      userData.profileImageKey = data.Key;
      await createNewUser(userData, res, data);
    });
  } catch (error) {
    res.status(500).json({ success: false, Error: error.toString() });
  }
};

export const awsDeleteSingleFile = async (imageData, res) => {
  s3.deleteObject({ Bucket: s3Bucket, Key: imageData.Key }, (error) => {
    if (error) {
      console.log('s3 Delete image error');
      res.status(403).json({
        success: false,
        Error: error,
        ErrorCode: error?.code,
      });
    }
  });
};
