const nextConnect = require('next-connect');

import dbConnect from '../../../helpers/dbConnect';
import verifyToken from '../../../helpers/verifyToken';
import multiparty from '../../../middleware/multiparty';
import { hashPassword } from '../../../helpers/auth';
import Users from '../../../models/Users';
import { createMiddleware } from '../../../middleware/userMiddleware';
import { deleteOnError } from '../../../helpers/aws';

const apiRoute = nextConnect({
  onNoMatch(req, res) {
    res
      .status(405)
      .json({ success: false, Error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(multiparty);

apiRoute.post(
  verifyToken,
  hashPassword,
  createMiddleware,
  async (req, res, next) => {
    const dbConnected = await dbConnect();
    const { success } = dbConnected;
    if (!success) {
      res.status(500).json({ success: false, Error: dbConnected.error });
    } else {
      try {
        const newUser = await new Users(req.body);
        await newUser.save(async (err, result) => {
          if (err) {
            res.status(403).json({
              success: false,
              Error: err.toString(),
              ErrorCode: err?.code,
            });
          } else {
            const totalUser = await Users.find();
            res.status(200).json({
              success: true,
              totalUsersLength: totalUser.length,
              data: result,
            });
          }
        });
      } catch (error) {
        deleteOnError(req, res, next);
        res.status(500).json({ success: false, Error: error.toString() });
      }
    }
  }
);

export default apiRoute;
export const config = {
  api: {
    bodyParser: false,
  },
};
