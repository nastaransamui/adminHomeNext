const nextConnect = require('next-connect');
import dbConnect from '../../../helpers/dbConnect';
import verifyToken from '../../../helpers/verifyToken';
import { downloadMiddleware } from '../../../middleware/download';
import { deleteFsAwsError } from '../../../helpers/aws';

const apiRoute = nextConnect({
  onNoMatch(req, res) {
    res
      .status(405)
      .json({ success: false, Error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.post(verifyToken, downloadMiddleware, async (req, res, next) => {
  const dbConnected = await dbConnect();
  const { success } = dbConnected;
  if (!success) {
    res.status(500).json({ success: false, Error: dbConnected.error });
  } else {
    try {
      res.setHeader('Content-Type', 'image/jpg');
      res.status(200).json({
        success: true,
        fileLink: req.body.download,
      });
      setTimeout(() => {
        deleteFsAwsError(req, res, next);
      }, 60000);
    } catch (error) {
      deleteFsAwsError(req, res, next);
      res.status(500).json({ success: false, Error: error.toString() });
    }
  }
});

export default apiRoute;
