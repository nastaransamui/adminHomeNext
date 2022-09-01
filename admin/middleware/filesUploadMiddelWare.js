import { awsUpload, awsDelete } from '../helpers/fileSystem';
import { isJsonParsable } from '../helpers/objectsIds';

const isVercel = process.env.NEXT_PUBLIC_SERVERLESS == 'true' ? true : false;

export const fileUploadMiddelWare = async (req, res, next) => {
  req.body.isVercel = isVercel;
  const { files } = req;
  const { modelName } = req.body;
  try {
    if (files.length == 0) {
      if (!isJsonParsable(req.body?.deletedImage)) {
        next();
      } else {
        //Edit without file upload but delete file
        const deleteImage = JSON.parse(req.body?.deletedImage);
        awsDelete(req, res, next, deleteImage, (status, error) => {
          if (status) {
            res.status(403).json({
              success: false,
              Error: error.toString(),
            });
          } else {
            next();
          }
        });
      }
    } else {
      if (isVercel) {
        if (!isJsonParsable(req.body?.deletedImage)) {
          if (modelName == 'Hotels') {
            console.log('ane sende call shod');
            req.body.hotelImages = '[]';
          }
          awsUpload(req, res, next);
        } else {
          const deleteImage = JSON.parse(req.body?.deletedImage);
          awsDelete(req, res, next, deleteImage, (status, error) => {
            if (status) {
              res.status(403).json({
                success: false,
                Error: error,
              });
              return;
            } else {
              awsUpload(req, res, next);
              return;
            }
          });
        }
      } else {
        res
          .status(500)
          .json({ success: false, Error: 'files should upload fs' });
      }
    }
  } catch (error) {
    res.status(500).json({ success: false, Error: error.toString() });
  }
};
