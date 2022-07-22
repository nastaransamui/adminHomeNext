const nextConnect = require('next-connect');

import dbConnect from '../../../helpers/dbConnect';
import verifyToken from '../../../helpers/verifyToken';
import middleware from '../../../middleware/multiparty';
import Agencies from '../../../models/Agencies';
import { editMiddleware } from '../../../middleware/userMiddleware';
import { deleteFsAwsError } from '../../../helpers/aws';
import hazelCast from '../../../helpers/hazelCast';
import { findAgentById } from '../../../helpers/auth';
import { deleteObjectsId } from '../mainPageSetup/delete';
import { updateObjectsId } from '../mainPageSetup/create';

const apiRoute = nextConnect({
  onNoMatch(req, res) {
    res
      .status(405)
      .json({ success: false, Error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(middleware);

apiRoute.post(verifyToken, editMiddleware, async (req, res, next) => {
  const dbConnected = await dbConnect();
  const { success } = dbConnected;
  if (!success) {
    res.status(500).json({ success: false, Error: dbConnected.error });
  } else {
    try {
      const { _id } = req.body;
      delete req.body._id;
      req.body.phones = JSON.parse(req?.body?.phones);
      req.body.accountManager_id = JSON.parse(req?.body?.accountManager_id);
      req.body.currencyCode_id = JSON.parse(req?.body?.currencyCode_id);
      req.body.country_id = JSON.parse(req?.body?.country_id);
      req.body.province_id = JSON.parse(req?.body?.province_id);
      req.body.city_id = JSON.parse(req?.body?.city_id);
      console.log(req.body);
      findAgentById(_id).then(async (oldAgent) => {
        for (var key in req.body) {
          if (
            typeof oldAgent[key] !== 'function' &&
            req.body[key] !== undefined
          ) {
            await deleteObjectsId(req, res, next, oldAgent);
            oldAgent[key] = req.body[key];
          }
        }
        oldAgent.save(async (err, result) => {
          if (err) {
            res.status(403).json({
              success: false,
              Error: err.toString(),
              keyPattern: err?.keyPattern,
              ErrorCode: err?.code,
            });
          } else {
            await updateObjectsId(req, res, next, result);
            const totalAgent = await Agencies.aggregate([{ $match: {} }]);
            res.status(200).json({
              success: true,
              totalAgentLength: totalAgent.length,
              data: result,
            });
            const { hzErrorConnection, hz } = await hazelCast();
            if (!hzErrorConnection) {
              const multiMapu = await hz.getMultiMap('Users');
              const multiMapc = await hz.getMultiMap('Countries');
              const multiMapPr = await hz.getMultiMap('Provinces');
              const multiMapCt = await hz.getMultiMap('Cities');
              const multiMapCu = await hz.getMultiMap('Currencies');
              const multiMapAg = await hz.getMultiMap('Agencies');
              await multiMapu.destroy();
              await multiMapc.destroy();
              await multiMapPr.destroy();
              await multiMapCt.destroy();
              await multiMapCu.destroy();
              await multiMapAg.destroy();
              await multiMapAg.put('allAgencies', totalAgent);
              await hz.shutdown();
            }
          }
        });
      });
    } catch (error) {
      deleteFsAwsError(req, res, next);
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
