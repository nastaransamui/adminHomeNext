/**
 * After update body on userFieldsUpdate with serverles or server
 * upload or delete files from s3 or from file system
 */

import fs from 'fs';
import aws from 'aws-sdk';

const path = require('path');
const fse = require('fs-extra');
import { v4 as uuidv4 } from 'uuid';
const { NEXT_PBULIC_FOLDER_PUBLIC_UAT, NEXT_PBULIC_FOLDER_PUBLIC_LIVE } =
  process.env;
//Public Folder update
const publicUrl =
  process.env.NODE_ENV == 'development'
    ? NEXT_PBULIC_FOLDER_PUBLIC_UAT
    : NEXT_PBULIC_FOLDER_PUBLIC_LIVE;

aws.config.update({
  region: process.env.S3_AWS_REGION,
  accessKeyId: process.env.S3_AWS_ACCESS_KEY,
  secretAccessKey: process.env.S3_AWS_SECRET,
});
const s3Bucket = process.env.S3_AWS_BUCKET;
const s3 = new aws.S3(); // Create a new instance of S3

//function for save in S3
export const awsSingleFile = async (req, res, next, key) => {
  const { fileName, fileType, path } = req.files;

  const s3Params = {
    Bucket: s3Bucket,
    ContentType: fileType,
    Body: fs.createReadStream(path),
    ACL: 'public-read',
    Key: `${key}/${fileName}`,
  };

  try {
    s3.upload(s3Params, async (err, data) => {
      if (err) {
        deleteSingleFile(res, next, req.files.path);
        res.status(401).json({ success: false, Error: err });
      } else {
        req.body[key] = data.Location;
        req.body[`${key}Key`] = data.Key;
        next();
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, Error: error.toString() });
  }
};

//function for move file inside server(isVercel = flase)
export const singleFileMove = async (req, res, next, key) => {
  try {
    const { fileName, fileType, path: filePath } = req.files;
    const publicFolder = `${process.cwd()}/public/${key}`;
    const uniqueName = uuidv4();
    const url = publicUrl;
    const fileExtention = path.extname(fileName);
    const location = `${url}/${key}/${uniqueName}${fileExtention}`;
    const Key = `${publicFolder}/${uniqueName}${fileExtention}`;
    // check if profileImage directory exists
    if (!fs.existsSync(publicFolder)) {
      fs.mkdirSync(publicFolder);
    }
    //Move file from /tmp to profileImage
    fse
      .move(filePath, Key)
      .then(async () => {
        req.body[key] = location;
        req.body[`${key}Key`] = Key;
        next();
      })
      .catch((err) => {
        console.log(err);
        deleteSingleFile(res, next, filePath);
        res.status(401).json({ success: false, Error: err });
      });
  } catch (error) {
    res.status(500).json({ success: false, Error: error.toString() });
  }
};

//Delete file if error
export const deleteOnError = async (req, res, next) => {
  //Check that form has some files to
  if (Object.keys(req.files).length !== 0) {
    // create Key for delete file from S3 or filesystem
    const key = req.body[`${req.files.finalFolder}Key`];
    if (req.body.isVercel) {
      s3.deleteObject({ Bucket: s3Bucket, Key: key }, (error) => {
        if (error) {
          console.log(error);
          res.status(403).json({
            success: false,
            Error: error.toString(),
            ErrorCode: error?.code,
          });
        }
      });
    } else {
      fs.unlink(key, (error) => {
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
  next();
};

export const deleteSingleS3 = async (res, next, fileKey) => {
  s3.deleteObject({ Bucket: s3Bucket, Key: fileKey }, (error) => {
    if (error) {
      console.log(error);
      res.status(403).json({
        success: false,
        Error: error.toString(),
        ErrorCode: error?.code,
      });
    }
    // next();
  });
};

export const deleteSingleFile = async (res, next, fileKey) => {
  fs.unlink(fileKey, (error) => {
    if (error) {
      console.log(error);
      res.status(403).json({
        success: false,
        Error: error.toString(),
        ErrorCode: error?.code,
      });
    }
  });
};
