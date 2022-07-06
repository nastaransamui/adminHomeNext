const nextConnect = require('next-connect');

import dbConnect from '../../../helpers/dbConnect';
import verifyToken from '../../../helpers/verifyToken';
import middleware from '../../../middleware/multiparty';
import { findUserById, hashPassword, jwtSign } from '../../../helpers/auth';
import Users from '../../../models/Users';
import { setCookies } from 'cookies-next';
import { editMiddleware } from '../../../middleware/userMiddleware';
import { deleteFsAwsError } from '../../../helpers/aws';
import hazelCast from '../../../helpers/hazelCast';
import { updateObjectsId } from '../mainPageSetup/create';
import { deleteObjectsId } from '../mainPageSetup/delete';
import Agencies from '../../../models/Agencies';
import Roles from '../../../models/Roles';
var ObjectId = require('mongoose').Types.ObjectId;

const apiRoute = nextConnect({
  onNoMatch(req, res) {
    res
      .status(405)
      .json({ success: false, Error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(middleware);

apiRoute.post(
  verifyToken,
  hashPassword,
  editMiddleware,
  async (req, res, next) => {
    const dbConnected = await dbConnect();
    const { success } = dbConnected;
    if (!success) {
      res.status(500).json({ success: false, Error: dbConnected.error });
    } else {
      try {
        const { _id, selfProfileUpdate } = req.body;
        //Check if Password change if not delete from object
        if (req.body.password == '') {
          delete req.body.password;
        }
        req.body.agents_id = JSON.parse(req?.body?.agents_id);
        req.body.country_id = JSON.parse(req?.body?.country_id);
        req.body.province_id = JSON.parse(req?.body?.province_id);
        req.body.city_id = JSON.parse(req?.body?.city_id);
        req.body.role_id = JSON.parse(req?.body?.role_id);
        console.log(req.body.role_id);
        findUserById(_id).then(async (oldUser) => {
          console.log(req.body.role_id[0] !== oldUser.role_id[0]?.toString());
          if (req.body.role_id[0] !== oldUser.role_id[0]?.toString()) {
            await Roles.updateOne(
              { _id: { $in: oldUser?.role_id } },
              { $pull: { users_id: _id } },
              { multi: true }
            );
            await Roles.updateOne(
              { _id: { $in: req.body.role_id } },
              { $push: { users_id: _id } },
              { multi: true }
            );
          }
          // res.status(500).json({ success: false, Error: ' error.toString()' });
          if (oldUser.agents_id.length !== req.body.agents_id.length) {
            let agentsDeleteIds = oldUser.agents_id.filter(
              (x) => !req.body.agents_id.includes(x.toString())
            );
            await Agencies.updateMany(
              { _id: { $in: agentsDeleteIds } },
              { $set: { accountManager_id: [], accountManager: '' } },
              { multi: true }
            );
          }

          for (var key in req.body) {
            if (
              typeof oldUser[key] !== 'function' &&
              req.body[key] !== undefined
            ) {
              oldUser[key] = req.body[key];
              if (selfProfileUpdate) {
                const newAccessToken = await jwtSign(oldUser);
                oldUser.accessToken = newAccessToken;
                setCookies('adminAccessToken', newAccessToken, { req, res });
              }
            }
          }
          delete oldUser?.selfProfileUpdate;
          oldUser.save(async (err, result) => {
            if (err) {
              res.status(403).json({
                success: false,
                Error: err.toString(),
                ErrorCode: err?.code,
              });
            } else {
              await updateObjectsId(req, res, next, result);
              const totalUser = await Users.find().select('-password');
              const { hzErrorConnection, hz } = await hazelCast();
              if (!hzErrorConnection) {
                const multiMap = await hz.getMultiMap('Users');
                await multiMap.destroy();
                await multiMap.put('allUsers', totalUser);
                await hz.shutdown();
              }
              delete result.password;
              res.status(200).json({
                success: true,
                totalUsersLength: totalUser.length,
                data: result,
              });
            }
          });
        });
      } catch (error) {
        deleteFsAwsError(req, res, next);
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
