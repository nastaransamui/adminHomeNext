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
  let finalFiles = [];
  Object.entries(form).forEach((doc) => {
    for (const [key, value] of Object.entries(doc)) {
      if (typeof value == 'object') {
        value.forEach((element) => {
          // if (element?.fieldName !== 'hotelThumb') {
          // console.log(doc);

          finalFiles.push({
            fileName: element.originalFilename,
            path: element.path,
            fileType: element.headers['content-type'],
            finalFolder: element.fieldName,
            thumbnail:
              element?.originalFilename == doc[1][0][`originalFilename`],
          });
          // }
        });
      }
    }
  });
  finalFiles = finalFiles.filter((a) => a.finalFolder !== 'hotelThumb');
  return finalFiles;
};

middleware.use(async (req, res, next) => {
  const form = new multiparty.Form();

  form.parse(req, function (err, fields, files) {
    if (!err) {
      req.body = setFieldsObj(fields);
      req.files = setFilesObj(files);
      // res.status(500).json({ success: false, Error: 'err.toString()' });
      next();
    } else {
      console.log('Handle error from multiparty miideleware');
      res.status(500).json({ success: false, Error: err.toString() });
      next();
    }
  });
});

export default middleware;
