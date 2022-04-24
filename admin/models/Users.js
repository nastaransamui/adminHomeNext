import mongoose from 'mongoose';
const timeZone = require('mongoose-timezone');

const UsersSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    profileImage: { type: String, default: '' },
    profileImageKey: { type: String, default: '' },
    finalFolder: { type: String, required: true },
    folderId: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    city: { type: String },
    country: { type: String },
    position: { type: String },
    aboutMe: { type: String },
    isAdmin: { type: Boolean, default: false },
    isVercel: { type: Boolean },
    accessToken: { type: String, default: '' },
    twitter: [
      {
        twitterId: String,
        twitterUserName: String,
        twitterdipslayName: String,
        twitterProfile: String,
        twitterlocation: String,
        twitterBanner: String,
      },
    ],
    facebook: [],
    google: [],
  },
  { timestamps: true }
);
UsersSchema.plugin(timeZone);
export default mongoose.models.Users || mongoose.model('Users', UsersSchema);
