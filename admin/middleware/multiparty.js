import nextConnect from 'next-connect';
import multiparty from 'multiparty';

const middleware = nextConnect();

// Set formdata to object
const setFieldsObj = (form) => {
  const finalFields = {};
  Object.entries(form).forEach((doc) => {
    const keys = doc[0];
    const values =
      doc[1][0] == 'true' ? true : doc[1][0] == 'false' ? false : doc[1][0];
    Object.assign(finalFields, { [keys]: values });
  });
  return finalFields;
};

// Set files object if exist
const setFilesObj = (form) => {
  const finalFiles = {};
  Object.entries(form).forEach((doc) => {
    Object.assign(finalFiles, {
      fileName: doc[1][0].originalFilename,
      path: doc[1][0].path,
      fileType: doc[1][0].headers['content-type'],
      finalFolder: doc[0],
    });
  });
  return finalFiles;
};

middleware.use(async (req, res, next) => {
  const form = new multiparty.Form();

  form.parse(req, function (err, fields, files) {
    if (!err) {
      req.body = setFieldsObj(fields);
      req.files = setFilesObj(files);
      next();
    } else {
      console.log('Handle error from multiparty miideleware');
      res.status(500).json({ success: false, Error: err.toString() });
      next();
    }
  });
});

export default middleware;
