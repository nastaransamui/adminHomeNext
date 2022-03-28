import nextConnect from 'next-connect';
import { authenticate, localStrategy } from '../../../middleware/passport';
import passport from 'passport';
import cors from 'cors';
import { unpdateAccessToken, createUserIsEmpty } from '../../../helpers/auth';
import dbConnect from '../../../helpers/dbConnect';

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
  .post(createUserIsEmpty, async (req, res) => {
    await dbConnect();
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
