/**
 * All s3  move and delete files and folders
 */
import aws from 'aws-sdk';
import fs from 'fs';
import { isJsonParsable } from './objectsIds';
const path = require('path');
import { v4 as uuidv4 } from 'uuid';
aws.config.update({
  region: process.env.S3_AWS_REGION,
  accessKeyId: process.env.S3_AWS_ACCESS_KEY,
  secretAccessKey: process.env.S3_AWS_SECRET,
});
const s3Bucket = process.env.S3_AWS_BUCKET;
const s3 = new aws.S3(); // Create a new instance of S3

export const awsUpload = async (req, res, next) => {
  const { files } = req;
  const { finalFolder, folderId, countryFolder, modelName } = req.body;
  var ResponseData = [];
  var Key;
  var fileExtention;
  var uniqueName;
  var s3Params;
  switch (modelName) {
    case 'Hotels':
      req.body.hotelImages = JSON.parse(req.body.hotelImages);
      req.body.imageKey = JSON.parse(req.body.imageKey);
      req.body.newFilesRecord = [];
      files.map((file) => {
        fileExtention = path.extname(file.fileName);
        uniqueName = uuidv4();
        Key = `${finalFolder}/${countryFolder}/${folderId}/${uniqueName}${fileExtention}`;
        s3Params = {
          Bucket: s3Bucket,
          ContentType: file.fileType,
          Body: fs.createReadStream(file.path),
          ACL: 'public-read',
          Key: Key,
        };
        try {
          s3.upload(s3Params, async (err, data) => {
            if (err) {
              res.status(401).json({ success: false, Error: err });
            } else {
              req.body.hotelImages.push(data.Location);
              req.body.imageKey.push(data.Key);
              //add new image for later delete on error
              req.body.newFilesRecord.push(data.Key);
              ResponseData.push({ ...file, ...data });
              if (ResponseData.length == req.files.length) {
                ResponseData.map((a) => {
                  if (a.thumbnail) {
                    req.body.hotelThumb = a.Location;
                  }
                });
                req.body.hotelImages = JSON.stringify(req.body.hotelImages);
                req.body.imageKey = JSON.stringify(req.body.imageKey);
                next();
              }
            }
          });
        } catch (error) {
          res.status(500).json({ success: false, Error: error.toString() });
        }
      });
      break;

    default:
      req.body.newFilesRecord = [];
      files.map((file) => {
        fileExtention = path.extname(file.fileName);
        uniqueName = uuidv4();
        Key = `${finalFolder}/${folderId}/${uniqueName}${fileExtention}`;
        s3Params = {
          Bucket: s3Bucket,
          ContentType: file.fileType,
          Body: fs.createReadStream(file.path),
          ACL: 'public-read',
          Key: Key,
        };
        try {
          s3.upload(s3Params, async (err, data) => {
            if (err) {
              res.status(401).json({ success: false, Error: err });
            } else {
              req.body[file.finalFolder] = data.Location;
              req.body[`${file.finalFolder}Key`] = data.Key;
              //add new image for later delete on error
              req.body.newFilesRecord.push(data.Key);
              ResponseData.push(data);
              if (ResponseData.length == req.files.length) next();
            }
          });
        } catch (error) {
          res.status(500).json({ success: false, Error: error.toString() });
        }
      });
      break;
  }
  // next();
};

export const awsDelete = async (req, res, next, newFilesRecord, callback) => {
  const { modelName, hotelThumb } = req.body;
  var listParams;
  var listedObjects;
  var deleteParams;

  try {
    for (const prifix of newFilesRecord) {
      listParams = {
        Bucket: s3Bucket,
        Prefix: prifix,
      };
      listedObjects = await s3.listObjectsV2(listParams).promise();
      deleteParams = {
        Bucket: s3Bucket,
        Delete: { Objects: [] },
      };
      if (listedObjects.Contents.length === 0) {
        callback(false, null);
        return;
      }
      listedObjects.Contents.forEach(({ Key }) => {
        deleteParams.Delete.Objects.push({ Key });
      });
      s3.deleteObjects(deleteParams, (error, data) => {
        if (error) {
          callback(true, error);
        } else {
          //Hotel thumbnail fix
          if (hotelThumb !== '' && hotelThumb !== undefined) {
            const urlPerfix = 'amazonaws.com/';
            const index = hotelThumb?.indexOf(urlPerfix);
            const length = urlPerfix.length;
            const thumbPerfix = hotelThumb.slice(index + length);
            if (data['Deleted'][0].Key == thumbPerfix) {
              req.body.hotelThumb = '';
            }
          }
        }
      });
    }
    callback(false, null);
  } catch (error) {
    callback(true, error);
  }
};

//for download
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
    res.status(500).json({ success: false, Error: error.toString() });
  }
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
