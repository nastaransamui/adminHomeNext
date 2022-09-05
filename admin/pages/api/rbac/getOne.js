const nextConnect = require('next-connect');

import dbConnect from '../../../helpers/dbConnect';
import verifyToken from '../../../helpers/verifyToken';
import mongoose from 'mongoose';
import Roles from '../../../models/Roles';
import { ObjectId } from 'mongodb';
import hazelCast from '../../../helpers/hazelCast';
import Users from '../../../models/Users';

function paginate(array, valuesPerPage, valuesPageNumber) {
  // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
  return array.slice(
    (valuesPageNumber - 1) * valuesPerPage,
    valuesPageNumber * valuesPerPage
  );
}

const sort_by = (field, reverse, primer) => {
  const key = primer
    ? function (x) {
        return primer(x[field]);
      }
    : function (x) {
        return x[field];
      };

  reverse = !reverse ? 1 : -1;

  return function (a, b) {
    return (a = key(a)), (b = key(b)), reverse * ((a > b) - (b > a));
  };
};

const apiRoute = nextConnect({
  onNoMatch(req, res) {
    console.log('Error api rout');
    res
      .status(405)
      .json({ success: false, Error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.post(verifyToken, async (req, res, next) => {
  const dbConnected = await dbConnect();
  const { success } = dbConnected;

  if (!success) {
    res.status(500).json({ success: false, Error: dbConnected.error });
  } else {
    try {
      const { _id } = req.body;
      const collection = mongoose.model('Roles');
      const { page, rowsPerPage, order } = req?.query;
      const { hzErrorConnection, hz } = await hazelCast();
      if (hzErrorConnection) {
        const roleValue = await collection.aggregate([
          { $match: { _id: ObjectId(_id) } },
          {
            $lookup: {
              from: 'users',
              localField: 'users_id',
              pipeline: [
                {
                  $project: {
                    password: 0,
                    twitter: 0,
                    google: 0,
                    facebook: 0,
                    roleName: 0,
                    role_id: 0,
                    province_id: 0,
                    profileImageKey: 0,
                    folderId: 0,
                    finalFolder: 0,
                    country_id: 0,
                    city_id: 0,
                    accessToken: 0,
                  },
                },
              ],
              foreignField: '_id',
              as: 'usersData',
            },
          },
        ]);
        const totalUsers = roleValue[0].usersData.length;
        roleValue[0].usersData = paginate(
          roleValue[0].usersData.sort(
            sort_by(
              req?.query['orderBy'],
              order == 'asc' ? false : true,
              (a) => {
                return typeof a == 'boolean' || typeof a == 'number'
                  ? a
                  : typeof a == 'object'
                  ? a[0].number
                  : a.toUpperCase();
              }
            )
          ),
          parseInt(rowsPerPage),
          parseInt(page) + 1
        );
        if (roleValue.length > 0) {
          res.status(200).json({
            success: true,
            data: roleValue[0],
            totalUsers: totalUsers,
          });
        } else {
          res.status(403).json({ success: false, Error: 'Notfind' });
        }
      } else {
        const multiMap = await hz.getMultiMap('Roles');
        const dataIsExist = await multiMap.containsKey(`allRoles`);
        const userMultiMap = await hz.getMultiMap('Users');
        const usersDataIsExist = await userMultiMap.containsKey(`allUsers`);
        if (dataIsExist) {
          const values = await multiMap.get(`allRoles`);
          for (const value of values) {
            const currentRole = value.filter((a) => a._id == _id);
            if (usersDataIsExist) {
              const users = await userMultiMap.get(`allUsers`);
              for (const user of users) {
                const roleUsers = user.filter((a) =>
                  currentRole[0].users_id.includes(a._id)
                );
                const role = value.filter((a) => a._id == _id);
                const totalUsers = roleUsers.length;
                role[0].usersData = paginate(
                  roleUsers.sort(
                    sort_by(
                      req?.query['orderBy'],
                      order == 'asc' ? false : true,
                      (a) => {
                        return typeof a == 'boolean' || typeof a == 'number'
                          ? a
                          : typeof a == 'object'
                          ? a[0].number
                          : a.toUpperCase();
                      }
                    )
                  ),
                  parseInt(rowsPerPage),
                  parseInt(page) + 1
                );
                if (role.length > 0) {
                  res.status(200).json({
                    success: true,
                    data: role[0],
                    totalUsers: totalUsers,
                  });
                } else {
                  res.status(403).json({ success: false, Error: 'Notfind' });
                }
              }
            } else {
              const roleValue = await collection.aggregate([
                { $match: { _id: ObjectId(_id) } },
                {
                  $lookup: {
                    from: 'users',
                    localField: 'users_id',
                    pipeline: [
                      {
                        $project: {
                          password: 0,
                          twitter: 0,
                          google: 0,
                          facebook: 0,
                          roleName: 0,
                          role_id: 0,
                          province_id: 0,
                          profileImageKey: 0,
                          folderId: 0,
                          finalFolder: 0,
                          country_id: 0,
                          city_id: 0,
                          accessToken: 0,
                        },
                      },
                    ],
                    foreignField: '_id',
                    as: 'usersData',
                  },
                },
              ]);
              const totalUsers = roleValue[0].usersData.length;
              roleValue[0].usersData = paginate(
                roleValue[0].usersData.sort(
                  sort_by(
                    req?.query['orderBy'],
                    order == 'asc' ? false : true,
                    (a) => {
                      return typeof a == 'boolean' || typeof a == 'number'
                        ? a
                        : typeof a == 'object'
                        ? a[0].number
                        : a.toUpperCase();
                    }
                  )
                ),
                parseInt(rowsPerPage),
                parseInt(page) + 1
              );
              if (roleValue.length > 0) {
                res.status(200).json({
                  success: true,
                  data: roleValue[0],
                  totalUsers: totalUsers,
                });
              } else {
                res.status(403).json({ success: false, Error: 'Notfind' });
              }
            }
          }
          await hz.shutdown();
        } else {
          const roleValue = await collection.aggregate([
            { $match: { _id: ObjectId(_id) } },
            {
              $lookup: {
                from: 'users',
                localField: 'users_id',
                pipeline: [
                  {
                    $project: {
                      password: 0,
                      twitter: 0,
                      google: 0,
                      facebook: 0,
                      roleName: 0,
                      role_id: 0,
                      province_id: 0,
                      profileImageKey: 0,
                      folderId: 0,
                      finalFolder: 0,
                      country_id: 0,
                      city_id: 0,
                      accessToken: 0,
                    },
                  },
                ],
                foreignField: '_id',
                as: 'usersData',
              },
            },
          ]);
          const totalUsers = roleValue[0].usersData.length;
          roleValue[0].usersData = paginate(
            roleValue[0].usersData.sort(
              sort_by(
                req?.query['orderBy'],
                order == 'asc' ? false : true,
                (a) => {
                  return typeof a == 'boolean' || typeof a == 'number'
                    ? a
                    : typeof a == 'object'
                    ? a[0].number
                    : a.toUpperCase();
                }
              )
            ),
            parseInt(rowsPerPage),
            parseInt(page) + 1
          );
          if (roleValue.length > 0) {
            res.status(200).json({
              success: true,
              data: roleValue[0],
              totalUsers: totalUsers,
            });
            await hz.shutdown();
          } else {
            res.status(403).json({ success: false, Error: 'Notfind' });
            await hz.shutdown();
          }
        }
      }
    } catch (error) {
      let errorText = error.toString();
      error?.kind == 'ObjectId' ? (errorText = 'Notfind') : errorText;
      res.status(500).json({ success: false, Error: errorText });
    }
  }
});

export default apiRoute;
