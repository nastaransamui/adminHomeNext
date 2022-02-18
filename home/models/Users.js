import mongoose from 'mongoose';

const UsersSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    profilePic: { type: String, default: 'avatar.jpeg' },
    profileRoot: { type: String, default: 'default' },
    isAdmin: { type: Boolean, default: true },
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

export default mongoose.models.Users || mongoose.model('Users', UsersSchema);
