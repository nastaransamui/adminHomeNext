const nextConnect = require('next-connect');

import dbConnect from '../../../helpers/dbConnect';
import verifyToken from '../../../helpers/verifyToken';
import middleware from '../../../middleware/multiparty';
import { hashPassword } from '../../../helpers/auth';
import { createNewUser, createNewUserWithImage } from '../../../helpers/users';

const apiRoute = nextConnect({
  onNoMatch(req, res) {
    res
      .status(405)
      .json({ success: false, Error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(middleware);

apiRoute.post(verifyToken, hashPassword, async (req, res, next) => {
  const dbConnected = await dbConnect();
  const { success } = dbConnected;
  if (!success) {
    res.status(500).json({ success: false, Error: dbConnected.error });
  } else {
    try {
      const isImageProvide = Object.keys(req.files).length !== 0;
      if (isImageProvide) {
        // User Upload Image
        await createNewUserWithImage(req.body, req.files, res);
      } else {
        // User not upload image
        await createNewUser(req.body, res, undefined);
      }
    } catch (error) {
      res.status(500).json({ success: false, Error: error.toString() });
    }
  }
});

export default apiRoute;
export const config = {
  api: {
    bodyParser: false,
  },
};
