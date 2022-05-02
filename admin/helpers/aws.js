/**
 * All s3 and fs move and delete files and folders
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

export const awsCreateSingle = async (req, res, next) => {
  const { fileName, fileType, path } = req.files[0];
  const key = req.body.finalFolder;
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
        fsDeleteSingle(res, next, req.files.path);
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

export const awsCreateMulti = async (req, res, next) => {
  const { finalFolder, folderId } = req.body;
  // Array to wait till all datas come
  var ResponseData = [];
  req.files.map((file) => {
    var s3Params = {
      Bucket: s3Bucket,
      ContentType: file.fileType,
      Body: fs.createReadStream(file.path),
      ACL: 'public-read',
      Key: `${finalFolder}/${folderId}/${file.fileName}`,
    };
    try {
      s3.upload(s3Params, async (err, data) => {
        if (err) {
          console.log(err);
          res.status(401).json({ success: false, Error: err });
        } else {
          req.body[file.finalFolder] = data.Location;
          req.body[`${file.finalFolder}Key`] = data.Key;
          ResponseData.push(data);
          if (ResponseData.length == req.files.length) next();
        }
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, Error: error.toString() });
    }
  });
};

export const awsEditMulti = async (req, res, next) => {
  var s3Params = {
    Bucket: s3Bucket,
    Delete: {
      Objects: req.files.map((file) => {
        return { Key: req.body[`${file.finalFolder}Key`] };
      }),
    },
  };
  try {
    s3.deleteObjects(s3Params, async (err, data) => {
      if (err) {
        res.status(403).json({
          success: false,
          Error: err.toString(),
          ErrorCode: err?.code,
        });
      } else {
        awsCreateMulti(req, res, next);
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, Error: error.toString() });
  }
};

export const awsDeleteSingle = async (res, next, fileKey) => {
  s3.deleteObject({ Bucket: s3Bucket, Key: fileKey }, (error) => {
    if (error) {
      res.status(403).json({
        success: false,
        Error: error.toString(),
        ErrorCode: error?.code,
      });
    }
    // next();
  });
};

export const awsDeleteObjectsFolder = async (res, next, newFolder) => {
  const listParams = {
    Bucket: s3Bucket,
    Prefix: newFolder,
  };

  const listedObjects = await s3.listObjectsV2(listParams).promise();
  // console.log(listedObjects);
  if (listedObjects.Contents.length === 0) next();
  const deleteParams = {
    Bucket: s3Bucket,
    Delete: { Objects: [] },
  };

  listedObjects.Contents.forEach(({ Key }) => {
    deleteParams.Delete.Objects.push({ Key });
  });
  s3.deleteObjects(deleteParams, (error, data) => {
    if (error) {
      res.status(403).json({
        success: false,
        Error: error.toString(),
        ErrorCode: error?.code,
      });
    } else {
      next();
    }
  });
};

export const fsCreateSingle = async (req, res, next) => {
  try {
    const key = req.body.finalFolder;
    const { fileName, fileType, path: filePath } = req.files[0];
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
        fsDeleteSingle(res, next, filePath);
        res.status(401).json({ success: false, Error: err });
      });
  } catch (error) {
    res.status(500).json({ success: false, Error: error.toString() });
  }
};

export const fsCreateMulti = async (req, res, next) => {
  try {
    const { finalFolder, folderId } = req.body;
    const publicFolder = `${process.cwd()}/public`;
    const newFolder = `${publicFolder}/${finalFolder}/${folderId}`;
    const url = publicUrl;

    // check if profileImage directory exists
    if (!fs.existsSync(newFolder)) {
      fs.mkdirSync(newFolder, { recursive: true });
    }
    try {
      for (const element of req.files) {
        const fileExtention = path.extname(element.fileName);
        const uniqueName = uuidv4();
        const location = `${url}/${finalFolder}/${folderId}/${uniqueName}${fileExtention}`;
        const Key = `${newFolder}/${uniqueName}${fileExtention}`;
        await fse
          .move(element.path, Key)
          .then(async () => {
            req.body[element.finalFolder] = location;
            req.body[`${element.finalFolder}Key`] = Key;
          })
          .catch((err) => {
            fsDeleteObjectsFolder(res, next, newFolder);
            res.status(401).json({ success: false, Error: err.toString() });
          });
      }
      next();
    } catch (error) {
      fsDeleteObjectsFolder(res, next, newFolder);
      res.status(500).json({ success: false, Error: error.toString() });
    }
  } catch (error) {
    fsDeleteObjectsFolder(res, next, newFolder);
    res.status(500).json({ success: false, Error: error.toString() });
  }
};

export const fsEditMulti = async (req, res, next) => {
  try {
    const { finalFolder, folderId } = req.body;
    const publicFolder = `${process.cwd()}/public`;
    const newFolder = `${publicFolder}/${finalFolder}/${folderId}`;
    const url = publicUrl;
    try {
      for (const element of req.files) {
        if (req.body[`${element.finalFolder}Key`] !== '') {
          fs.unlinkSync(req.body[`${element.finalFolder}Key`]);
        }
        const fileExtention = path.extname(element.fileName);
        const uniqueName = uuidv4();
        const location = `${url}/${finalFolder}/${folderId}/${uniqueName}${fileExtention}`;
        const Key = `${newFolder}/${uniqueName}${fileExtention}`;
        await fse
          .move(element.path, Key)
          .then(async () => {
            req.body[element.finalFolder] = location;
            req.body[`${element.finalFolder}Key`] = Key;
          })
          .catch((err) => {
            fsDeleteObjectsFolder(res, next, newFolder);
            res.status(401).json({ success: false, Error: err.toString() });
          });
      }
      next();
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, Error: error.toString() });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, Error: error.toString() });
  }
};

export const fsDeleteSingle = async (res, next, fileKey) => {
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

export const fsDeleteObjectsFolder = async (res, next, newFolder) => {
  fs.rmSync(newFolder, { recursive: true, force: true }, (error) => {
    if (error) {
      console.log(error);
      res.status(403).json({
        success: false,
        Error: error.toString(),
        ErrorCode: error?.code,
      });
    }
  });
  next();
};

export const deleteFsAwsError = async (req, res, next) => {
  //Check that form has some files to
  if (req.files.length !== 0) {
    // create Key for delete file from S3 or filesystem
    const key = req.body[`${req.files[0].finalFolder}Key`];
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
