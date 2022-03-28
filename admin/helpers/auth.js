import Users from '../models/Users';
import dbConnect from './dbConnect';
import CryptoJS from 'crypto-js';
import jwt from 'jsonwebtoken';

export async function findUser({ username }) {
  await dbConnect();
  let user = await Users.findOne({ userName: username });
  return user;
}

export async function unpdateAccessToken(user) {
  await dbConnect();
  const accessToken = jwt.sign(
    {
      id: user._id,
      isAdmin: user.isAdmin,
      userName: user.userName,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      profileImage: user.profileImage,
      firstName: user.firstName,
      lastName: user.lastName,
      city: user.city,
      country: user.country,
      position: user.position,
      aboutMe: user.aboutMe,
    },
    process.env.NEXT_PUBLIC_SECRET_KEY,
    { expiresIn: '7d' }
  );
  user.accessToken = accessToken;
  user = await user.save();
  const { password, ...info } = user._doc;
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
  await dbConnect();
  try {
    const cryptoPassword = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.NEXT_PUBLIC_SECRET_KEY
    ).toString();
    req.body.password = cryptoPassword;
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, Error: 'Hashing password was error' });
  }
}

export async function createUserIsEmpty(req, res, next) {
  let collectionIsEmpty = await Users.find();
  if (collectionIsEmpty.length == 0) {
    const userName = process.env.NEXT_PUBLIC_USERNAME;
    const cryptoPassword = CryptoJS.AES.encrypt(
      process.env.NEXT_PUBLIC_PASSWORD,
      process.env.NEXT_PUBLIC_SECRET_KEY
    ).toString();
    await Users.create({
      userName: userName,
      password: cryptoPassword,
      isAdmin: true,
      firstName: '',
      lastName: '',
      city: '',
      country: '',
      position: '',
      aboutMe: '',
      twitter: [],
      facebook: [],
      google: [],
    });
    next();
  } else {
    next();
  }
}
