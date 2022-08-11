const nextConnect = require('next-connect');

import dbConnect from '../../../helpers/dbConnect';
import verifyToken from '../../../helpers/verifyToken';
import hazelCast from '../../../helpers/hazelCast';
import mongoose from 'mongoose';
import Countries from '../../../models/Countries';

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
  const { country_id, modelName } = req.body;
  if (!success) {
    res.status(500).json({ success: false, Error: dbConnected.error });
  } else {
    try {
      const { hzErrorConnection, hz } = await hazelCast();
      var collection = mongoose.model(modelName);
      if (hzErrorConnection) {
        const valuesList = await collection.aggregate([
          { $match: { id: Number(country_id) } },
          {
            $addFields: {
              totalStates: { $size: '$states' },
            },
          },
          { $unset: 'states' },
        ]);
        if (valuesList.length > 0) {
          const country = valuesList[0];
          res.status(200).json({ success: true, data: country });
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
            var country = value.filter((a) => a.id == country_id);
            res.status(200).json({ success: true, data: country[0] });
          }
          await hz.shutdown();
        } else {
          //find all countries and add to map
          const valuesList = await collection.aggregate([
            {
              $addFields: {
                totalStates: { $size: '$states' },
              },
            },
            { $unset: 'states' },
          ]);
          // add value to mapping
          if (valuesList.length > 0) {
            await multiMap.put(`all${modelName}`, valuesList);
          }
          var country = valuesList.filter((a) => a.id == country_id);
          if (country.length > 0) {
            res.status(200).json({ success: true, data: country[0] });
            await hz.shutdown();
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
