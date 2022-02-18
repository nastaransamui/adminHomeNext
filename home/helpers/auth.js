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
      profilePic: user.profilePic,
      profileRoot: user.profileRoot,
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
