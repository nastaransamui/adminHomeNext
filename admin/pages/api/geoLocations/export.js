const nextConnect = require('next-connect');
import dbConnect from '../../../helpers/dbConnect';
import verifyToken from '../../../helpers/verifyToken';
import hazelCast from '../../../helpers/hazelCast';
import { downloadCountryMiddleware } from '../../../middleware/download';
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
  downloadCountryMiddleware,
  async (req, res, next) => {
    const dbConnected = await dbConnect();
    const { success } = dbConnected;
    if (!success) {
      res.status(500).json({ success: false, Error: dbConnected.error });
    } else {
      const { hzErrorConnection, hz } = await hazelCast();
      try {
        var deleteArray = [req.body.downloadKey];
        res.setHeader('Content-Type', 'image/jpg');
        res.status(200).json({
          success: true,
          fileLink: req.body.download,
        });
        if (!hzErrorConnection) {
          await hz.shutdown();
        }

        setTimeout(() => {
          if (req?.body?.isVercel) {
            awsDelete(req, res, next, deleteArray, (status, error) => {});
          } else {
            fsDelete(req, res, next, deleteArray, (status, error) => {});
          }
        }, 60000);
      } catch (error) {
        if (!hzErrorConnection) {
          await hz.shutdown();
        }

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
