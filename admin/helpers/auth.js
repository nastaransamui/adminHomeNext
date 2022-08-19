import Users from '../models/Users';
import Agencies from '../models/Agencies';
import dbConnect from './dbConnect';
import CryptoJS from 'crypto-js';
import jwt from 'jsonwebtoken';
import Roles from '../models/Roles';
import fs from 'fs';
var geoip = require('geoip-country');
/**
      const forwarded = req.headers['x-forwarded-for'];

      const ip =
        typeof forwarded === 'string'
          ? forwarded.split(/, /)[0]
          : req.socket.remoteAddress;

      console.log(ip);

      var geo = geoip.lookup(ip);

      console.log(geo?.country); */

export async function findUserByUsername({ username }) {
  const dbConnected = await dbConnect();
  const { success } = dbConnected;
  if (!success) {
    res.status(500).json({ success: false, Error: dbConnected.error });
  } else {
    let user = await Users.findOne({ userName: username });
    return user;
  }
}

export async function findUserById(_id) {
  const dbConnected = await dbConnect();
  const { success } = dbConnected;
  if (!success) {
    res.status(500).json({ success: false, Error: dbConnected.error });
  } else {
    let user = await Users.findById(_id, '-password');
    return user;
  }
}

export async function findAgentById(_id) {
  const dbConnected = await dbConnect();
  const { success } = dbConnected;
  if (!success) {
    res.status(500).json({ success: false, Error: dbConnected.error });
  } else {
    let agent = await Agencies.findById(_id);
    return agent;
  }
}

export async function findRoleById(_id) {
  const dbConnected = await dbConnect();
  const { success } = dbConnected;
  if (!success) {
    res.status(500).json({ success: false, Error: dbConnected.error });
  } else {
    let role = await Roles.findById(_id);
    return role;
  }
}

export async function updateAccessToken(user, res) {
  const accessToken = await jwtSign(user);
  const dbConnected = await dbConnect();
  const { success } = dbConnected;
  if (!success) {
    res.status(500).json({ success: false, Error: dbConnected.error });
  } else {
    const role = await Roles.findOne(
      { _id: { $in: user.role_id } },
      {
        _id: 0,
        icon: 0,
        remark: 0,
        isActive: 0,
        users_id: 0,
        roleName: 0,
        createdAt: 0,
        updatedAt: 0,
        __v: 0,
      }
    );
    if (role == null) {
      return {
        accessToken: null,
        accessRole: null,
        errorMessage: 'accessRoleNull',
      };
    }

    const accessRole = await jwtRole(role);
    user.accessToken = accessToken;
    user = await user.save();
    const { password, ...info } = user._doc;
    return {
      accessToken: accessToken,
      accessRole: accessRole,
      errorMessage: null,
    };
  }
}

export async function jwtRole(role) {
  const accessRole = jwt.sign(
    {
      routes: role.routes,
    },
    process.env.NEXT_PUBLIC_SECRET_KEY,
    { expiresIn: '7d' }
  );

  return accessRole;
}

export async function jwtSign(user) {
  const accessToken = jwt.sign(
    {
      _id: user._id,
      isAdmin: user.isAdmin,
      isVercel: user.isVercel,
      agents_id: user.agents_id,
      userName: user.userName,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      profileImage: user.profileImage,
      profileImageKey: user.profileImageKey,
      firstName: user.firstName,
      lastName: user.lastName,
      roleName: user.roleName,
      role_id: user.role_id,
      cityName: user.cityName,
      city_id: user.city_id,
      provinceName: user.provinceName,
      province_id: user.province_id,
      countryName: user.countryName,
      country_id: user.country_id,
      position: user.position,
      aboutMe: user.aboutMe,
    },
    process.env.NEXT_PUBLIC_SECRET_KEY,
    { expiresIn: '7d' }
  );
  return accessToken;
}

export function validatePassword(user, inputPassword) {
  const bytes = CryptoJS.AES.decrypt(
    user.password,
    process.env.NEXT_PUBLIC_SECRET_KEY
  );
  const originalPassword = bytes.toString(CryptoJS.enc.Utf8);

  const passwordsMatch = originalPassword == inputPassword;
  return passwordsMatch;
}

export async function hashPassword(req, res, next) {
  try {
    if (req.body?.password !== undefined && req.body?.password !== '') {
      const cryptoPassword = CryptoJS.AES.encrypt(
        req.body.password,
        process.env.NEXT_PUBLIC_SECRET_KEY
      ).toString();
      req.body.password = cryptoPassword;
    }
    next();
  } catch (error) {
    res
      .status(500)
      .json({ success: false, Error: 'Hashing password was error' });
  }
}

export async function createUserIsEmpty(req, res, next) {
  const dbConnected = await dbConnect();
  const { success } = dbConnected;
  if (!success) {
    res.status(500).json({ success: false, Error: dbConnected.error });
  } else {
    let userCollectionIsEmpty = await Users.find();
    const roleJson = fs.readFileSync(
      process.cwd() + '/helpers/superUserRole.json'
    );
    let role = JSON.parse(roleJson);
    let superUserRole = await Roles.findOne({
      roleName: role.roleName,
    });

    if (userCollectionIsEmpty.length == 0) {
      try {
        const userName = process.env.NEXT_PUBLIC_USERNAME;
        const isVercel =
          process.env.NEXT_PUBLIC_SERVERLESS == 'true' ? true : false;
        const cryptoPassword = CryptoJS.AES.encrypt(
          process.env.NEXT_PUBLIC_PASSWORD,
          process.env.NEXT_PUBLIC_SECRET_KEY
        ).toString();
        await Users.create({
          userName: userName,
          password: cryptoPassword,
          profileImage: '',
          profileImageKey: '',
          finalFolder: 'users',
          folderId: (Math.random() + 1).toString(36).substring(7),
          firstName: '',
          lastName: '',
          cityName: '',
          role_id: [],
          roleName: role.roleName,
          agents_id: [],
          city_id: [],
          provinde_id: [],
          provinceName: '',
          country_id: [],
          countryName: '',
          position: '',
          aboutMe: '',
          isAdmin: true,
          isVercel: isVercel,
          accessToken: '',
          twitter: [],
          facebook: [],
          google: [],
        });
        if (superUserRole == null) {
          const newRoleValue = await new Roles(role);
          //Create superuserrole and update user and role
          await newRoleValue.save(async (err, role) => {
            if (err) {
              res.status(500).json({ success: false, Error: err });
            } else {
              const newlyUserCreatedArray = await Users.find();
              const userId = newlyUserCreatedArray[0]._id;
              role.users_id.push(userId);
              newlyUserCreatedArray[0].role_id.push(role._id);
              role.save(async (err, newRole) => {
                if (err) {
                  res.status(500).json({ success: false, Error: err });
                } else {
                  const updatedUser = newlyUserCreatedArray[0];
                  await updatedUser.save(async (error, user) => {
                    if (err) {
                      res.status(500).json({ success: false, Error: err });
                    } else {
                      user.save(async (err, newUser) => {
                        if (err) {
                          res.status(500).json({ success: false, Error: err });
                        } else {
                          next();
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        } else {
          const newlyUserCreatedArray = await Users.find();
          const userId = newlyUserCreatedArray[0]._id;
          superUserRole.users_id.push(userId);
          newlyUserCreatedArray[0].role_id.push(superUserRole._id);
          superUserRole.save(async (err, newRole) => {
            if (err) {
              res.status(500).json({ success: false, Error: err });
            } else {
              const updatedUser = newlyUserCreatedArray[0];
              await updatedUser.save(async (error, user) => {
                if (error) {
                  res.status(500).json({ success: false, Error: err });
                } else {
                  user.save(async (erroro, newUser) => {
                    if (erroro) {
                      res.status(500).json({ success: false, Error: err });
                    } else {
                      next();
                    }
                  });
                }
              });
            }
          });
        }
      } catch (error) {
        console.log(error);
        res
          .status(500)
          .json({ success: false, Error: 'roles and users empty' });
      }
    } else {
      next();
    }
  }
}
