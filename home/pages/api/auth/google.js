import nextConnect from 'next-connect';
import passport from 'passport';
import dbConnect from '../../../helpers/dbConnect';
import Users from '../../../models/Users';
import Cookies from 'cookies';
import session from 'express-session';
import { googleStrategy } from '../../../middleware/passport';

passport.use(googleStrategy);
// used to serialize the user for the session
passport.serializeUser(function (user, done) {
  done(null, user);
});

// used to deserialize the user
passport.deserializeUser(async function (id, done) {
  await dbConnect();
  Users.findOne({ 'google.googleId': id }, function (err, user) {
    done(err, user);
  });
});

const apiRoute = nextConnect({
  onError: (err, req, res, next) => {
    console.log(err.toString());
    res.status(500).end('Something broke from facebook!' + err.toString());
  },
  onNoMatch: (req, res, next) => {
    res.status(404).end('Page is not found from Twietter');
  },
})
  .use(
    session({
      secret: process.env.NEXT_PUBLIC_SECRET_KEY,
      resave: true,
      saveUninitialized: true,
      name: 'google',
      cookie: { secure: false, sameSite: 'lax' },
    })
  )
  .use(passport.initialize())
  .use(passport.session())
  .use(
    '/api/auth/google',
    passport.authenticate('google', { scope: ['email', 'profile'] }),
    function (req, res) {
      const cookies = new Cookies(req, res);
      cookies.set('accessToken', req.user.accessToken, {
        httpOnly: false, // true by default
      });
      if (cookies.get('lang') !== undefined) {
        res.redirect(`/${cookies.get('lang')}`);
      } else {
        res.redirect(`/`);
      }
    }
  );

export default apiRoute;
