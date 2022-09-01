import dbConnect from './dbConnect';
import mongoose from 'mongoose';
import About from '../models/About';
import Agencies from '../models/Agencies';
import Countries from '../models/Countries';
import Features from '../models/Features';
import Hotels from '../models/Hotels';
import Photos from '../models/Photos';
import Roles from '../models/Roles';
import Users from '../models/Users';
import Videos from '../models/Videos';

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * funtion for search whole collection for single document and if only one value true return error
 */

const verifySingleActive = async (req, res, next) => {
  const dbConnected = await dbConnect();
  const { success } = dbConnected;
  if (!success) {
    res.status(500).json({ success: false, Error: dbConnected.error });
  } else {
    try {
      const { modelName } = req.body;
      switch (modelName) {
        case 'Videos':
          if (!req.body?.isActive) {
            next();
          } else {
            var collection = mongoose.model(req?.body?.modelName);
            var result = await collection.aggregate([
              { $match: { isActive: true } },
            ]);
            //There is no any result
            if (result.length == 0) {
              next();
            } else {
              if (result[0]._id.equals(req.body._id)) {
                next();
              } else {
                res.status(500).json({ success: false, Error: 'onlyOne' });
              }
            }
          }
          break;
        case 'Features':
          if (!req.body?.isActive) {
            next();
          } else {
            var collection = mongoose.model(req?.body?.modelName);
            var result = await collection.aggregate([
              { $match: { isActive: true } },
            ]);
            if (result.length < 3) {
              next();
            } else {
              if (result[0]._id.equals(req.body._id)) {
                next();
              } else {
                res.status(500).json({ success: false, Error: 'onlyThree' });
              }
            }
          }
          break;

        default:
          next();
          break;
      }
    } catch (error) {
      res.status(500).json({ success: false, Error: error.toString() });
    }
  }
};

export default verifySingleActive;
