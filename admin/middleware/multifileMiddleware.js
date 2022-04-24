import {
  fsDeleteObjectsFolder,
  fsCreateMulti,
  fsEditMulti,
  awsCreateMulti,
  awsDeleteObjectsFolder,
  awsEditMulti,
} from '../helpers/aws';

export const multifileMiddlewareCreate = async (req, res, next) => {
  const isVercel = process.env.NEXT_PUBLIC_SERVERLESS == 'true' ? true : false;
  req.body.isVercel = isVercel;
  if (req.files.length == 0) {
    //Todo no file upload
    next();
  } else {
    if (isVercel) {
      //Upload files to s3 and update body
      await awsCreateMulti(req, res, next);
    } else {
      //Move files to folder and update body
      await fsCreateMulti(req, res, next);
      // next();
    }
  }
};

export const MultifileMiddlewareDelete = async (req, res, next) => {
  const isVercel = process.env.NEXT_PUBLIC_SERVERLESS == 'true' ? true : false;
  if (req.body.isVercel) {
    //Upload files to s3 and update body
    const newFolder = `${req.body.finalFolder}/${req.body.folderId}`;
    await awsDeleteObjectsFolder(res, next, newFolder);
  } else {
    //delete folder
    const publicFolder = `${process.cwd()}/public`;
    const newFolder = `${publicFolder}/${req.body.finalFolder}/${req.body.folderId}`;
    await fsDeleteObjectsFolder(res, next, newFolder);
  }
};

export const multifileMiddlewareEdit = async (req, res, next) => {
  if (req.files.length == 0) {
    next();
  } else {
    if (req.body.isVercel) {
      req.body.isVercel = isVercel;
      await awsEditMulti(req, res, next);
    } else {
      req.body.isVercel = isVercel;
      await fsEditMulti(req, res, next);
    }
  }
};
