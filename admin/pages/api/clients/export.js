const nextConnect = require('next-connect');
import dbConnect from '../../../helpers/dbConnect';
import verifyToken from '../../../helpers/verifyToken';
import { downloadClientsMiddleware } from '../../../middleware/download';
import { awsDelete, fsDelete } from '../../../helpers/fileSystem';

const apiRoute = nextConnect({
  onNoMatch(req, res) {
    res
      .status(405)
      .json({ success: false, Error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.post(
  verifyToken,
  downloadClientsMiddleware,
  async (req, res, next) => {
    const dbConnected = await dbConnect();
    const { success } = dbConnected;
    if (!success) {
      res.status(500).json({ success: false, Error: dbConnected.error });
    } else {
      try {
        var deleteArray = [req.body.downloadKey];
        res.setHeader('Content-Type', 'image/jpg');
        res.status(200).json({
          success: true,
          fileLink: req.body.download,
        });
        setTimeout(() => {
          if (req?.body?.isVercel) {
            awsDelete(req, res, next, deleteArray, (status, error) => {});
          } else {
            fsDelete(req, res, next, deleteArray, (status, error) => {});
          }
        }, 60000);
      } catch (error) {
        if (req?.body?.isVercel) {
          awsDelete(req, res, next, [req.body.downloadKey], (status, err) => {
            if (status) {
              res.status(500).json({ success: false, Error: err.toString() });
            }
          });
        } else {
          fsDelete(req, res, next, [req.body.downloadKey], (status, err) => {
            if (status) {
              res.status(500).json({ success: false, Error: err.toString() });
            }
          });
        }
      }
    }
  }
);

export default apiRoute;
