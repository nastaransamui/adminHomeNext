const nextConnect = require('next-connect');
import dbConnect from '../../../helpers/dbConnect';
import verifyToken from '../../../helpers/verifyToken';
import mongoose from 'mongoose';
import Countries from '../../../models/Countries';

const apiRoute = nextConnect({
  onNoMatch(req, res) {
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
    const { country_id, limitNumber, modelName } = req.body;
    try {
      var collection = mongoose.model(modelName);
      const valuesList = await collection.aggregate([
        { $match: { id: Number(country_id) } },
        { $project: { _id: 0, states: 1 } },
      ]);
      if (valuesList.length > 0) {
        const states = valuesList[0].states;
        states.map((doc) => {
          doc.totalCities = doc.cities.length;
          delete doc.cities;
          return doc;
        });
        res.status(200).json({
          success: true,
          data: states.slice(limitNumber - 10, limitNumber),
        });
      }
    } catch (error) {
      res.status(500).json({ success: false, Error: error.toString() });
    }
  }
});

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '5mb',
    },
  },
};

export default apiRoute;
