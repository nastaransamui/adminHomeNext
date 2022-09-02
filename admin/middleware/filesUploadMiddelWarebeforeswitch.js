if (files.length == 0) {
  if (!isJsonParsable(req.body?.deletedImage)) {
    next();
  } else {
    //Edit without file upload but delete file
    const deleteImage = JSON.parse(req.body?.deletedImage);
    if (isVercel) {
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
    if (!isJsonParsable(req.body?.deletedImage)) {
      if (modelName == 'Hotels') {
        console.log('ane sende call shod');
        req.body.hotelImages = '[]';
      }
      fsUpload(req, res, next);
      return;
    } else {
      const deleteImage = JSON.parse(req.body?.deletedImage);
      if (deleteImage.length > 0) {
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
      } else {
        fsUpload(req, res, next);
        return;
      }
    }
  }
}
