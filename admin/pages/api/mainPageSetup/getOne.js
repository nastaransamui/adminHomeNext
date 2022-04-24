const nextConnect = require('next-connect');

import dbConnect from '../../../helpers/dbConnect';
import verifyToken from '../../../helpers/verifyToken';
import mongoose from 'mongoose';

const apiRoute = nextConnect({
  onNoMatch(req, res) {
    console.log('some');
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
      const value = await collection.findById(_id).select('-password');
      if (!value) {
        res.status(400).json({ success: false, Error: `${modelName}Notfind` });
      } else {
        res.status(200).json({ success: true, data: value });
      }
    } catch (error) {
      res.status(500).json({ success: false, Error: error.toString() });
    }
  }
});

export default apiRoute;
