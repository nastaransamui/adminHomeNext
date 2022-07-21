const nextConnect = require('next-connect');

import dbConnect from '../../../helpers/dbConnect';
import verifyToken from '../../../helpers/verifyToken';
import mongoose from 'mongoose';
import Videos from '../../../models/Videos';
import Users from '../../../models/Users';
import Photos from '../../../models/Photos';
import Features from '../../../models/Features';
import About from '../../../models/About';
import { createAboutIsEmpty } from '../../../helpers/about';
import { ObjectId } from 'mongodb';

function paginate(array, valuesPerPage, valuesPageNumber) {
  // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
  return array.slice(
    (valuesPageNumber - 1) * valuesPerPage,
    valuesPageNumber * valuesPerPage
  );
}

const sort_by = (field, reverse, primer) => {
  const key = primer
    ? function (x) {
        return primer(x[field]);
      }
    : function (x) {
        return x[field];
      };

  reverse = !reverse ? 1 : -1;

  return function (a, b) {
    return (a = key(a)), (b = key(b)), reverse * ((a > b) - (b > a));
  };
};
const apiRoute = nextConnect({
  onNoMatch(req, res) {
    console.log('Error api rout');
    res
      .status(405)
      .json({ success: false, Error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.post(verifyToken, async (req, res, next) => {
  const dbConnected = await dbConnect();
  const { success } = dbConnected;
  if (!success) {
    res.status(500).json({ success: false, Error: dbConnected.error });
  } else {
    try {
      const { _id, modelName } = req.body;
      const collection = mongoose.model(modelName);
      switch (modelName) {
        case 'Users':
          console.log(req.body);
          var userValue = await collection.aggregate([
            { $match: { _id: ObjectId(_id) } },
            { $unset: ['password'] },
            {
              $lookup: {
                from: 'agencies',
                localField: 'agents_id',
                foreignField: '_id',
                as: 'agentsData',
              },
            },
            {
              $lookup: {
                from: 'roles',
                localField: 'role_id',
                foreignField: '_id',
                as: 'roleData',
              },
            },
          ]);
          console.log(userValue);
          const { page, rowsPerPage, order } = req?.query;
          const totalAgents = userValue[0].agentsData.length;
          userValue[0].agentsData = paginate(
            userValue[0].agentsData.sort(
              sort_by(
                req?.query['orderBy'],
                order == 'asc' ? false : true,
                (a) => {
                  return typeof a == 'boolean' || typeof a == 'number'
                    ? a
                    : typeof a == 'object'
                    ? a[0].number
                    : a.toUpperCase();
                }
              )
            ),
            parseInt(rowsPerPage),
            parseInt(page) + 1
          );
          if (userValue.length == 0) {
            res.status(400).json({ success: false, Error: `Notfind` });
          } else {
            res.status(200).json({
              success: true,
              data: userValue[0],
              totalAgents: totalAgents,
            });
          }

          break;

        default:
          let value =
            modelName == 'About'
              ? await collection.find({})
              : await collection.findById(_id);
          if (!value || value.length == 0) {
            if (modelName == 'About') {
              createAboutIsEmpty(req, res, next);
            } else {
              res
                .status(400)
                .json({ success: false, Error: `${modelName}Notfind` });
            }
          } else {
            res.status(200).json({
              success: true,
              data: modelName == 'About' ? value[0] : value,
            });
          }
          break;
      }
    } catch (error) {
      let errorText = error.toString();
      error?.kind == 'ObjectId' ? (errorText = 'Notfind') : errorText;
      res.status(500).json({ success: false, Error: errorText });
    }
  }
});

export default apiRoute;
