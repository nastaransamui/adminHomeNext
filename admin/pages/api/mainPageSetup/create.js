const nextConnect = require('next-connect');
import dbConnect from '../../../helpers/dbConnect';
import verifyToken from '../../../helpers/verifyToken';
import verifySingleActive from '../../../helpers/verifySingleActive';
import multiparty from '../../../middleware/multiparty';
import hazelCast from '../../../helpers/hazelCast';
import { multifileMiddlewareCreate } from '../../../middleware/multifileMiddleware';
import { fsDeleteObjectsFolder } from '../../../helpers/aws';
import mongoose from 'mongoose';
import { hashPassword } from '../../../helpers/auth';
var ObjectId = require('mongoose').Types.ObjectId;
import Videos from '../../../models/Videos';
import Users from '../../../models/Users';
import Photos from '../../../models/Photos';
import Features from '../../../models/Features';
import Agencies from '../../../models/Agencies';
import Countries from '../../../models/Countries';
import Currencies from '../../../models/Currencies';
import Roles from '../../../models/Roles';

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
  verifySingleActive,
  multifileMiddlewareCreate,
  async (req, res, next) => {
    const dbConnected = await dbConnect();
    const { success } = dbConnected;
    if (!success) {
      res.status(500).json({ success: false, Error: dbConnected.error });
    } else {
      try {
        const { modelName } = req.body;
        var collection = mongoose.model(modelName);
        delete req.body._id;
        if (modelName == 'Agencies') {
          req.body.phones = JSON.parse(req?.body?.phones);
          req.body.accountManager_id = JSON.parse(req?.body?.accountManager_id);
          req.body.currencyCode_id = JSON.parse(req?.body?.currencyCode_id);
          req.body.country_id = JSON.parse(req?.body?.country_id);
          req.body.province_id = JSON.parse(req?.body?.province_id);
          req.body.city_id = JSON.parse(req?.body?.city_id);
        }
        if (modelName == 'Roles') {
          req.body.routes = JSON.parse(req?.body?.routes);
        }
        if (modelName == 'Users') {
          req.body.country_id = JSON.parse(req?.body?.country_id);
          req.body.province_id = JSON.parse(req?.body?.province_id);
          req.body.city_id = JSON.parse(req?.body?.city_id);
          req.body.role_id = JSON.parse(req?.body?.role_id);
        }
        const newValue = await new collection(req.body);
        await newValue.save(async (err, result) => {
          if (err) {
            if (modelName !== 'Roles') {
              fsDeleteObjectsFolder(req, res, next, req.body.folderId);
            }
            res.status(403).json({
              success: false,
              Error: err.toString(),
              keyPattern: err?.keyPattern,
              ErrorCode: err?.code,
            });
          } else {
            await updateObjectsId(req, res, next, result);
            const totalValues = await collection.find();
            const { hzErrorConnection, hz } = await hazelCast();
            if (!hzErrorConnection) {
              const multiMapu = await hz.getMultiMap('Users');
              const multiMapc = await hz.getMultiMap('Countries');
              const multiMapPr = await hz.getMultiMap('Provinces');
              const multiMapCt = await hz.getMultiMap('Cities');
              const multiMapCu = await hz.getMultiMap('Currencies');
              const multiMapAg = await hz.getMultiMap('Agencies');
              const multiMapRo = await hz.getMultiMap('Roles');
              await multiMapu.destroy();
              await multiMapc.destroy();
              await multiMapPr.destroy();
              await multiMapCt.destroy();
              await multiMapCu.destroy();
              await multiMapAg.destroy();
              await multiMapRo.destroy();
              const multiMap = await hz.getMultiMap(modelName);
              await multiMap.destroy();
              await multiMap.put(`all${modelName}`, totalValues);
              await hz.shutdown();
            }
            res.status(200).json({
              success: true,
              totalValuesLength: totalValues.length,
              data: result,
            });
          }
        });
      } catch (error) {
        console.log(error);
        console.log(req.body.folderId);
        fsDeleteObjectsFolder(req, res, next, req.body.folderId);
        res.status(500).json({ success: false, Error: error.toString() });
      }
    }
  }
);

export async function updateObjectsId(req, res, next, result) {
  const { modelName } = req.body;
  switch (modelName) {
    case 'Users':
      if (result.role_id.length > 0) {
        await Roles.updateOne(
          { _id: { $in: result.role_id } },
          {
            $addToSet: {
              users_id: result._id,
            },
          },
          { multi: true }
        );
      }
      if (result.country_id.length > 0) {
        await Countries.updateOne(
          { _id: { $in: result.country_id } },
          {
            $addToSet: {
              users_id: result._id,
            },
          },
          { multi: true }
        );
      }
      if (result.province_id.length > 0) {
        await Countries.updateOne(
          { 'states._id': { $in: result.province_id } },
          {
            $addToSet: {
              'states.$.users_id': result._id,
            },
          },
          { multi: true }
        );
      }

      if (result.city_id.length > 0) {
        await Countries.updateOne(
          { 'states.cities._id': { $in: result.city_id } },
          {
            $addToSet: {
              'states.$[outer].cities.$[inner].users_id': result._id,
            },
          },
          {
            arrayFilters: [
              { 'outer._id': result.province_id },
              { 'inner._id': result.city_id },
            ],
            multi: true,
          }
        );
      }
      break;
    case 'Agencies':
      await Countries.updateOne(
        { _id: { $in: result.country_id } },
        {
          $addToSet: {
            agents_id: result._id,
            'states.$[outer].agents_id': result._id,
            'states.$[outer].cities.$[inner].agents_id': result._id,
          },
        },
        {
          arrayFilters: [
            { 'outer._id': result.province_id },
            { 'inner._id': result.city_id },
          ],
        }
      );
      await Currencies.updateOne(
        { _id: { $in: result.currencyCode_id } },
        {
          $addToSet: {
            agents_id: result._id,
          },
        },
        { multi: true }
      );
      await Users.updateOne(
        { _id: { $in: result.accountManager_id } },
        {
          $addToSet: {
            agents_id: result._id,
          },
        },
        { multi: true }
      );
      break;
  }
}

export default apiRoute;
export const config = {
  api: {
    bodyParser: false,
  },
};
