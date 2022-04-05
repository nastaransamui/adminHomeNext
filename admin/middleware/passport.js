import LocalStrategy from 'passport-local';
import passport from 'passport';
import { findUserByUsername, validatePassword } from '../helpers/auth';

export const authenticate = async (method, req, res) =>
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
  findUserByUsername({ username })
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
