import nextConnect from 'next-connect';
import { authenticate, localStrategy } from '../../../middleware/passport';
import passport from 'passport';
import cors from 'cors';
import { unpdateAccessToken } from '../../../helpers/auth';

passport.use(localStrategy);
const apiRoute = nextConnect({
  onNoMatch(req, res) {
    res
      .status(405)
      .json({ success: false, Error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute
  .use(cors())
  .use(passport.initialize())
  .post(async (req, res) => {
    const { strategy } = req.body;
    try {
      const user = await authenticate(strategy, req, res);
      if (!user.message) {
        const accessToken = await unpdateAccessToken(user);
        res.status(200).send({ success: true, accessToken: accessToken });
      } else {
        res.send({ success: false, user });
      }
    } catch (error) {
      res.status(401).send(error.message);
    }
  });

export default apiRoute;
