import LocalStrategy from 'passport-local';
import FacebookStrategy from 'passport-facebook';
import TwitterStrategy from 'passport-twitter';
var GoogleStrategy = require('passport-google-oauth2').Strategy;
import passport from 'passport';
import { findUser, validatePassword } from '../helpers/auth';
import Users from '../models/Users';
import dbConnect from '../helpers/dbConnect';
import jwt from 'jsonwebtoken';

export const authenticate = (method, req, res) =>
  new Promise((resolve, reject) => {
    passport.authenticate(method, { session: false }, (error, user) => {
      if (error) {
        reject(error);
      } else {
        resolve(user);
      }
    })(req, res);
  });

export const localStrategy = new LocalStrategy.Strategy(async function (
  username,
  password,
  done
) {
  findUser({ username })
    .then((user) => {
      if (!user) {
        done(null, { message: 'Wrong Email' });
      } else if (!validatePassword(user, password)) {
        done(null, { message: 'Wrong password' });
      } else {
        done(null, user);
      }
    })
    .catch((error) => {
      done(error);
    });
});

export const facebookStrategy = new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL,
    profileFields: [
      'id',
      'emails',
      'first_name',
      'last_name',
      'displayName',
      'photos',
    ],
  },
  async function (accessToken, refreshToken, profile, cb) {
    await dbConnect();
    const accessTokenLocal = jwt.sign(
      {
        facebookId: profile.id,
        userName: `${profile.displayName} ${profile.provider}`,
        isAdmin: false,
        provider: profile.provider,
        facebookUserName: profile.username,
        facebookdipslayName: profile.displayName,
        facebookProfile: profile.photos[0]?.value,
        facebookEmail: profile._json.email,
      },
      process.env.NEXT_PUBLIC_SECRET_KEY,
      { expiresIn: '7d' }
    );
    Users.findOneAndUpdate(
      { 'facebook.facebookId': profile.id },
      {
        $set: {
          isAdmin: false,
          profilePic: '',
          profileRoot: '',
          userName: `${profile.displayName} ${profile.provider}`,
          provider: profile.provider,
          password: null,
          accessToken: accessTokenLocal,
          'facebook.facebookId': profile.id,
          'facebook.facebookUserName': profile.username,
          'facebook.facebookdipslayName': profile.displayName,
          'facebook.facebookProfile': profile.photos[0]?.value,
          'facebook.facebookEmail': profile._json.email,
        },
      },
      { new: true, upsert: true },
      function (err, user) {
        return cb(err, user);
      }
    );
    // console.log(profile);
    // return cb(null, profile);
  }
);

export const twitterStrategy = new TwitterStrategy(
  {
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: process.env.TWITTER_CALLBACK_URL,
  },
  async function (token, tokenSecret, profile, cb) {
    await dbConnect();
    const accessToken = jwt.sign(
      {
        twitterId: profile.twitterId,
        userName: `${profile.displayName} ${profile.provider}`,
        isAdmin: false,
        provider: profile.provider,
        twitterUserName: profile.username,
        twitterdipslayName: profile.displayName,
        twitterProfile: profile._json.profile_image_url,
        twitterlocation: profile._json.location,
        twitterBanner: profile._json.profile_banner_url,
      },
      process.env.NEXT_PUBLIC_SECRET_KEY,
      { expiresIn: '7d' }
    );
    Users.findOneAndUpdate(
      { 'twitter.twitterId': profile.id },
      {
        $set: {
          isAdmin: false,
          profilePic: '',
          profileRoot: '',
          userName: `${profile.displayName} ${profile.provider}`,
          password: null,
          provider: profile.provider,
          accessToken: accessToken,
          'twitter.twitterId': profile.id,
          'twitter.twitterUserName': profile.username,
          'twitter.twitterdipslayName': profile.displayName,
          'twitter.twitterProfile': profile._json.profile_image_url,
          'twitter.twitterlocation': profile._json.location,
          'twitter.twitterBanner': profile._json.profile_banner_url,
        },
      },
      { new: true, upsert: true },
      function (err, user) {
        return cb(err, user);
      }
    );
  }
);

export const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    passReqToCallback: true,
  },
  async function (request, accessToken, refreshToken, profile, done) {
    await dbConnect();
    const accessTokenLocal = jwt.sign(
      {
        googleId: profile._json.sub,
        userName: `${profile.displayName} ${profile.provider}`,
        isAdmin: false,
        provider: profile.provider,
        googleUserName: profile.username,
        googledipslayName: profile.displayName,
        googleProfile: profile._json.picture,
        googleEmail: profile._json.email,
      },
      process.env.NEXT_PUBLIC_SECRET_KEY,
      { expiresIn: '7d' }
    );
    Users.findOneAndUpdate(
      { 'google.googleId': profile.id },
      {
        $set: {
          isAdmin: false,
          profilePic: '',
          profileRoot: '',
          provider: profile.provider,
          userName: `${profile.displayName} ${profile.provider}`,
          password: null,
          accessToken: accessTokenLocal,
          'google.googleId': profile.id,
          'google.googleUserName': profile.username,
          'google.googledipslayName': profile.displayName,
          'google.googleProfile': profile._json.picture,
          'google.googleEmail': profile._json.email,
        },
      },
      { new: true, upsert: true },
      function (err, user) {
        return done(err, user);
      }
    );
  }
);
