const nextConnect = require('next-connect');

import dbConnect from '../../../helpers/dbConnect';
import verifyToken from '../../../helpers/verifyToken';
import hazelCast from '../../../helpers/hazelCast';
import mongoose from 'mongoose';
import Currencies from '../../../models/Currencies';

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
  const { currency_id, modelName } = req.body;
  if (!success) {
    res.status(500).json({ success: false, Error: dbConnected.error });
  } else {
    try {
      const { hzErrorConnection, hz } = await hazelCast();
      var collection = mongoose.model(modelName);
      if (hzErrorConnection) {
        const currency = await collection.findOne({ _id: currency_id });
        if (currency !== null) {
          res.status(200).json({ success: true, data: currency });
        } else {
          res.status(500).json({ success: false, Error: 'noResult' });
        }
      } else {
        // use Catch system with Hz
        const multiMap = await hz.getMultiMap(modelName);
        const dataIsExist = await multiMap.containsKey(`all${modelName}`);
        if (dataIsExist) {
          const values = await multiMap.get(`all${modelName}`);
          for (const value of values) {
            const currency = value.filter((a) => a._id == currency_id);
            if (currency.length > 0) {
              res.status(200).json({ success: true, data: currency[0] });
            } else {
              res.status(500).json({ success: false, Error: 'noResult' });
            }
          }
          await hz.shutdown();
        } else {
          //find all currencies and add to map
          const currencies = await collection.find({});
          // add value to mapping
          if (currencies.length > 0) {
            await multiMap.put(`all${modelName}`, currencies);
          }
          const currency = currencies.filter((a) => a._id == currency_id);
          if (currency !== null) {
            res.status(200).json({ success: true, data: currency });
          } else {
            res.status(500).json({ success: false, Error: 'noResult' });
          }
        }
      }
    } catch (error) {
      res.status(500).json({ success: false, Error: error.toString() });
    }
  }
});

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb',
    },
  },
};

export default apiRoute;
