const nextConnect = require('next-connect');

import dbConnect from '../../../helpers/dbConnect';
import verifyToken from '../../../helpers/verifyToken';
import middleware from '../../../middleware/multiparty';
import Agencies from '../../../models/Agencies';
import { setCookies } from 'cookies-next';
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
      const {
        _id,
        city_id,
        country_id,
        province_id,
        currencyCode_id,
        accountManager_id,
      } = req.body;
      delete req.body._id;
      req.body.phones = JSON.parse(req?.body?.phones);
      findAgentById(_id).then(async (oldAgent) => {
        for (var key in req.body) {
          if (
            typeof oldAgent[key] !== 'function' &&
            req.body[key] !== undefined
          ) {
            await deleteObjectsId(req, res, next, oldAgent);
            oldAgent.city_id = [];
            oldAgent.city_id.push(city_id);
            oldAgent.province_id = [];
            oldAgent.province_id.push(province_id);
            oldAgent.country_id = [];
            oldAgent.country_id.push(country_id);
            oldAgent.currencyCode_id = [];
            oldAgent.currencyCode_id.push(currencyCode_id);
            oldAgent.accountManager_id = [];
            oldAgent.accountManager_id.push(accountManager_id);
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
              const multiMap = await hz.getMultiMap('Agencies');
              await multiMap.destroy();
              await multiMap.put('allAgencies', totalAgent);
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
