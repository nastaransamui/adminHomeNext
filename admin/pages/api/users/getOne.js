const nextConnect = require('next-connect');

import dbConnect from '../../../helpers/dbConnect';
import verifyToken from '../../../helpers/verifyToken';
import { findUserById } from '../../../helpers/auth';

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
      const user = await findUserById(req.body._id);
      if (!user) {
        // User not Find
        res.status(400).json({ success: false, Error: 'userNotfind' });
      } else {
        res.status(200).json({ success: true, data: user });
      }
    } catch (error) {
      res.status(500).json({ success: false, Error: error.toString() });
    }
  }
});

export default apiRoute;
