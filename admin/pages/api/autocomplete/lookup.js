const nextConnect = require('next-connect');
import dbConnect from '../../../helpers/dbConnect';
import verifyToken from '../../../helpers/verifyToken';
import hazelCast from '../../../helpers/hazelCast';
import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';
import Agencies from '../../../models/Agencies';

const apiRoute = nextConnect({
  onNoMatch(req, res) {
    res
      .status(405)
      .json({ success: false, Error: `Method '${req.method}' Not Allowed` });
  },
});

export function escapeRegExp(value) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}
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

apiRoute.post(verifyToken, async (req, res, next) => {
  const dbConnected = await dbConnect();
  const { success } = dbConnected;
  if (!success) {
    res.status(500).json({ success: false, Error: dbConnected.error });
  } else {
    try {
      const { modelName, fieldValue, filterValue, lookupFrom, _id } = req.body;
      const { hzErrorConnection, hz } = await hazelCast();
      const searchRegex = new RegExp(escapeRegExp(filterValue), 'i');
      switch (modelName) {
        case 'Users':
          if (lookupFrom == 'agencies') {
            var collection = mongoose.model(modelName);
            //Initiate match
            var match = {
              $match: { [`agentsData.${fieldValue}`]: searchRegex },
            };
            //Initiate add field
            var addFields = {
              $addFields: {},
            };
            //Unset string value of numbers
            var unset = {
              $unset: `agentsData.converted${fieldValue}`,
            };
            //Set match expresion base on type of fieldValue
            switch (fieldValue) {
              case 'creditAmount':
              case 'depositAmount':
              case 'remainCreditAmount':
              case 'remainDepositAmount':
                addFields = {
                  $addFields: {
                    [`agentsData.${`converted${fieldValue}`}`]: {
                      $toString: `$agentsData.${fieldValue}`,
                    },
                  },
                };
                match = {
                  $match: {
                    [`agentsData.${`converted${fieldValue}`}`]: searchRegex,
                  },
                };
                break;
              case 'phones':
                let phoneNumber = filterValue;
                if (!phoneNumber.startsWith('+')) {
                  phoneNumber = [
                    phoneNumber.slice(0, 0),
                    '+',
                    phoneNumber.slice(0),
                  ].join('');
                }
                const phoneRegex = new RegExp(escapeRegExp(phoneNumber), 'i');
                match = {
                  $match: { [`agentsData.${fieldValue}.number`]: phoneRegex },
                };
                break;
            }
            var valuesList = await collection.aggregate([
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
              { $unwind: '$agentsData' },
              { ...addFields },
              { ...match },
              { $sort: { 'agentsData.agentName': 1 } },
              { $limit: 50 },
              { ...unset },
              { $group: { _id: null, agentsData: { $push: '$agentsData' } } },
            ]);
            console.log(valuesList);
            console.log(searchRegex);
            console.log(match);
            if (valuesList.length > 0) {
              console.log(valuesList[0].agentsData);
              res
                .status(200)
                .json({ success: false, data: valuesList[0].agentsData });
            } else {
              res.status(200).json({ success: true, data: [] });
            }
          }
          break;
      }
    } catch (error) {
      res.status(500).json({ success: false, Error: error.toString() });
    }
  }
});

export default apiRoute;
