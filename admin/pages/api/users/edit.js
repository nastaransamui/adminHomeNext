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
        const { city_id, country_id, province_id, agents_id } = req.body;
        const cityIdValid = ObjectId.isValid(city_id);
        const provinceIdValid = ObjectId.isValid(province_id);
        const countryIdValid = ObjectId.isValid(country_id);
        const agentIdValid = ObjectId.isValid(agents_id);
        !cityIdValid && delete req.body.city_id;
        !provinceIdValid && delete req.body.province_id;
        !countryIdValid && delete req.body.country_id;
        !agentIdValid && delete req.body.agents_id;

        findUserById(_id).then(async (oldUser) => {
          for (var key in req.body) {
            if (
              typeof oldUser[key] !== 'function' &&
              req.body[key] !== undefined
            ) {
              await deleteObjectsId(req, res, next, oldUser);
              if (city_id) {
                oldUser.city_id = [];
                oldUser.city_id.push(city_id);
              } else {
                oldUser.city_id = [];
              }
              if (province_id) {
                oldUser.province_id = [];
                oldUser.province_id.push(province_id);
              } else {
                oldUser.province_id = [];
              }
              if (country_id) {
                oldUser.country_id = [];
                oldUser.country_id.push(country_id);
              } else {
                oldUser.country_id = [];
              }
              if (agents_id) {
                oldUser.agents_id = [];
                oldUser.agents_id.push(agents_id);
              } else {
                oldUser.agents_id = [];
              }
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
