import fs from 'fs';
import aws from 'aws-sdk';
import { createNewUser } from './users';
const path = require('path');
const fse = require('fs-extra');
import { v4 as uuidv4 } from 'uuid';

aws.config.update({
  region: process.env.S3_AWS_REGION,
  accessKeyId: process.env.S3_AWS_ACCESS_KEY,
  secretAccessKey: process.env.S3_AWS_SECRET,
});
const s3Bucket = process.env.S3_AWS_BUCKET;
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
      res.status(403).json({
        success: false,
        Error: error,
        ErrorCode: error?.code,
      });
    }
  });
};

export const deleteSingleFile = async (profileImageKey) => {
  fs.unlink(profileImageKey, (error) => {
    if (error) console.log(error);
  });
};

export const uploadSingleFile = async (userData, images, res) => {
  const profileImageFolder = `${process.cwd()}/public/profileImage`;
  const uniqueName = uuidv4();
  const url = process.env.NEXT_PUBLIC_ADMIN_URL;
  const fileExtention = path.extname(images.fileName);
  const imageKey = `${profileImageFolder}/${uniqueName}${fileExtention}`;
  const imageUrl = `${url}/profileImage/${uniqueName}${fileExtention}`;
  // check if profileImage directory exists
  if (!fs.existsSync(profileImageFolder)) {
    fs.mkdirSync(profileImageFolder);
  }
  //Move file from /tmp to profileImage
  fse
    .move(images.path, imageKey)
    .then(async () => {
      userData.profileImage = imageUrl;
      userData.profileImageKey = imageKey;
      await createNewUser(userData, res, undefined);
    })
    .catch((err) => {
      console.log(err);
      return res.status(401).json({ success: false, Error: err });
    });
};
