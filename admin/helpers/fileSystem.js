/**
 * All s3  move and delete files and folders
 */
import aws from 'aws-sdk';
import fs from 'fs';
const fse = require('fs-extra');
import { isJsonParsable } from './objectsIds';
const path = require('path');
import { v4 as uuidv4 } from 'uuid';
const { NEXT_PBULIC_FOLDER_PUBLIC_UAT, NEXT_PBULIC_FOLDER_PUBLIC_LIVE } =
  process.env;
aws.config.update({
  region: process.env.S3_AWS_REGION,
  accessKeyId: process.env.S3_AWS_ACCESS_KEY,
  secretAccessKey: process.env.S3_AWS_SECRET,
});
const s3Bucket = process.env.S3_AWS_BUCKET;
const s3 = new aws.S3(); // Create a new instance of S3
var publicFolder = `${process.cwd()}/public`;
const publicUrl =
  process.env.NODE_ENV == 'development'
    ? NEXT_PBULIC_FOLDER_PUBLIC_UAT
    : NEXT_PBULIC_FOLDER_PUBLIC_LIVE;

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

export const fsUpload = async (req, res, next) => {
  const { files } = req;
  const { finalFolder, folderId, countryFolder, modelName } = req.body;
  var ResponseData = [];
  var Key;
  var fileExtention;
  var uniqueName;
  var fileFolder;
  var location;
  var url = publicUrl;
  switch (modelName) {
    case 'Hotels':
      try {
        req.body.hotelImages = JSON.parse(req.body.hotelImages);
        req.body.imageKey = JSON.parse(req.body.imageKey);
        req.body.newFilesRecord = [];
        fileFolder = `${publicFolder}/${finalFolder}/${countryFolder}/${folderId}`;
        if (!fs.existsSync(fileFolder)) {
          fs.mkdirSync(fileFolder, { recursive: true });
        }
        for (const file of req.files) {
          fileExtention = path.extname(file.fileName);
          uniqueName = uuidv4();
          location = `${url}/${finalFolder}/${countryFolder}/${folderId}/${uniqueName}${fileExtention}`;
          Key = `${fileFolder}/${uniqueName}${fileExtention}`;
          await fse
            .move(file.path, Key)
            .then(async () => {
              req.body.hotelImages.push(location);
              req.body.imageKey.push(Key);
              //add new image for later delete on error
              req.body.newFilesRecord.push(Key);
              if (file.thumbnail) {
                req.body.hotelThumb = location;
              }
            })
            .catch((err) => {
              console.log(err);
              console.log('fileSystem fsUpload hotel error');
              fsDelete(req, res, next, newFilesRecord, (error, status) => {
                console.log({ error, status });
                console.log('fileSystem fsUpload hotel error callback');
              });
            });
        }
        req.body.hotelImages = JSON.stringify(req.body.hotelImages);
        req.body.imageKey = JSON.stringify(req.body.imageKey);
        next();
      } catch (error) {
        console.log('error on upload fs try catch should delete the files');
        res.status(500).json({ success: false, Error: error.toString() });
      }
      break;

    default:
      try {
        req.body.newFilesRecord = [];
        fileFolder = `${publicFolder}/${finalFolder}/${folderId}`;
        if (!fs.existsSync(fileFolder)) {
          fs.mkdirSync(fileFolder, { recursive: true });
        }
        for (const file of files) {
          fileExtention = path.extname(file.fileName);
          uniqueName = uuidv4();
          location = `${url}/${finalFolder}/${folderId}/${uniqueName}${fileExtention}`;
          Key = `${fileFolder}/${uniqueName}${fileExtention}`;
          await fse
            .move(file.path, Key)
            .then(async () => {
              //add new image for later delete on error
              req.body[file.finalFolder] = location;
              req.body[`${file.finalFolder}Key`] = Key;
              req.body.newFilesRecord.push(Key);
            })
            .catch((err) => {
              console.log(`upload error: ${err.toString}`);
              console.log(newFilesRecord);
              fsDelete(
                req,
                res,
                next,
                req.body.newFilesRecord,
                (error, status) => {
                  if (status) {
                    res.status(403).json({
                      success: false,
                      Error: error.toString(),
                    });
                  } else {
                    res.status(403).json({
                      success: false,
                      Error: err.toString(),
                    });
                    return;
                  }
                }
              );
            });
        }
        if (req.body.newFilesRecord.length == files.length) {
          next();
        }
      } catch (err) {
        if (req.body.newFilesRecord.length > 0) {
          const { newFilesRecord } = req.body;
          fsDelete(req, res, next, newFilesRecord, (status, error) => {
            if (status) {
              res.status(403).json({
                success: false,
                Error: error.toString(),
              });
            } else {
              res.status(500).json({ success: false, Error: err.toString() });
            }
          });
        } else {
          res.status(500).json({ success: false, Error: err.toString() });
        }
      }
      break;
  }
};

export const fsDelete = async (req, res, next, newFilesRecord, callback) => {
  const { modelName, hotelThumb, finalFolder, countryFolder, folderId } =
    req.body;
  try {
    // callback(false, null);
    for await (const filepath of newFilesRecord) {
      if (fs.existsSync(filepath)) {
        //If file exist
        fs.unlink(filepath, function (error) {
          if (error) {
            callback(true, error);
          } else {
            //Hotel thumbnail fix
            if (hotelThumb !== '' && hotelThumb !== undefined) {
              var thumbnailName = hotelThumb.substring(
                hotelThumb.lastIndexOf('/') + 1
              );
              if (filepath.endsWith(thumbnailName)) {
                req.body.hotelThumb = '';
              }
            }
          }
        });
      } else {
        // file not exist continue
        callback(false, null);
      }
    }

    callback(false, null);

    //Delete folder if not empty
    var fileFolder;

    switch (modelName) {
      case 'Hotels':
        fileFolder = `${publicFolder}/${finalFolder}/${countryFolder}/${folderId}`;
        if (fs.existsSync(fileFolder)) {
          var files = fs.readdirSync(fileFolder);
          if (files.length == 0) {
            fs.rmdirSync(fileFolder);
          }
        }
        break;

      default:
        fileFolder = `${publicFolder}/${finalFolder}/${folderId}`;
        if (fs.existsSync(fileFolder)) {
          var files = fs.readdirSync(fileFolder);
          if (files.length == 0) {
            fs.rmdirSync(fileFolder);
          }
        }
        break;
    }
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
