import {
  awsUpload,
  awsDelete,
  fsUpload,
  fsDelete,
} from '../helpers/fileSystem';
import { isJsonParsable } from '../helpers/objectsIds';

const isVercel = process.env.NEXT_PUBLIC_SERVERLESS == 'true' ? true : false;

export const fileUploadMiddelWare = async (req, res, next) => {
  req.body.isVercel = isVercel;
  const { files } = req;
  const { modelName } = req.body;
  try {
    switch (true) {
      //No any files uploaded check for deleted file and pass
      case files.length == 0:
        switch (true) {
          case !isJsonParsable(req.body?.deletedImage):
            //Delete file array is empty can pass
            next();
            break;
          default:
            //Edit without file upload but delete file
            const deleteImage = JSON.parse(req.body?.deletedImage);
            if (isVercel) {
              if (deleteImage.length == 0) {
                next();
              } else {
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
              if (deleteImage.length == 0) {
                next();
              } else {
                fsDelete(req, res, next, deleteImage, (status, error) => {
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
            }
            break;
        }
        break;

      //Files uploaded
      default:
        //Check if Deleted arrayis parsable and has some data
        if (!isJsonParsable(req.body?.deletedImage)) {
          if (modelName == 'Hotels') {
            console.log('ane sende call shod');
            req.body.hotelImages = '[]';
          }
          switch (true) {
            case isVercel:
              awsUpload(req, res, next);
              break;
            default:
              fsUpload(req, res, next);
              break;
          }
        } else {
          const deleteImage = JSON.parse(req.body?.deletedImage);
          if (deleteImage.length > 0) {
            switch (true) {
              case isVercel:
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
                break;

              default:
                fsDelete(req, res, next, deleteImage, (status, error) => {
                  if (status) {
                    res.status(403).json({
                      success: false,
                      Error: error,
                    });
                    return;
                  } else {
                    fsUpload(req, res, next);
                    return;
                  }
                });
                break;
            }
          } else {
            switch (true) {
              case isVercel:
                awsUpload(req, res, next);
                return;

              default:
                fsUpload(req, res, next);
                return;
            }
          }
        }
        break;
    }
  } catch (error) {
    res.status(500).json({ success: false, Error: error.toString() });
  }
};
