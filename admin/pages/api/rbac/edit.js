const nextConnect = require('next-connect');

import dbConnect from '../../../helpers/dbConnect';
import verifyToken from '../../../helpers/verifyToken';
import middleware from '../../../middleware/multiparty';
var ObjectId = require('mongoose').Types.ObjectId;
import { deleteFsAwsError } from '../../../helpers/aws';
import hazelCast from '../../../helpers/hazelCast';
import { findRoleById } from '../../../helpers/auth';
import Roles from '../../../models/Roles';

const apiRoute = nextConnect({
  onNoMatch(req, res) {
    res
      .status(405)
      .json({ success: false, Error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(middleware);

apiRoute.post(verifyToken, async (req, res, next) => {
  const dbConnected = await dbConnect();
  const { success } = dbConnected;
  if (!success) {
    res.status(500).json({ success: false, Error: dbConnected.error });
  } else {
    try {
      const { _id, users_id } = req.body;
      delete req.body._id;
      const usersIdValid = ObjectId.isValid(users_id);
      !usersIdValid && delete req.body.users_id;
      req.body.routes = JSON.parse(req?.body?.routes);
      findRoleById(_id).then(async (oldRole) => {
        for (var key in req.body) {
          if (
            typeof oldRole[key] !== 'function' &&
            req.body[key] !== undefined
          ) {
            if (users_id) {
              oldRole.users_id = [];
              oldRole.users_id.push(users_id);
            } else {
              oldRole.users_id = [];
            }
            oldRole[key] = req.body[key];
          }
        }
        oldRole.save(async (err, result) => {
          if (err) {
            res.status(403).json({
              success: false,
              Error: err.toString(),
              keyPattern: err?.keyPattern,
              ErrorCode: err?.code,
            });
          } else {
            const totalRoles = await Roles.aggregate([{ $match: {} }]);
            res.status(200).json({
              success: true,
              totalRolesLength: totalRoles.length,
              data: result,
            });
            const { hzErrorConnection, hz } = await hazelCast();
            if (!hzErrorConnection) {
              const multiMap = await hz.getMultiMap('Agencies');
              await multiMap.destroy();
              await multiMap.put('allAgencies', totalRoles);
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
