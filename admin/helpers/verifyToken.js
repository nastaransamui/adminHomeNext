/**
 * verify token base on jwd secret key
 */

const jwt = require('jsonwebtoken');
import { removeCookies } from 'cookies-next';
function verify(req, res, next) {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.NEXT_PUBLIC_SECRET_KEY, (err, user) => {
      if (err) {
        removeCookies('adminAccessToken', { req, res });
        res.status(401).json({
          success: false,
          Error: 'Your Login is expired please relogin again!',
        });
      } else {
        req.user = user;
        next();
      }
    });
  } else {
    return res
      .status(500)
      .json({ success: false, Error: 'You are not authenticated!' });
  }
}

module.exports = verify;
