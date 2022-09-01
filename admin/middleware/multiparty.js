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
  var mergeFiles = [].concat.apply([], Object.values(form));
  var thumbOriginalFilename;
  const indexOfThumb = mergeFiles
    .map(function (e) {
      return e.fieldName;
    })
    .indexOf('hotelThumb');
  if (indexOfThumb !== -1) {
    thumbOriginalFilename = mergeFiles[indexOfThumb]?.originalFilename;
  }
  mergeFiles.forEach((element) => {
    finalFiles.push({
      fileName: element.originalFilename,
      path: element.path,
      fileType: element.headers['content-type'],
      finalFolder: element.fieldName,
      thumbnail: element?.originalFilename == thumbOriginalFilename,
    });
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
      console.log(err);
      res.status(500).json({ success: false, Error: err.toString() });
      next();
    }
  });
});

export default middleware;
