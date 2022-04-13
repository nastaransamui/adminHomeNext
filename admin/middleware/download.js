import Users from '../models/Users';
import {
  awsSingleFile,
  singleFileMove,
  deleteSingleFile,
} from '../helpers/aws';
const fs = require('fs');
const path = require('path');
import moment from 'moment';
const { AsyncParser } = require('json2csv');
const { Readable } = require('stream');

export const downloadMiddleware = async (req, res, next) => {
  const isVercel = process.env.NEXT_PUBLIC_SERVERLESS == 'true' ? true : false;
  Users.find({})
    .select('-password')
    .select('-accessToken')
    .select('-isVercel')
    .select('-__v')
    .select('-profileImageKey')
    .lean()
    .exec((err, users) => {
      if (err) {
        res.status(404).json({ success: false, Error: err.toString() });
      }
      var jsonContent = JSON.stringify(users);
      const fields = [
        {
          label: 'User ID',
          value: `_id`,
        },
        {
          label: 'User Name',
          value: `userName`,
        },
        {
          label: 'Created date',
          value: (fields) =>
            moment(fields[`createdAt`]).format('MMMM Do YYYY, H:mm'),
        },
        {
          label: 'Last update',
          value: (fields) =>
            moment(fields[`updatedAt`]).format('MMMM Do YYYY, H:mm'),
        },
        {
          label: 'First Name',
          value: `firstName`,
        },
        {
          label: 'Last Name',
          value: `lastName`,
        },
        {
          label: 'City',
          value: `city`,
        },
        {
          label: 'Country',
          value: `country`,
        },
        {
          label: 'User Position',
          value: `position`,
        },
        {
          label: 'Admin Access',
          value: `isAdmin`,
        },
        {
          label: 'Image link',
          value: `profileImage`,
        },
        {
          label: 'User Discription',
          value: (fields) => fields['aboutMe'].replace(/[\r\n]+/g, ' '),
        },
      ];
      const opts = { fields };
      const transformOpts = { excelStrings: true, eol: ',' };
      const input = Readable.from([jsonContent]);
      const asyncParser = new AsyncParser(opts, transformOpts);
      const parsingProcessor = asyncParser.fromInput(input);
      parsingProcessor
        .promise()
        .then((csv) => {
          fs.writeFile(
            path.join('/tmp', 'users.csv'),
            csv,
            'utf8',
            async function (err) {
              if (err) {
                res.status(403).json({ success: false, Error: err.toString() });
                console.log(
                  'An error occured while writing csv Object to File.'
                );
              }
              res.setHeader('Content-Type', 'image/jpg');
              req.body.isVercel = isVercel;
              req.files = {
                fileName: 'users.csv',
                path: '/tmp/users.csv',
                finalFolder: req.body.finalFolder,
              };
              if (isVercel) {
                await awsSingleFile(req, res, next, req.body.finalFolder);
                //delete from /tmp
                deleteSingleFile(res, next, req.files.path);
              } else {
                await singleFileMove(req, res, next, req.body.finalFolder);
              }
            }
          );
        })
        .catch((err) => {
          res.status(403).json({ success: false, Error: err.toString() });
        });
    });
};
