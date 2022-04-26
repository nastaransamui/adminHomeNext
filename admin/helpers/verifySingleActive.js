import dbConnect from './dbConnect';
import Videos from '../models/Videos';
import mongoose from 'mongoose';

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
      if (!req.body.isActive) {
        next();
      } else {
        var collection = mongoose.model(req?.body?.modelName);
        if (req?.body?.modelName == 'Videos') {
          collection
            .find({ isActive: true }, { isActive: 1 })
            .then(async (result) => {
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
            });
        } else {
          next();
        }
      }
    } catch (error) {
      res.status(500).json({ success: false, Error: error.toString() });
    }
  }
};

export default verifySingleActive;
